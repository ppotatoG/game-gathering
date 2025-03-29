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
                    sx={theme => ({
                        color: theme.palette.secondary.main,
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
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out'
                    })}
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
