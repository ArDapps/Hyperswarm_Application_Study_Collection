const DHT = require("@hyperswarm/dht");
const express = require("express");
const bodyParser = require("body-parser");
const readline = require("readline");

// Create a new DHT node
const node = new DHT();
const app = express();
app.use(bodyParser.json());

const serverPublicKey =
  "0b4ca14f961708cf0352c6818093a975780a8cbb2c20801fafb069e6f509aa7a";

(async () => {
  try {
    // Connect to the server
    const socket = node.connect(Buffer.from(serverPublicKey, "hex"));

    socket.on("open", () => {
      console.log("Connected to server");
      socket.write("Hello from client!");
    });

    socket.on("data", (data) => {
      console.log("Server:", data.toString());
    });

    socket.on("error", (err) => {
      console.error("Connection error:", err);
    });

    socket.on("close", () => {
      console.log("Connection closed");
    });

    // Create an API endpoint to send messages to the server
    app.post("/send", (req, res) => {
      const message = req.body.message;
      if (!message) {
        return res.status(400).send("Message is required");
      }
      socket.write(message);
      res.status(200).send("Message sent");
    });

    // Start the Express server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`API server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to server:", err);
  }
})();
