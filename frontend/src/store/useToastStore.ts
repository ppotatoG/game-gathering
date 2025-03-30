import { nanoid } from 'nanoid';
import { create } from 'zustand';

interface ToastStoreState {
    toasts: ToastItem[];
    addToast: (type: ToastType, message: string) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStoreState>(set => ({
    toasts: [],
    addToast: (type, message) => {
        const id = nanoid();
        const newToast: ToastItem = {
            id,
            type,
            message,
            open: true
        };

        set(state => ({
            toasts: [...state.toasts, newToast]
        }));

        setTimeout(() => {
            set(state => ({
                toasts: state.toasts.map(toast =>
                    toast.id === id ? { ...toast, open: false } : toast
                )
            }));
        }, 1000);

        setTimeout(() => {
            set(state => ({
                toasts: state.toasts.filter(toast => toast.id !== id)
            }));
        }, 1500);
    },
    removeToast: id =>
        set(state => ({
            toasts: state.toasts.filter(toast => toast.id !== id)
        }))
}));
