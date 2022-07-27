import { createTheme } from '@mui/material/styles';

const white = "#F0F0F0";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#232830',
    },
    secondary: {
      main: white,
    },
    background: {
      default: "#14171C"
    },
    text: {
      primary: white
    }
  },
  typography: {
    tab: {
      textTransform: "none",
      fontSize: "1rem",
      color: "#C0C0C0"
    },
    h1: {
      fontSize: '1.5rem',
      color: white
    },
    h2: {
      fontSize: '1.25rem',
      color: white
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1076,
      lg: 1200,
      xl: 1536,
    }
  }
});

export default theme;
