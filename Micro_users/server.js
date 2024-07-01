import app from "./app.js";
import DHT from "hyperdht";
import RPC from "@hyperswarm/rpc";
import { addUser, getUser, listUsers } from "./models/userModel.js";
import { connectToService } from "./services/rpcClient.js";

const PORT = process.env.PORT || 3001;

// HyperDHT setup
const dht = new DHT();
const keyPair = DHT.keyPair();

// RPC setup
const rpc = new RPC();
const server = rpc.createServer();

server.on("request", async (req, res) => {
  if (req.method === "add_user") {
    const { id, name } = req.params;
    await addUser(id, name);
    res.end({ success: true });
  } else if (req.method === "get_user") {
    const { id } = req.params;
    const result = await getUser(id);
    res.end(result);
  } else if (req.method === "list_users") {
    const users = await listUsers();
    res.end(users);
  } else {
    res.end({ error: "Unknown method" });
  }
});

server.listen(keyPair);

console.log(
  `User RPC server is running with public key: ${keyPair.publicKey.toString(
    "hex"
  )}`
);

// Start Express server
app.listen(PORT, () => {
  console.log(`User server is running on port ${PORT}`);
});
