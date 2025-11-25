import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <AppRoutes />
        </Container>
      </Box>
    </>
  );
}
