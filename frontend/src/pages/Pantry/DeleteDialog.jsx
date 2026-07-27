import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

export default function DeleteDialog({ open, ingredient, onClose, onConfirm }) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Delete Ingredient</DialogTitle>

            <DialogContent>
                <Typography>
                    Are you sure you want to delete <strong>{ingredient?.name}</strong>?
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>

                <Button variant="contained" color="error" onClick={onConfirm}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
