import express from "express";
import { addTask, getAllTasks, getUnrankedTasks, removeTask, updateTask, updateTaskRanks } from "../config/task.js";

const router = express.Router()

router.post("/addTask", addTask)
router.patch("/updateTask/:id", updateTask);
router.delete("/removeTask/:id", removeTask)
router.post("/rankedTask", updateTaskRanks)
router.get("/unrankedTask",getUnrankedTasks)
router.get("/allTaks", getAllTasks)


export default router