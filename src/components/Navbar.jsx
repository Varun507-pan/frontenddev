import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    signOut();
    nav("/signin");
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 3 }}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography component={Link} to="/" variant="h6" sx={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}>
          Task Manager
        </Typography>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <ThemeSwitcher />
          {!user ? (
            <>
              <Button component={Link} to="/signin" variant="outlined">Sign In</Button>
              <Button component={Link} to="/signup" variant="contained">Sign Up</Button>
            </>
          ) : (
            <>
              <Typography variant="body2" sx={{ mr: 1 }}>Hello, {user.name}</Typography>
              <Button onClick={handleLogout} variant="outlined">Logout</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
