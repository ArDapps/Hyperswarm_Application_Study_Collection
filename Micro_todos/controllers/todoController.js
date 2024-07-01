// controllers/todoController.js
import {
  addTodoItem,
  getTodoItem,
  listTodoItems,
} from "../models/todoModel.js";

export async function addTodo(req, res) {
  const { key, value } = req.body;
  const toDo = await addTodoItem(key, value);
  res.json({ success: true, toDo });
}

export async function getTodo(req, res) {
  const { key } = req.params;
  const result = await getTodoItem(key);
  res.json(result);
}

export async function listTodos(req, res) {
  const todos = await listTodoItems();
  res.json(todos);
}
