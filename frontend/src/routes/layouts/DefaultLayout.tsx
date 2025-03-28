import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Header from '@/components/Layout/Header';
export default function DefaultLayout() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            sx={theme => ({
                background: theme.palette.background.default,
                color: theme.palette.text.primary
            })}
        >
            <Header />

            <Box
                flexGrow={1}
                p={2}
                sx={theme => ({
                    background: theme.palette.background.paper,
                    color: theme.palette.text.primary
                })}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
