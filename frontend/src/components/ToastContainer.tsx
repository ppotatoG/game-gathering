import { Snackbar, Alert, Slide, SlideProps } from '@mui/material';
import React from 'react';

import { useToastStore } from '@/store/useToastStore';

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToastStore();

    return (
        <>
            {toasts.map(toast => (
                <Snackbar
                    key={`toast-${toast.id}`}
                    open={toast.open}
                    onClose={() => removeToast(toast.id)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    autoHideDuration={null}
                    slots={{
                        transition: Slide
                    }}
                    slotProps={{
                        transition: {
                            direction: 'right',
                            timeout: {
                                enter: 300,
                                exit: 300
                            }
                        } as SlideProps
                    }}
                >
                    <Alert
                        severity={toast.type}
                        onClose={() => removeToast(toast.id)}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {toast.message}
                    </Alert>
                </Snackbar>
            ))}
        </>
    );
};

export default ToastContainer;
