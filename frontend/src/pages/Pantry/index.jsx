import { useCallback, useEffect, useMemo, useState } from "react";

import { Alert, Box, Snackbar, Paper, Typography, Button } from "@mui/material";
import { FaPlusCircle } from "react-icons/fa";
import { EmptyState, LoadingSpinner, PageHeader, SectionCard } from "../../components/common";

import { getPantry, savePantry, deleteIngredient } from "../../api";

import IngredientDialog from "./IngredientDialog";
import PantryTable from "./PantryTable";
import PantryToolbar from "./PantryToolbar";
import DeleteDialog from "./DeleteDialog";
import IngredientForm from "./IngredientForm";

export default function Pantry() {
    const [pantry, setPantry] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const filteredPantry = useMemo(() => {
        if (!search.trim()) {
            return pantry;
        }

        return pantry.filter((ingredient) =>
            ingredient.name?.toLowerCase().includes(search.toLowerCase())
        );
    }, [pantry, search]);

    const loadPantry = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getPantry();

            setPantry(response?.ingredients || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load pantry.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPantry();
    }, [loadPantry]);

    const handleAdd = () => {
        setEditingIngredient(null);
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
        setEditingIngredient(null);
    };

    const handleSave = async (ingredient) => {
        try {
            await savePantry(ingredient);

            await loadPantry();

            handleClose();

            setSnackbarSeverity("success");
            setSnackbarMessage(`${ingredient.name} added successfully.`);
            setSnackbarOpen(true);
        } catch (error) {
            console.error(error);

            setSnackbarSeverity("error");

            setSnackbarMessage(error.response?.data?.detail ?? "Failed to save ingredient.");

            setSnackbarOpen(true);
        }
    };

    const handleDeleteClick = (ingredient) => {
        setSelectedIngredient(ingredient);
        setDeleteOpen(true);
    };

    const handleDelete = async () => {
        try {
            await deleteIngredient(selectedIngredient.name);

            await loadPantry();

            setDeleteOpen(false);
            setSelectedIngredient(null);

            setSnackbarSeverity("success");
            setSnackbarMessage(`${selectedIngredient.name} deleted successfully.`);

            setSnackbarOpen(true);
        } catch (error) {
            console.error(error);

            setSnackbarSeverity("error");
            setSnackbarMessage(error.response?.data?.detail ?? "Failed to delete ingredient.");

            setSnackbarOpen(true);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                p: 4,
            }}
        >
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                    }}
                >
                    {error}
                </Alert>
            )}

            <SectionCard
                sx={{
                    p: 0,
                    bgcolor: "transparent",
                    borderRadius: 0,
                    boxShadow: "none",
                    border: "none",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        mb: 4,
                        flexWrap: "wrap",
                    }}
                >
                    <Paper
                        elevation={1}
                        sx={{
                            flex: 1,
                            p: 2,
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="h5">📦 {pantry.length}</Typography>

                        <Typography color="text.secondary">Ingredients</Typography>
                    </Paper>

                    <Paper
                        elevation={1}
                        sx={{
                            flex: 1,
                            p: 2,
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="h5">
                            🥬 {new Set(pantry.map((i) => i.category)).size}
                        </Typography>

                        <Typography color="text.secondary">Categories</Typography>
                    </Paper>

                    <Paper
                        elevation={1}
                        sx={{
                            flex: 1,
                            p: 2,
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="h5">
                            ⏰ {pantry.filter((i) => i.expiry_date).length}
                        </Typography>

                        <Typography color="text.secondary">With Expiry</Typography>
                    </Paper>
                </Box>
                <PantryToolbar search={search} setSearch={setSearch} onAdd={handleAdd} />

                {filteredPantry.length === 0 ? (
                    <Box
                        sx={{
                            py: 4,
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="h1" sx={{ mb: 2 }}>
                            🥕
                        </Typography>

                        <Typography variant="h4" fontWeight={600}>
                            Your pantry is empty
                        </Typography>

                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            Add your first ingredient and start building your smart kitchen.
                        </Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            maxWidth: 1280,
                            mx: "auto",
                        }}
                    >
                        <PantryTable ingredients={filteredPantry} onDelete={handleDeleteClick} />
                    </Box>
                )}
            </SectionCard>

            <IngredientDialog
                open={dialogOpen}
                title={editingIngredient ? "Edit Ingredient" : "Add Ingredient"}
                onClose={handleClose}
                loading={loading}
            >
                <IngredientForm initialValues={editingIngredient} onSubmit={handleSave} />
            </IngredientDialog>
            <DeleteDialog
                open={deleteOpen}
                ingredient={selectedIngredient}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedIngredient(null);
                }}
                onConfirm={handleDelete}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    variant="filled"
                    sx={{
                        width: "100%",
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
