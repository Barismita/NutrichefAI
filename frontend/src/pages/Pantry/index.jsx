import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

import { LoadingSpinner, EmptyState, PageHeader, SectionCard } from "../../components/common";

import { getPantry, savePantry } from "../../api";

import PantryToolbar from "./PantryToolbar";
import PantryTable from "./PantryTable";
import IngredientDialog from "./IngredientDialog";

export default function Pantry() {
    const [pantry, setPantry] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

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

            const ingredients = response?.ingredients || [];

            setPantry(ingredients);
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

            setSnackbarMessage(`${ingredient.name} added successfully.`);
            setSnackbarOpen(true);
        } catch (err) {
            console.error(err);
            setError("Failed to save ingredient.");
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <PageHeader title="Pantry" subtitle="Manage your kitchen ingredients." />

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <SectionCard>
                <PantryToolbar search={search} setSearch={setSearch} onAdd={handleAdd} />

                {filteredPantry.length === 0 ? (
                    <EmptyState
                        title="No Ingredients"
                        description="Add your first ingredient to get started."
                    />
                ) : (
                    <PantryTable ingredients={filteredPantry} />
                )}
            </SectionCard>

            <IngredientDialog
                open={dialogOpen}
                onClose={handleClose}
                onSubmit={handleSave}
                initialValues={editingIngredient}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setSnackbarOpen(false)}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
