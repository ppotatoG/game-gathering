import { create } from 'zustand';

export const useThemeStore = create<{
    mode: 'light' | 'dark';
    toggle: () => void;
}>(set => ({
    mode: 'light',
    toggle: () => {
        set(state => {
            const next = state.mode === 'light' ? 'dark' : 'light';
            return { mode: next };
        });
    }
}));
