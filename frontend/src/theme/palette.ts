const palette = {
    light: {
        mode: 'light',
        primary: {
            main: '#0D47A1',
            light: '#5472d3',
            dark: '#002171'
        },
        secondary: {
            main: '#FDD835',
            light: '#ffff6b',
            dark: '#c6a700'
        },
        success: {
            main: '#2e7d32',
            light: '#60ad5e',
            dark: '#005005'
        },
        error: {
            main: '#d32f2f',
            light: '#ff6659',
            dark: '#9a0007'
        },
        info: {
            main: '#0288d1',
            light: '#5eb8ff',
            dark: '#005b9f'
        },
        background: {
            default: '#f4f6f8',
            paper: '#ffffff'
        },
        text: {
            primary: '#0d0d0d',
            secondary: '#4f4f4f'
        },
        grey: {
            50: '#f9f9f9',
            100: '#f0f0f0',
            200: '#e0e0e0',
            300: '#c6c6c6',
            400: '#a8a8a8',
            500: '#8a8a8a',
            600: '#6e6e6e',
            700: '#4f4f4f',
            800: '#333333',
            900: '#212121'
        }
    },
    dark: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
            light: '#e3f2fd',
            dark: '#42a5f5'
        },
        secondary: {
            main: '#ffe082',
            light: '#ffffb3',
            dark: '#caae53'
        },
        success: {
            main: '#81c784',
            light: '#b2fab4',
            dark: '#519657'
        },
        error: {
            main: '#ef5350',
            light: '#ff867c',
            dark: '#b61827'
        },
        info: {
            main: '#4fc3f7',
            light: '#8bf6ff',
            dark: '#0093c4'
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e'
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0bec5'
        },
        grey: {
            50: '#f5f5f5',
            100: '#e0e0e0',
            200: '#bdbdbd',
            300: '#9e9e9e',
            400: '#757575',
            500: '#616161',
            600: '#4b4b4b',
            700: '#383838',
            800: '#1f1f1f',
            900: '#111111'
        }
    }
} as const;

export default palette;
