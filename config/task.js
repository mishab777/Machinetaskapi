import { db } from "../config/db.js";

// Add Task
export const addTask = (req, res) => {
    const { title, desc, rank, userId } = req.body;

    if (!title || !userId) {
        return res.status(400).json({ error: "Title and userId are required" });
    }

    const query = "INSERT INTO tasks (`title`, `desc`, `rank`, userId) VALUES (?, ?, ?, ?)";
    db.query(query, [title, desc || null, rank || 0, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        res.status(201).json({ message: "Task created successfully", taskId: result.insertId });
    });
};

// Update Task
export const updateTask = (req, res) => {
    const { id } = req.params; // Extract ID from URL
    const { title, desc, rank } = req.body; // Extract fields from the body

    if (!id) {
        return res.status(400).json({ error: "Task ID is required" });
    }

    const query = "UPDATE tasks SET title = ?, `desc` = ?, `rank` = ? WHERE id = ?";
    db.query(query, [title, desc || null, rank || 0, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json({ message: "Task updated successfully" });
    });
};


// Remove Task
export const removeTask = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Task ID is required" });
    }

    const query = "DELETE FROM tasks WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    });
};


// Get Unranked Tasks
export const getUnrankedTasks = (req, res) => {
    const query = "SELECT * FROM tasks WHERE rank IS NULL";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        res.status(200).json(results);
    });
};

export const getAllTasks = (req, res) => {
    const query = "SELECT * FROM tasks";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        res.status(200).json(results);
    });
};

// Get Ranked Tasks
export const getRankedTasks = (req, res) => {
    const query = "SELECT * FROM tasks WHERE rank IS NOT NULL";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        res.status(200).json(results);
    });
};

// POST /tasks/rank - Update task ranks
export const updateTaskRanks = (req, res) => {
    const tasks = req.body.tasks; // Expecting an array of { id, rank }

    if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).json({ error: "Invalid data format." });
    }

    const updates = tasks.map(task => {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE tasks SET rank = ? WHERE id = ?";
            db.query(sql, [task.rank, task.id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    });

    Promise.all(updates)
        .then(() => res.json({ message: "Ranks updated successfully." }))
        .catch(err => res.status(500).send(err));
};
