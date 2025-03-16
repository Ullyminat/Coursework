import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E3B55',
    },
    secondary: {
      main: '#FF6B6B',
    },
    background: {
        default: '#00000',
      },
  },
  typography: {
    h4: {
      fontWeight: 700,
      letterSpacing: 1.2,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '12px 24px',
          textTransform: 'none',
          fontSize: '16px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

export default theme;