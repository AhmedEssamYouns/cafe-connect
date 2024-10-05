import { createTheme } from "@mui/material";

// Define light theme
const lightTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1070,
      lg: 1280,
      xl: 1920,
      custom: 1070, // Custom breakpoint for 1070px
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
      stack: "#e0e0e0", // Optional: specific background for stacks
    },
    text: {
      primary: "#000000",
    },
  },
  components: {
    MuiCard: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(2),
          borderWidth: "1.5px",
          backgroundColor: theme.palette.background.paper,
        }),
      },
    },
    MuiContainer: {
      // Removed maxWidth property to allow full width
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#000", // Optional: default color for light theme
        },
      },
    },
  },
});

// Define dark theme
const darkTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1070,
      lg: 1280,
      xl: 1920,
      custom: 1070, // Custom breakpoint for 1070px
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
      stack: "#303030", // Darker stack color
    },
    text: {
      primary: "#ffffff",
    },
  },
  components: {
    MuiCard: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(2),
          borderWidth: "1.5px",
          backgroundColor: theme.palette.background.paper,
        }),
      },
    },
    MuiContainer: {
      // Removed maxWidth property to allow full width
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#fff", // Optional: default color for dark theme
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
