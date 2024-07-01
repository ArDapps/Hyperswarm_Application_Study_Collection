// models/todoModel.js
import Hypercore from "hypercore";

const feed = new Hypercore("./hypercore-storage", { valueEncoding: "json" });

export async function addTodoItem(key, value) {
  await feed.append({ key, value });
}

export async function getTodoItem(key) {
  for await (const { seq, value } of feed.createReadStream()) {
    if (value.key === key) {
      return value;
    }
  }
  return null;
}

export async function listTodoItems() {
  const todos = [];
  for await (const { seq, value } of feed.createReadStream()) {
    todos.push({ value });
  }
  return todos;
}
