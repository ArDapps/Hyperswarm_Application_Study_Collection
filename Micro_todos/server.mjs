// server.js
import app from "./app.js";
import DHT from "hyperdht";
import RPC from "@hyperswarm/rpc";
import { addTodoItem, getTodoItem, listTodoItems } from "./models/todoModel.js";

const PORT = process.env.PORT || 3000;

// إعداد HyperDHT
const dht = new DHT();
const keyPair = DHT.keyPair();

// إعداد RPC
const rpc = new RPC();

const server = rpc.createServer();

server.on("request", async (req, res) => {
  if (req.method === "add_todo") {
    const { key, value } = req.params;
    await addTodoItem(key, value);
    res.end({ success: true });
  } else if (req.method === "get_todo") {
    const { key } = req.params;
    const result = await getTodoItem(key);
    res.end(result);
  } else if (req.method === "list_todos") {
    const todos = await listTodoItems();
    res.end(todos);
  } else {
    res.end({ error: "Unknown method" });
  }
});

server.listen(keyPair);

console.log(
  `RPC server is running with public key: ${keyPair.publicKey.toString("hex")}`
);

// بدء تشغيل خادم Express
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
