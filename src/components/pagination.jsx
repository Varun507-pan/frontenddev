import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function PaginationComp({ page, count, onChange }) {
  return (
    <Stack spacing={2} alignItems="center" sx={{ my: 2 }}>
      <Pagination page={page} count={count} onChange={(e, p) => onChange(p)} />
    </Stack>
  );
}
