import {
  addUser as addUserModel,
  getUser as getUserModel,
  listUsers as listUsersModel,
} from "../models/userModel.js";
import { connectToService } from "../services/rpcClient.js";

// Replace this with the actual public key of the Todo service
const TODO_SERVICE_PUBLIC_KEY =
  "ce43bfd73500084b7017a1b00c079dad538d9ff75fffdc5f0de7207c70b7ed33";

export async function addUser(req, res) {
  const { name } = req.body;
  const user = await addUserModel(name);
  console.log(`User added: { id: ${user.id}, name: ${user.name} }`);

  // Connect to Todo service and add initial todos
  try {
    const todoServiceClient = await connectToService(TODO_SERVICE_PUBLIC_KEY);
    const initialTodos = [
      { value: "Welcome to your new Todo list!" },
      { value: "Here is your first task." },
    ];
    for (const todo of initialTodos) {
      await todoServiceClient.request("add_todo", {
        userId: user.id,
        value: todo.value,
      });
    }
    console.log(`Initial todos added for user ${user.id}`);
  } catch (error) {
    console.error("Error adding initial todos:", error);
  }

  res.json({ success: true, user });
}

export async function getUser(req, res) {
  const { id } = req.params;
  console.log(`Fetching user with id: ${id}`);
  const user = await getUserModel(id);

  if (user) {
    try {
      const todoServiceClient = await connectToService(TODO_SERVICE_PUBLIC_KEY);
      const tasks = await todoServiceClient.request("list_todos", {
        userId: id,
      });
      user.tasks = tasks;
      console.log(`Tasks fetched for user ${id}: ${JSON.stringify(tasks)}`);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      user.tasks = [];
    }
    res.json(user);
  } else {
    console.log(`User not found: ${id}`);
    res.status(404).json({ error: "User not found" });
  }
}

export async function listUsers(req, res) {
  const users = await listUsersModel();
  res.json(users);
}
