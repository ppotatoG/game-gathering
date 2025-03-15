"use client"
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText
} from "@mui/material"
import Link from "next/link"
import { ReactNode, useState } from "react"

import { APP_NAME } from "@/config"
import { MENU_ITEMS } from "@/constants/menu"
import CustomThemeProvider from "@/theme/ThemeProvider"

import GlobalLoadingBar from "@/components/GlobalLoadingBar"
import Toast from "@/components/Toast";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = () => setMenuOpen(!menuOpen)

  return (
    <html lang="ko">
    <body>
    <CustomThemeProvider>
      <Box>
        <AppBar position="sticky">
          <Toolbar>
            <Box sx={{ flexGrow: 1, cursor: "pointer" }} onClick={toggleMenu}>
              <Typography variant="h6">{APP_NAME}</Typography>
            </Box>
            <Box>AccountName / SummonerName</Box>
          </Toolbar>
        </AppBar>
        <Drawer anchor="left" open={menuOpen} onClose={toggleMenu}>
          <List sx={{ width: 240 }}>
            {MENU_ITEMS.map(item => (
              <ListItem key={item.path} onClick={toggleMenu}>
                <Link
                  href={item.path}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItemText primary={item.label} />
                </Link>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box sx={{ p: 2 }}>{children}</Box>
    </Box>
      <GlobalLoadingBar />
      <Toast />
    </CustomThemeProvider>
    </body>
    </html>
  )
}
