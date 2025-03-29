import { AppBar, Toolbar, Box } from '@mui/material';

import AccountMenu from './AccountMenu';
import DarkModeToggle from './DarkModeToggle';
import NavigationMenu from './NavigationMenu';

const Header = () => {
    return (
        <AppBar
            position="static"
            elevation={0}
            sx={theme => ({
                backgroundColor:
                    theme.palette.mode === 'dark'
                        ? theme.palette.grey[900]
                        : theme.palette.grey[50],
                color: theme.palette.text.primary,
                borderBottom: `1px solid ${
                    theme.palette.mode === 'dark'
                        ? theme.palette.grey[800]
                        : theme.palette.grey[200]
                }`,
                px: 3,
                py: 1.5
            })}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }} disableGutters>
                <Box display="flex" gap={2}>
                    <NavigationMenu />
                </Box>
                <Box display="flex" gap={2} alignItems="center">
                    <DarkModeToggle />
                    <AccountMenu />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
