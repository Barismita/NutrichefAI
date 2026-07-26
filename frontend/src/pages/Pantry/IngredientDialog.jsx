import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

import IngredientForm from "./IngredientForm";

export default function IngredientDialog({ open, onClose, onSubmit, initialValues }) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{initialValues ? "Edit Ingredient" : "Add Ingredient"}</DialogTitle>

            <DialogContent>
                <IngredientForm initialValues={initialValues} onSubmit={onSubmit} />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
