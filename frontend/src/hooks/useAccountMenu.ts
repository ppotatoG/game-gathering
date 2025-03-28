import { useState, MouseEvent } from 'react';

export const useAccountMenu = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const nickname = 'LuxLover';
    const club = 'Mid Support Club';

    return {
        anchorEl,
        open,
        handleClick,
        handleClose,
        nickname,
        club,
    };
};
