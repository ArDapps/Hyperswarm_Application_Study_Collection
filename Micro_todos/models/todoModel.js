import Hypercore from "hypercore";
import { v4 as uuidv4 } from "uuid";

const feed = new Hypercore("./hypercore-storage", { valueEncoding: "json" });

export async function addTodoItem(userId, value) {
  await feed.ready(); // Ensure the feed is ready before appending
  const id = uuidv4(); // Generate a unique ID
  await feed.append({ id, userId, value });
  console.log(
    `Todo item added: { id: ${id}, userId: ${userId}, value: ${value} }`
  );
  return { id, userId, value };
}

export async function getTodoItem(id) {
  await feed.ready(); // Ensure the feed is ready before reading
  for await (const { seq, value } of feed.createReadStream()) {
    if (value && value.id === id) {
      return value;
    }
  }
  return null;
}

export async function listTodoItems(userId = null) {
  await feed.ready(); // Ensure the feed is ready before reading
  const todos = [];
  for await (const { seq, value } of feed.createReadStream()) {
    if (!userId || (value && value.userId === userId)) {
      todos.push(value);
    }
  }
  return todos;
}
