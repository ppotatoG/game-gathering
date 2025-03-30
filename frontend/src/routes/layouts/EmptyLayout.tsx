import { Box, Container, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';

const EmptyLayout = () => {
    const theme = useTheme();

    return (
        <Box
            minHeight="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                px: 2
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        backgroundColor: theme.palette.background.paper
                    }}
                >
                    <Outlet />
                </Paper>
            </Container>
        </Box>
    );
};

export default EmptyLayout;
