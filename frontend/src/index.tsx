import { ThemeProvider } from '@mui/material/styles';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Router from './routes';

import LoadingOverlay from '@/components/LoadingOverlay';
import PopupContainer from '@/components/PopupContainer';
import ToastContainer from '@/components/ToastContainer';
import { useThemeStore } from '@/store/useThemeStore';
import { lightTheme, darkTheme } from '@/theme';

import '@/styles/init.css';

const mode = useThemeStore.getState().mode;

createRoot( document.getElementById( 'root' )! ).render(
    <StrictMode>
        <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
            <Router />
            <LoadingOverlay />
            <ToastContainer />
            <PopupContainer />
        </ThemeProvider>
    </StrictMode>
)
