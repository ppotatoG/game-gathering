import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton, Tooltip } from '@mui/material';

import { useThemeStore } from '@/store/useThemeStore';

const DarkModeToggle = () => {
    const { mode, toggle } = useThemeStore();

    return (
        <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton
                onClick={toggle}
                sx={{
                    color: mode === 'dark' ? 'warning.light' : 'primary.dark',
                    transition: 'color 0.3s ease',
                }}
            >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default DarkModeToggle;
