type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
    id: string;
    open: boolean;
    type: ToastType;
    message: string;
}
