const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find((user) => user.username === username); // retorna o objeto completo

  if (!user) {
    return response.status(400).send({ error: "User não encontrado" });
  }

  request.user = user;
  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui

  const { name, username } = request.body;

  const verifyExistUser = users.some((user) => user.username === username);

  if (verifyExistUser) {
    return response.status(400).send({ error: "username já existe" });
  } else {
    users.push({
      id: uuidv4(),
      name: name,
      username: username,
      todos: [],
    });
    return response.status(200).send(users);
  }
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  return response.status(200).json(user);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  user.todos.push({
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  });

  return response.status(200).json(user);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const indexTarefa = user.todos.findIndex((idTarefa) => idTarefa.id === id);

  user.todos[indexTarefa].title = title;
  user.todos[indexTarefa].deadline = deadline;

  return response.status(200).json(users);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
