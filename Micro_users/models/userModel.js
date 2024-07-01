import Hypercore from "hypercore";

const feed = new Hypercore("./hypercore-user-storage", {
  valueEncoding: "json",
});

export async function addUser(id, name) {
  await feed.append({ id, name });
}

export async function getUser(id) {
  for await (const { seq, value } of feed.createReadStream()) {
    if (value.id === id) {
      return value;
    }
  }
  return null;
}

export async function listUsers() {
  const users = [];
  for await (const { seq, value } of feed.createReadStream()) {
    users.push(value);
  }
  return users;
}
