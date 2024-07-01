import DHT from "hyperdht";
import RPC from "@hyperswarm/rpc";
import b4a from "b4a";

const rpc = new RPC();

export const connectToService = (publicKey) => {
  return new Promise((resolve, reject) => {
    const publicKeyBuffer = b4a.from(publicKey, "hex"); // Convert the public key to a buffer
    const client = rpc.connect(publicKeyBuffer);
    client.on("open", () => {
      resolve(client);
    });
    client.on("error", reject);
  });
};
