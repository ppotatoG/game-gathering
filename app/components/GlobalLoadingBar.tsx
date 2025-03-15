"use client"
import {Backdrop, CircularProgress} from "@mui/material"

import { useLoadingStore } from "@/store/loading"

export default function GlobalLoadingBar() {
  const loadingCount = useLoadingStore((state) => state.loadingCount);

  return (
    <Backdrop
      open={loadingCount > 0}
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 9999 }}
    >
      <CircularProgress />
    </Backdrop>
  )
}
