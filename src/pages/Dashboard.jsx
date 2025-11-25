import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import PaginationComp from "../components/Pagination";
import { formatDate } from "../utils/formatDate";
import { loadTasks, deleteTask as removeTask, saveTasks } from "../services/localService";
import useAuth from "../hooks/useAuth";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [allTasks, setAllTasks] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const tasks = loadTasks();
    setAllTasks(tasks.filter((t) => t.userId === user.id));
  }, [user]);

  const filtered = useMemo(() => {
    let s = allTasks.slice();
    if (query) {
      s = s.filter((t) =>
        (t.title + " " + t.description)
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    }
    if (filter !== "all") s = s.filter((t) => t.status === filter);
    if (sort === "newest")
      s.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else s.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return s;
  }, [allTasks, query, filter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const pageTasks = filtered.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

  const handleDelete = (id) => {
    if (!confirm("Delete the task?")) return;
    removeTask(id);
    const tasks = loadTasks();
    setAllTasks(tasks.filter((t) => t.userId === user.id));
  };

  const handleToggleStatus = (task) => {
    const tasks = loadTasks().map((t) =>
      t.id === task.id
        ? {
            ...t,
            status: t.status === "Pending" ? "Completed" : "Pending",
            updatedAt: new Date().toISOString(),
          }
        : t
    );
    saveTasks(tasks);
    setAllTasks(tasks.filter((t) => t.userId === user.id));
  };

  return (
    <Box sx={{ p: 1 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Your Tasks
        </Typography>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/tasks/new"
            sx={{ borderRadius: 2 }}
          >
            Add Task
          </Button>
        </motion.div>
      </Box>

      {/* Filters */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          backdropFilter: "blur(10px)",
        }}
      >
        <TextField
          size="small"
          placeholder="Search tasks..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 180 }}
        />

        <TextField
          size="small"
          select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>

        <TextField
          size="small"
          select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="newest">Newest</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
        </TextField>
      </Paper>

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={4}
        sx={{ borderRadius: 3, overflow: "hidden" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#fafafa" }}>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pageTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Box sx={{ textAlign: "center", py: 5 }}>
                    <Typography variant="h6" color="text.secondary">
                      No tasks found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your search or filters
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              pageTasks.map((t) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01, backgroundColor: "#f9f9f9" }}
                  transition={{ duration: 0.25 }}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{t.title}</TableCell>

                  <TableCell>{t.description}</TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 3,
                        textTransform: "none",
                        color: t.status === "Completed" ? "green" : "orange",
                        borderColor: t.status === "Completed" ? "green" : "orange",
                      }}
                      onClick={() => handleToggleStatus(t)}
                    >
                      {t.status}
                    </Button>
                  </TableCell>

                  <TableCell>{formatDate(t.createdAt)}</TableCell>

                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/tasks/${t.id}/edit`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(t.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={3}>
        <PaginationComp page={page} count={totalPages} onChange={(p) => setPage(p)} />
      </Box>
    </Box>
  );
}
