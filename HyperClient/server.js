const DHT = require("@hyperswarm/dht");
const readline = require("readline");

// Create a new DHT node
const node = new DHT();

// Generate a key pair for the server
const keyPair = DHT.keyPair();

console.log("Server public key:", keyPair.publicKey.toString("hex"));

// Listen for incoming connections
const server = node.createServer();

server.on("connection", (socket) => {
  console.log("New connection established");

  socket.on("data", (data) => {
    console.log("Client:", data.toString());
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", (line) => {
    socket.write(line);
  });

  socket.write("Hello from server!");
});

server.listen(keyPair, () => {
  console.log("Server is listening and announced on the DHT network");
});
