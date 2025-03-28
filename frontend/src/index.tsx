import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Router from './routes';

import LoadingOverlay from '@/components/LoadingOverlay';
import PopupContainer from '@/components/PopupContainer';
import ToastContainer from '@/components/ToastContainer';
import { useThemeStore } from '@/store/useThemeStore';
import { lightTheme, darkTheme } from '@/theme';

import '@/styles/init.css';

function App() {
    const mode = useThemeStore(state => state.mode); // ✅ 상태 변할 때마다 재렌더
    const theme = mode === 'dark' ? darkTheme : lightTheme;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router />
            <LoadingOverlay />
            <ToastContainer />
            <PopupContainer />
        </ThemeProvider>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
