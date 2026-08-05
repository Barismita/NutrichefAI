import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const ConfirmDialog = ({ open, title, content, onCancel, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>{content}</DialogContent>

            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>

                <Button color="error" variant="contained" onClick={onConfirm}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
