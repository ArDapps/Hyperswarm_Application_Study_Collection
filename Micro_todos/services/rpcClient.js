import DHT from "hyperdht";
import RPC from "@hyperswarm/rpc";

const dht = new DHT();
const rpc = new RPC();

export const connectToService = (publicKey) => {
  return new Promise((resolve, reject) => {
    const socket = dht.connect(publicKey);
    socket.on("open", () => {
      const client = rpc.wrap(socket);
      resolve(client);
    });
    socket.on("error", reject);
  });
};
