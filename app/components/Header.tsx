"use client"
import { AppBar, Toolbar, Typography, Box } from "@mui/material"

import { APP_NAME } from "@/config"

type HeaderProps = {
  accountName?: string
  summonerName?: string
  onMenuToggle?: () => void
}

export default function Header({ accountName, summonerName, onMenuToggle }: HeaderProps) {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} onClick={onMenuToggle}>
          <Typography variant="h6">{APP_NAME}</Typography>
        </Box>
        <Box>{accountName} / {summonerName}</Box>
      </Toolbar>
    </AppBar>
  )
}
