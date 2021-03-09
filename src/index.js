const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

const checksRepositoryById = (request, response, next) => {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id === id);
  if(index < 0) {
    return response.status(404).json({error: `'Repository not found' ${index} : ${JSON.stringify(repositories)} : ${id}`});
  }

  request.index = index;
  request.repository = repositories[index];
  next();
};

app.get("/repositories", (_, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checksRepositoryById, (request, response) => {
  const { index, repository } = request;
  const updatedRepository = request.body;
  
  delete updatedRepository.likes;
  repositories[index] = { ...repository, ...updatedRepository };

  return response.json(repositories[index]);
});

app.delete("/repositories/:id", checksRepositoryById, (request, response) => {
  const { index } = request;

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checksRepositoryById, (request, response) => {
  const { repository } = request;

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
