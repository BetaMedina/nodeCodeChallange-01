const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  if(repositories.length){
    return response.json(repositories)
  }
  return response.status(204).json()
});

app.post("/repositories", (request, response) => {
  const {...data} = request.body
  const payload = {id:uuid(),...data,likes:0}
  repositories.push(payload);
  return response.status(201).json(payload)
});

app.put("/repositories/:id", (request, response) => {
  const{id} = request.params
  const{title,url,techs} = request.body

  const index = repositories.findIndex(res=>res.id === id)
  if(index < 0){
    return response.status(400).json({
      err: "Repositorie not found"
    })
  }
  const {likes} = repositories[index]
  
  repositories[index] = {id,title,url,techs,likes}
  return response.json(repositories[index])
}); 

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params
  const index = repositories.findIndex(res=>res.id === id)
 
  if(index < 0){
    return response.status(400).json({
      err: "Repositorie not found"
    })
  }

  repositories.splice(index,1);
  return response.status(204).json({msg:"Deleted with success"})

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params
  const index = repositories.findIndex( res => res.id === id)

  if(index < 0){
    return response.status(400).json({
      err: "Repositorie not found"
    })
  }
  const {likes} = repositories[index]
  repositories[index].likes = likes + 1

  return response.json(repositories[index])
});

module.exports = app;
