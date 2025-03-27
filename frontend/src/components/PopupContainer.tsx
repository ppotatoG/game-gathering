import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import React from 'react';

import { usePopupStore } from '@/store/usePopupStore';

const PopupContainer: React.FC = () => {
    const { popups, closePopup } = usePopupStore();

    return (
        <>
            {popups.map( ( popup ) => (
                <Dialog
                    open={popup.open}
                    key={popup.id}
                    onClose={() => {
                        popup.onClose?.();
                        closePopup( popup.id );
                    }}
                >
                    <DialogTitle>{popup.title ?? '알림'}</DialogTitle>
                    <DialogContent>{popup.description}</DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                popup.onSubmit?.();
                                closePopup( popup.id );
                            }}
                        >
                          Submit
                        </Button>
                        <Button
                            onClick={() => {
                                popup.onClose?.();
                                closePopup( popup.id );
                            }}
                        >
                          Close
                        </Button>
                    </DialogActions>
                </Dialog>
            ) )}
        </>
    );
};

export default PopupContainer;
