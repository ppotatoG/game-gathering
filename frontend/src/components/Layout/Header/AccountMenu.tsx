import AccountCircle from '@mui/icons-material/AccountCircle';
import { IconButton, Menu, MenuItem, Typography, Divider, Tooltip } from '@mui/material';

import { useAccountMenu } from '@/hooks/useAccountMenu';

const AccountMenu = () => {
    const { anchorEl, open, handleClick, handleClose, nickname, club } = useAccountMenu();

    return (
        <>
            <Tooltip title="Account settings">
                <IconButton
                    onClick={handleClick}
                    sx={{
                        color: 'secondary.main',
                        transition: 'color 0.2s ease',
                    }}
                >
                    <AccountCircle />
                </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem disabled>
                    <Typography variant="subtitle2">Nickname: {nickname}</Typography>
                </MenuItem>
                <MenuItem disabled>
                    <Typography variant="subtitle2">Club: {club}</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default AccountMenu;
