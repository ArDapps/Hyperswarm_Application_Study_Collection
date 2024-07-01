import express from "express";
import { addTodo, getTodo, listTodos } from "../controllers/todoController.js";

const router = express.Router();

router.post("/todos", addTodo);
router.get("/todos", listTodos); // Use query parameter to filter by userId
router.get("/todos/:id", getTodo);

export default router;
