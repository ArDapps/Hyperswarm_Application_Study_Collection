import app from "./app.js";
import DHT from "hyperdht";
import RPC from "@hyperswarm/rpc";
import { addTodoItem, getTodoItem, listTodoItems } from "./models/todoModel.js";
import { connectToService } from "./services/rpcClient.js";

const PORT = process.env.PORT || 3002;

// HyperDHT setup
const dht = new DHT();
const keyPair = DHT.keyPair();

// RPC setup
const rpc = new RPC();
const server = rpc.createServer();

server.on("request", async (req, res) => {
  if (req.method === "add_todo") {
    const { userId, value } = req.params;
    const todo = await addTodoItem(userId, value);
    res.end({ success: true, todo });
  } else if (req.method === "get_todo") {
    const { key } = req.params;
    const result = await getTodoItem(key);
    res.end(result);
  } else if (req.method === "list_todos") {
    const { userId } = req.params;
    const todos = await listTodoItems(userId);
    res.end(todos);
  } else {
    res.end({ error: "Unknown method" });
  }
});

server.listen(keyPair);

console.log(
  `Todo RPC server is running with public key: ${keyPair.publicKey.toString(
    "hex"
  )}`
);

// Start Express server
app.listen(PORT, () => {
  console.log(`Todo server is running on port ${PORT}`);
});
