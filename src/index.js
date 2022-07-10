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
    return response.status(404).send({ error: "User não encontrado" });
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
    const user = {
      id: uuidv4(),
      name: name,
      username: username,
      todos: [],
    };

    users.push(user);

    return response.status(201).send(user);
  }
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  return response.status(200).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // O TITLE E O DEADLINE NÃO VEM NO BODY
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // O TITLE E O DEADLINE NÃO VEM NO BODY
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    response.status(400).send({ error: "Não encontrado" });
  } else {
    todo.title = title;
    todo.deadline = new Date(deadline);
  }

  return response.json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // OK
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    response.status(400).send({ error: "Não encontrado" });
  } else {
    todo.done = true;
  }

  return response.json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // OK
  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    response.status(404).send({ error: "Não encontrado" });
  } else {
    user.todos.splice(todoIndex, 1);
  }

  return response.status(204);
});

module.exports = app;
