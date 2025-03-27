import { ThemeProvider, createTheme } from '@mui/material/styles';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Router from './routes';

import LoadingOverlay from '@/components/LoadingOverlay';
import PopupContainer from '@/components/PopupContainer';
import ToastContainer from '@/components/ToastContainer';

const theme = createTheme();

createRoot( document.getElementById( 'root' )! ).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <Router />
            <LoadingOverlay />
            <ToastContainer />
            <PopupContainer />
        </ThemeProvider>
    </StrictMode>
)
