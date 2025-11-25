import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  // Allowed Users
  const allowedUsers = [
    { role: "admin", email: "admin@gmail.com", password: "admin123" },
    { role: "employee", email: "employee@gmail.com", password: "emp123" }
  ];

  // Match user
  const matchedUser = allowedUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!matchedUser) {
    setLoading(false);
    setError("Access denied: Only Admin or Employee can sign in");
    return;
  }

  // If user is valid → login
  try {
    await signIn({ email, password, role: matchedUser.role });
    setTimeout(() => navigate("/dashboard"), 600);
  } catch (err) {
    setError(err.message || "Sign in failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>

      {/* 🌈 Floating Blur Background Animation */}
      <motion.div
        animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          background: "linear-gradient(135deg, #7B61FF, #FF61C7)",
          filter: "blur(120px)",
          borderRadius: "50%",
          top: -40,
          left: -40,
          opacity: 0.35,
        }}
      />

      <motion.div
        animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          background: "linear-gradient(135deg, #00D1FF, #00FF8F)",
          filter: "blur(120px)",
          borderRadius: "50%",
          bottom: -40,
          right: -40,
          opacity: 0.35,
        }}
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Paper
          elevation={8}
          sx={{
            maxWidth: 480,
            mx: "auto",
            mt: 12,
            p: 4,
            borderRadius: 4,
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.7)",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 65,
                height: 65,
                mx: "auto",
                boxShadow: 3,
              }}
            >
              <LockOutlinedIcon />
            </Avatar>

            <Typography variant="h5" textAlign="center" fontWeight={700}>
              Welcome Back
            </Typography>

            {/* 🔥 Shake animation on error */}
            <motion.form
              onSubmit={handleSubmit}
              animate={error ? { x: [-8, 8, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
              style={{ display: "grid", gap: "16px" }}
            >
              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <TextField
                label="Password"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && (
                <Typography color="error" textAlign="center">
                  {error}
                </Typography>
              )}

              {/* 🌀 Animated Loading Button */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ py: 1.3, fontSize: 16 }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={26} thickness={4} />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>
            </motion.form>

            <Typography textAlign="center" variant="body2">
              Don't have an account? <a href="/signup">Sign up</a>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
