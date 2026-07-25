import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#4CAF50",
        },
        secondary: {
            main: "#2E7D32",
        },
        background: {
            default: "#F5F7FA",
            paper: "#FFFFFF",
        },
    },

    typography: {
        fontFamily: "Inter, Arial, sans-serif",

        h4: {
            fontWeight: 700,
        },

        h5: {
            fontWeight: 600,
        },

        h6: {
            fontWeight: 600,
        },
    },

    shape: {
        borderRadius: 12,
    },
});

export default theme;