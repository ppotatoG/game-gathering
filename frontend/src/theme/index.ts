import { createTheme } from '@mui/material/styles';

import palette from './palette';

export const lightTheme = createTheme({
    palette: {
        ...palette.light
    }
});

export const darkTheme = createTheme({
    palette: {
        ...palette.dark
    }
});
