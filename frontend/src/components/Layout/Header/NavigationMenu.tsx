import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { NAVIGATION_MENU } from '@/constants/menuData';

const NavigationMenu = () => {
    const navigate = useNavigate();

    return (
        <>
            {NAVIGATION_MENU.map(menu => (
                <Button
                    key={menu.label}
                    onClick={() => navigate(menu.path)}
                    variant="text"
                    sx={theme => ({
                        fontWeight: 600,
                        color: theme.palette.text.secondary,
                        '&:hover': {
                            backgroundColor:
                                theme.palette.mode === 'dark'
                                    ? theme.palette.grey[800]
                                    : theme.palette.grey[100],
                            color: theme.palette.primary.main,
                            borderRadius: 1
                        },
                        px: 2,
                        py: 1
                    })}
                >
                    {menu.label}
                </Button>
            ))}
        </>
    );
};

export default NavigationMenu;
