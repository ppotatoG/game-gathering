import { create } from 'zustand';

export const useThemeStore = create<{
    mode: 'light' | 'dark';
    toggle: () => void;
        }>( ( set ) => ( {
            mode: 'light',
            toggle: () =>
                set( ( state ) => ( {
                    mode: state.mode === 'light' ? 'dark' : 'light',
                } ) ),
        } ) );
