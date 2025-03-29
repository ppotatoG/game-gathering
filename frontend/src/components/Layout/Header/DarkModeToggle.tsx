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
                sx={theme => ({
                    color:
                        theme.palette.mode === 'dark'
                            ? theme.palette.warning.light
                            : theme.palette.primary.main,
                    backgroundColor:
                        theme.palette.mode === 'dark'
                            ? theme.palette.grey[800]
                            : theme.palette.grey[100],
                    '&:hover': {
                        backgroundColor:
                            theme.palette.mode === 'dark'
                                ? theme.palette.grey[700]
                                : theme.palette.grey[200]
                    },
                    transition: 'all 0.2s ease-in-out',
                    borderRadius: 2,
                    p: 1
                })}
            >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default DarkModeToggle;
