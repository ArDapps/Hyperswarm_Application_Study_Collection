const Hyperswarm = require("hyperswarm");
const Hypercore = require("hypercore");
const Hyperbee = require("hyperbee");
const DHT = require("hyperdht");
const RPC = require("@hyperswarm/rpc");

// Create a Hypercore feed
const feed = new Hypercore("./employee-feed");

// Create a Hyperbee database
const db = new Hyperbee(feed, {
  keyEncoding: "utf-8",
  valueEncoding: "json",
});

// Initialize Hyperswarm
const swarm = new Hyperswarm();
const dht = new DHT();

// Join a DHT topic
const topic = Buffer.alloc(32).fill("employee-salary");
swarm.join(topic, { server: true, client: true });

// Set up RPC server
const rpcServer = new RPC();

// Define RPC methods
rpcServer.register("put", async (params) => {
  await db.put(params.employeeId, params.salary);
  return { status: "ok" };
});

rpcServer.register("get", async (params) => {
  const value = await db.get(params.employeeId);
  return { status: "ok", value };
});

// Handle new connections
swarm.on("connection", (socket) => {
  rpcServer.listen(socket);
  console.log("New connection established");
});

console.log("Employee Salary Service is running...");
