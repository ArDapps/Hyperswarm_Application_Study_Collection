import Hyperswarm from "hyperswarm";
import Hypercore from "hypercore";
import Hyperbee from "hyperbee";
import DHT from "hyperdht";
import RPC from "@hyperswarm/rpc";
import http from "http";

const hostname = "127.0.0.1";
const port = 3000;

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
const rpc = new RPC();

rpc.on("command", async (command, args, cb) => {
  if (command === "put") {
    const { employeeId, salary } = args;
    try {
      await db.put(employeeId, salary);
      cb(null, { status: "ok" });
    } catch (error) {
      cb(error);
    }
  } else if (command === "get") {
    const { employeeId } = args;
    try {
      const value = await db.get(employeeId);
      cb(null, { status: "ok", value });
    } catch (error) {
      cb(error);
    }
  } else {
    cb(new Error("Unknown command"));
  }
});

// Handle new connections
swarm.on("connection", (socket) => {
  rpc.listen(socket);
  console.log("New connection established");
});

// Create HTTP server to handle GET requests
const httpServer = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World\n");
  } else {
    res.statusCode = 404;
    res.end("Not Found\n");
  }
});

httpServer.listen(port, hostname, () => {
  console.log(`HTTP server running at http://${hostname}:${port}/`);
});

console.log("Employee Salary Service is running...");
