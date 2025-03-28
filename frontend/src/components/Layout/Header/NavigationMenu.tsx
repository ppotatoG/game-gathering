import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { NAVIGATION_MENU } from '@/constants/menuData';

const NavigationMenu = () => {
    const navigate = useNavigate();

    return (
        <>
            {NAVIGATION_MENU.map(menu => (
                <Button
                    key={menu.path}
                    onClick={() => navigate(menu.path)}
                    variant="text"
                    color="primary"
                    sx={{
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: 'primary.light',
                            color: 'text.primary',
                        },
                    }}
                >
                    {menu.label}
                </Button>
            ))}
        </>
    );
};

export default NavigationMenu;
