import {
  addTodoItem,
  getTodoItem,
  listTodoItems,
} from "../models/todoModel.js";

export async function addTodo(req, res) {
  const { userId, value } = req.body;
  const todo = await addTodoItem(userId, value);
  console.log(
    `Todo item added: { id: ${todo.id}, userId: ${todo.userId}, value: ${todo.value} }`
  );
  res.json({ success: true, todo });
}

export async function getTodo(req, res) {
  const { id } = req.params;
  const result = await getTodoItem(id);
  res.json(result);
}

export async function listTodos(req, res) {
  const { userId } = req.query; // Use query parameter to filter by userId
  const todos = await listTodoItems(userId);
  res.json(todos);
}
