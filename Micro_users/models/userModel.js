import Hypercore from "hypercore";
import { v4 as uuidv4 } from "uuid";

const feed = new Hypercore("./hypercore-user-storage", {
  valueEncoding: "json",
});

export async function addUser(name) {
  await feed.ready(); // Ensure the feed is ready before appending
  const id = uuidv4(); // Generate a unique ID
  await feed.append({ id, name });
  console.log(`User added: { id: ${id}, name: ${name} }`);
  return { id, name };
}

export async function getUser(id) {
  await feed.ready(); // Ensure the feed is ready before reading
  for await (const { seq, value } of feed.createReadStream()) {
    console.log(`Reading value: ${JSON.stringify(value)}`); // Log each value being read
    if (value && value.id === id) {
      return value;
    }
  }
  return null;
}

export async function listUsers() {
  await feed.ready(); // Ensure the feed is ready before reading
  const users = [];
  for await (const { seq, value } of feed.createReadStream()) {
    if (value) {
      users.push(value);
    }
  }
  return users;
}
