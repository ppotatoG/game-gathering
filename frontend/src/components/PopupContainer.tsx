import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from '@mui/material';
import React from 'react';

import { usePopupStore } from '@/store/usePopupStore';

const PopupContainer: React.FC = () => {
    const { popups, closePopup } = usePopupStore();

    return (
        <>
            {popups.map(popup => (
                <Dialog open key={popup.id} onClose={() => closePopup(popup.id)}>
                    <DialogTitle
                        sx={theme => ({
                            backgroundColor: theme.palette[popup.popupType].main,
                            color: theme.palette[popup.popupType].contrastText,
                            fontWeight: 600
                        })}
                    >
                        {popup.title ?? '알림'}
                    </DialogTitle>
                    <DialogContent sx={{ mt: 3 }}>
                        <Typography variant="body1">{popup.description}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color={popup.popupType}
                            onClick={() => {
                                popup.onSubmit?.();
                                closePopup(popup.id);
                            }}
                        >
                            {popup.submitText ?? '확인'}
                        </Button>
                        <Button variant="outlined" onClick={() => closePopup(popup.id)}>
                            닫기
                        </Button>
                    </DialogActions>
                </Dialog>
            ))}
        </>
    );
};

export default PopupContainer;
