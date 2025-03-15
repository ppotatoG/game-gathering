"use client"
import { ThemeProvider, createTheme, PaletteMode, CssBaseline } from "@mui/material"
import { ReactNode, useMemo, useState } from "react"

import { colorPalette } from "./palette"

export default function CustomThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>("light")
  const theme = useMemo(() => {
    const palette = colorPalette[mode]
    return createTheme({ palette: { mode, ...palette } })
  }, [mode])
  const toggleColorMode = () => setMode(prev => (prev === "light" ? "dark" : "light"))
  return (
    <ThemeProvider theme={theme}>
      {children}
      <button
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          padding: "8px 12px",
          cursor: "pointer"
        }}
        onClick={toggleColorMode}
      >
        Toggle Theme
      </button>
      <CssBaseline />
    </ThemeProvider>
  )
}
