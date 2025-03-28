import { AppBar, Toolbar, Box } from '@mui/material';

import AccountMenu from './AccountMenu';
import DarkModeToggle from './DarkModeToggle';
import NavigationMenu from './NavigationMenu';

const Header = () => {
    return (
        <AppBar
            position="static"
            elevation={1}
            sx={{
                background: 'background.paper',
                color: 'text.primary',
                borderBottom: theme => `1px solid ${theme.palette.divider}`,
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
