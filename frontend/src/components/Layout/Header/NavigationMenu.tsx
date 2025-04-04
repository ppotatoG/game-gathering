import { Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import { NAVIGATION_MENU } from '@/constants/menuData';
import { useAdminStore } from '@/store/useAdmin';

const NavigationMenu = () => {
    const navigate = useNavigate();
    const { code: paramCode } = useParams<{ code: string }>();
    const { auctionCode } = useAdminStore();

    const resolvedCode = paramCode || auctionCode;

    return (
        <>
            {NAVIGATION_MENU.map(menu => {
                const resolvedPath = menu.path.replace(':code', resolvedCode || '');

                return (
                    <Button
                        key={menu.label}
                        onClick={() => navigate(resolvedPath)}
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
                        disabled={!resolvedCode}
                    >
                        {menu.label}
                    </Button>
                );
            })}
        </>
    );
};

export default NavigationMenu;
