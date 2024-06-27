const tape = require("tape");
const RPC = require("@hyperswarm/rpc");
const DHT = require("hyperdht");

const dht = new DHT();

tape("should save and retrieve employee salary", async (t) => {
  t.plan(4);

  const employeeId = "employee1";
  const salary = 50000;

  const topic = Buffer.alloc(32).fill("employee-salary");

  const client = RPC();

  // Connect to the employee salary service
  const socket = await dht.connect(topic);

  // Wait for the connection to be established
  socket.once("connect", async () => {
    const rpcClient = client.wrap(socket);

    // Save employee salary
    try {
      const putResponse = await rpcClient.put({ employeeId, salary });
      t.equal(putResponse.status, "ok", "Salary saved successfully");

      // Retrieve employee salary
      const getResponse = await rpcClient.get({ employeeId });
      t.equal(getResponse.status, "ok", "Retrieved salary successfully");
      t.equal(getResponse.value, salary, "Retrieved salary matches");
    } catch (err) {
      t.fail(err.message);
    }
    t.end();
  });
});
