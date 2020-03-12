import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#c2185b',
    },
    secondary: {
      main: '#4a148c',
    },
    error: {
      main: '#c62828',
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontSize: 16,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: 26,
    },
    h2: {
      fontSize: 24,
    },
    h3: {
      fontSize: 18,
    },
    body2: {
      fontSize: 14,
    }
  }
});

export default theme;
