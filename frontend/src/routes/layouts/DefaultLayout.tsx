import MenuIcon from '@mui/icons-material/Menu';
import { Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'

export default function DefaultLayout() {
    const [openDrawer, setOpenDrawer] = useState( false );

    const toggleDrawer = () => {
        setOpenDrawer( ( prev ) => !prev );
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>My Awesome App</Typography>
                    <IconButton color="inherit" onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
                <Box width={250} role="presentation" onClick={toggleDrawer} onKeyDown={toggleDrawer}>
                    <List>
                        <ListItem>
                            <ListItemText primary="메뉴1" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="메뉴2" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            <Box flexGrow={1} p={2}>
                <Outlet />
            </Box>
        </Box>
    );
}
