import { useEffect, useState } from "react";
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { FaRecycle } from "react-icons/fa";
import { getPantry, suggestLeftoverRecipes } from "../../api";

export default function Leftover() {
    const [pantryIngredients, setPantryIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const loadPantry = async () => {
        try {
            const response = await getPantry();

            const pantry = response?.ingredients || [];

            const names = pantry.map((item) => item.name);

            setPantryIngredients(names);
            setSelectedIngredients(names);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadPantry();
    }, []);

    const handleGenerate = async () => {
        try {
            setLoading(true);
            setError("");

            if (!selectedIngredients.length) {
                setError("Select at least one ingredient.");
                return;
            }

            const response = await suggestLeftoverRecipes(selectedIngredients);

            setResult(response);
        } catch (err) {
            console.error(err);

            setError(err.response?.data?.detail ?? "Failed to generate leftover recipes.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 1000,
                mx: "auto",
                p: 4,
            }}
        >
            <Typography variant="h4" fontWeight={700} mb={2}>
                Leftover Food Rescue
            </Typography>

            <Typography color="text.secondary" mb={3}>
                Select the ingredients you want to use.
            </Typography>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" mb={2}>
                        Select Ingredients
                    </Typography>

                    <Autocomplete
                        multiple
                        freeSolo
                        options={pantryIngredients}
                        value={selectedIngredients}
                        onChange={(event, value) => {
                            const unique = [
                                ...new Set(
                                    value
                                        .map((v) => (typeof v === "string" ? v.trim() : ""))
                                        .filter(Boolean)
                                ),
                            ];

                            setSelectedIngredients(unique);
                        }}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    label={option}
                                    color="success"
                                    {...getTagProps({ index })}
                                    key={option}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Ingredients"
                                placeholder="Search or type to add..."
                            />
                        )}
                    />
                </CardContent>
            </Card>

            <Button
                variant="contained"
                color="success"
                startIcon={<FaRecycle />}
                onClick={handleGenerate}
                disabled={loading}
                sx={{
                    mb: 4,
                }}
            >
                {loading ? <CircularProgress size={22} color="inherit" /> : "Generate Recipes"}
            </Button>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {result && (
                <>
                    <Typography variant="h5" fontWeight={700} mb={2}>
                        Suggested Recipes
                    </Typography>

                    <Stack spacing={3}>
                        {result.recipes.map((recipe, index) => (
                            <Card key={index}>
                                <CardContent>
                                    <Typography variant="h5" fontWeight={700}>
                                        {recipe.title}
                                    </Typography>

                                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                                        {recipe.description}
                                    </Typography>

                                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                        <Chip label={recipe.difficulty} color="primary" />

                                        <Chip
                                            label={`${recipe.estimated_time} mins`}
                                            color="success"
                                        />
                                    </Stack>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography fontWeight={600} gutterBottom>
                                        Required Ingredients
                                    </Typography>

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        flexWrap="wrap"
                                        useFlexGap
                                        mb={2}
                                    >
                                        {recipe.required_ingredients.map((item) => (
                                            <Chip key={item} label={item} color="success" />
                                        ))}
                                    </Stack>

                                    {recipe.optional_ingredients.length > 0 && (
                                        <>
                                            <Typography fontWeight={600} gutterBottom>
                                                Optional Ingredients
                                            </Typography>

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                flexWrap="wrap"
                                                useFlexGap
                                                mb={2}
                                            >
                                                {recipe.optional_ingredients.map((item) => (
                                                    <Chip key={item} label={item} color="default" />
                                                ))}
                                            </Stack>
                                        </>
                                    )}

                                    <Alert severity="success">
                                        <strong>Waste Reduction Tip:</strong>{" "}
                                        {recipe.waste_reduction_tip}
                                    </Alert>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>

                    {result.general_tips.length > 0 && (
                        <>
                            <Typography variant="h5" fontWeight={700} mt={5} mb={2}>
                                General Tips
                            </Typography>

                            <Stack spacing={1}>
                                {result.general_tips.map((tip, index) => (
                                    <Alert severity="info" key={index}>
                                        {tip}
                                    </Alert>
                                ))}
                            </Stack>
                        </>
                    )}
                </>
            )}
        </Box>
    );
}
