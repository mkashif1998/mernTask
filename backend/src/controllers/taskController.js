import Task from "../models/Task.js";
import Joi from "joi";

// Task Validation Schema
const taskSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().optional(),
  completed: Joi.boolean().optional(),
});

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single task
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task Not Found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: "Task Not Found" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task Not Found" });

    res.json({ message: "Task Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
