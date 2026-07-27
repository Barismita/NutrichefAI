import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box,
} from "@mui/material";
import { FaTimes } from "react-icons/fa";

export default function IngredientDialog({
    open,
    title,
    children,
    onClose,
    onSave,
    loading = false,
    saveText = "Save Ingredient",
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: "hidden",
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pb: 2,
                }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={700}>
                        {title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Fill in the details below to manage your pantry.
                    </Typography>
                </Box>

                <IconButton onClick={onClose}>
                    <FaTimes />
                </IconButton>
            </DialogTitle>

            <DialogContent
                dividers
                sx={{
                    py: 3,
                    bgcolor: "#fafafa",
                }}
            >
                {children}
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    gap: 1,
                }}
            >
                <Button onClick={onClose} variant="outlined" size="large">
                    Cancel
                </Button>

                <Button
                    type="submit"
                    form="ingredient-form"
                    variant="contained"
                    size="large"
                    disabled={loading}
                >
                    {loading ? "Saving..." : saveText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
