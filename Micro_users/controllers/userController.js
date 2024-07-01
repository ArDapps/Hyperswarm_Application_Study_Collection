import {
  addUser as addUserModel,
  getUser as getUserModel,
  listUsers as listUsersModel,
} from "../models/userModel.js";

export async function addUser(req, res) {
  const { id, name } = req.body;
  await addUserModel(id, name);
  res.json({ success: true });
}

export async function getUser(req, res) {
  const { id } = req.params;
  const result = await getUserModel(id);
  res.json(result);
}

export async function listUsers(req, res) {
  const users = await listUsersModel();
  res.json(users);
}
