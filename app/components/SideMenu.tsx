"use client"
import { Drawer, List, ListItem, ListItemText } from "@mui/material"
import Link from "next/link"

import { MENU_ITEMS } from "@/constants/menu"

type SideMenuProps = {
  open: boolean
  onClose: () => void
}

export default function SideMenu({ open, onClose }: SideMenuProps) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List sx={{ width: 240 }}>
        {MENU_ITEMS.map(item => (
          <ListItem key={item.label} onClick={onClose}>
            <Link href={item.path} style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemText primary={item.label} />
            </Link>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}
