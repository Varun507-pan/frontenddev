import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { loadTasks, createTask, updateTask, saveTasks } from "../services/localService";
import useAuth from "../hooks/useAuth";

export default function TaskForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      const tasks = loadTasks();
      const t = tasks.find((x) => String(x.id) === id);
      if (!t) {
        setError("Task not found");
        return;
      }
      setTitle(t.title);
      setDescription(t.description);
      setStatus(t.status);
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) { setError("Title is required"); return; }

    if (isEdit) {
      const tasks = loadTasks().map((t) =>
        String(t.id) === id ? { ...t, title, description, status, updatedAt: new Date().toISOString() } : t
      );
      saveTasks(tasks);
    } else {
      const newTask = {
        id: Date.now(),
        userId: user.id,
        title,
        description,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      createTask(newTask);
    }
    navigate("/dashboard");
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 720, mx: "auto" }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        <Typography variant="h6">{isEdit ? "Edit Task" : "Add Task"}</Typography>

        <TextField label="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required />
        <TextField label="Description" value={description} onChange={(e)=>setDescription(e.target.value)} multiline rows={4} />
        <TextField select label="Status" value={status} onChange={(e)=>setStatus(e.target.value)}>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>

        {error && <Typography color="error">{error}</Typography>}

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" type="submit">Save</Button>
          <Button variant="outlined" onClick={() => navigate("/dashboard")}>Cancel</Button>
        </Box>
      </Box>
    </Paper>
  );
}
