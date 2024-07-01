import app from "./app.js";
import RPC from "@hyperswarm/rpc";
import { addTodoItem, getTodoItem, listTodoItems } from "./models/todoModel.js";

const PORT = process.env.PORT || 3002;

// RPC setup
const rpc = new RPC();
const server = rpc.createServer();

server.on("request", async (req, res) => {
  const params = JSON.parse(req.toString()); // Parse the buffer data to JSON
  if (req.method === "add_todo") {
    const { userId, value } = params;
    const todo = await addTodoItem(userId, value);
    res.end({ success: true, todo });
  } else if (req.method === "get_todo") {
    const { key } = params;
    const result = await getTodoItem(key);
    res.end(result);
  } else if (req.method === "list_todos") {
    const { userId } = params;
    const todos = await listTodoItems(userId);
    res.end(todos);
  } else {
    res.end({ error: "Unknown method" });
  }
});

await server.listen();
console.log(
  `Todo RPC server is running with public key: ${server.publicKey.toString(
    "hex"
  )}`
);

// Start Express server
app.listen(PORT, () => {
  console.log(`Todo server is running on port ${PORT}`);
});
