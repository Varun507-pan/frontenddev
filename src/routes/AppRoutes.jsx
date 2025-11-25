import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "../pages/SignIn";

import Dashboard from "../pages/Dashboard";
import TaskForm from "../pages/TaskForm";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/signin" element={<SignIn />} />
      

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tasks/new" element={<ProtectedRoute><TaskForm /></ProtectedRoute>} />
        <Route path="/tasks/:id/edit" element={<ProtectedRoute><TaskForm /></ProtectedRoute>} />

        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </>
  );
}
