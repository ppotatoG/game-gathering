import { nanoid } from 'nanoid';
import { create } from 'zustand';

interface ToastStoreState {
    toasts: ToastItem[];
    addToast: (type: ToastType, message: string) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStoreState>(set => ({
    toasts: [],
    addToast: (type, message) =>
        set(state => ({
            toasts: [...state.toasts, { id: nanoid(), type, message }]
        })),
    removeToast: id =>
        set(state => ({
            toasts: state.toasts.filter(toast => toast.id !== id)
        }))
}));
