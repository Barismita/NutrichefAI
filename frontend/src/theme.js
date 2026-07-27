import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#BBF1D2",
            contrastText: "#2F6B45",
        },

        secondary: {
            main: "#EEF8CD",
            contrastText: "#65762E",
        },

        error: {
            main: "#FF9D9D",
        },

        warning: {
            main: "#FFC5AA",
        },

        background: {
            default: "#FCFFFB",
            paper: "#FFFFFF",
        },

        text: {
            primary: "#2B2B2B",
            secondary: "#6B7280",
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
        borderRadius: 18,
    },
});

export default theme;
