import express from "express";
import { addUser, getUser, listUsers } from "../controllers/userController.js";

const router = express.Router();

router.post("/users", addUser);
router.get("/users", listUsers);
router.get("/users/:id", getUser);

export default router;
