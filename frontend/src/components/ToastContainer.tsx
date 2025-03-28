import { Snackbar, Alert } from '@mui/material';
import React from 'react';

import { useToastStore } from '@/store/useToastStore';

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToastStore();

    return (
        <>
            {toasts.map(toast => (
                <Snackbar
                    key={toast.id}
                    open
                    onClose={() => removeToast(toast.id)}
                    autoHideDuration={3000}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert severity={toast.type} onClose={() => removeToast(toast.id)}>
                        {toast.message}
                    </Alert>
                </Snackbar>
            ))}
        </>
    );
};

export default ToastContainer;
