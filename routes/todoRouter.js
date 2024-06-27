// routes/todoRoutes.js
import express from "express";
import { addTodo, getTodo, listTodos } from "../controllers/todoController.js";

const router = express.Router();

router.post("/todos", addTodo);
router.get("/todos", listTodos);
router.get("/todos/:key", getTodo);

export default router;
