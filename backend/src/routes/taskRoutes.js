import express from "express";
import { createTask, getTasks, getTask, updateTask, deleteTask } from "../controllers/taskController.js";

const router = express.Router();

router.post("/tasks", createTask);
router.get("/tasks", getTasks);
router.get("/tasks/:id", getTask);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

export default router;
