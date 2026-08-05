import { Alert, Snackbar } from "@mui/material";

export default function AppSnackbar({ open, message, severity = "success", onClose }) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
        >
            <Alert severity={severity} variant="filled" onClose={onClose}>
                {message}
            </Alert>
        </Snackbar>
    );
}
