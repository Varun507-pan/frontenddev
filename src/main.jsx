import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProviderCustom } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProviderCustom>
          <App />
        </ThemeProviderCustom>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
