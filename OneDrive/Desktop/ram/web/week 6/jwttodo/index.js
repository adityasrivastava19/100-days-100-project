const express = require("express");
const fs = require("fs");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json())
const jwt_secert = process.env.JWT_SECRET || "!@#$%^&*()";
app.use(cors());
app.use(express.json());
const FILE = "todos.json";
const users = [];
//sign up
app.post('/sigin', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "all feild are required" });
  }
  const user = users.find(u => u.username === username);
  if (user) {
    return res.status(409).json({ message: "user exist" });
  }
  const hpass = await bcrypt.hash(password, 10);
  users.push({
    username: username,
    password: hpass
  });
  res.json({ message: "you are signed up" });
});
//log in
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  const ismatch = await bcrypt.compare(password, user.password);
  if (!ismatch) {
    return res.status(401).json({ message: "invalid password" });
  }
  const token = jwt.sign({ username }, jwt_secert, { expiresIn: "1h" });
  res.json({ token });
});
function authmiddle(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ message: "acess denied" })
  }
  const token = auth.split(" ")[1];
  jwt.verify(token, jwt_secert, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "acess denied" });
    }
    req.user = decoded;
    next();
  });
}
// if file doesn't exist, create it
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, "[]");
}

function readTodos() {
  const data = fs.readFileSync(FILE, "utf-8");
  return JSON.parse(data);
}

function writeTodos(todos) {
  fs.writeFileSync(FILE, JSON.stringify(todos, null, 2));
}

// Get all todos
app.get("/todos", authmiddle, (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// Add a todo
app.post("/todos", authmiddle, (req, res) => {
  const todos = readTodos();
  const { task } = req.body;

  if (!task) return res.status(400).send("Task required");

  const newTodo = {
    id: Date.now(),
    task,
    done: false
  };

  todos.push(newTodo);
  writeTodos(todos);
  res.json(newTodo);
});

// Mark done
app.put("/todos/:id", authmiddle, (req, res) => {
  const todos = readTodos();
  const id = Number(req.params.id);

  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).send("Not found");

  todo.done = true;
  writeTodos(todos);
  res.json(todo);
});

// Delete
app.delete("/todos/:id", authmiddle, (req, res) => {
  const todos = readTodos();
  const id = Number(req.params.id);

  const updated = todos.filter(t => t.id !== id);
  writeTodos(updated);
  res.send("Deleted");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
