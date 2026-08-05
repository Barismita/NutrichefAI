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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { getPantry, suggestLeftoverRecipes } from "../../api";
import { FaRecycle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Leftover() {
    const navigate = useNavigate();
    const [pantryIngredients, setPantryIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [selectedRecipe, setSelectedRecipe] = useState(null);
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
    const openCookingGuide = () => {
        navigate("/cooking-guide", {
            state: {
                recipe: selectedRecipe,
                allowSave: true,
                source: "leftover",
            },
        });

        setSelectedRecipe(null);
    };

    return (
        <Box
            sx={{
                maxWidth: 1000,
                mx: "auto",
                p: 4,
            }}
        >
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 600,
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <FaRecycle size={50} color="#2E7D32" />
                Leftover Food Rescue
            </Typography>

            <Typography
                variant="h6"
                sx={{
                    color: "text.secondary",
                    mb: 4,
                    fontWeight: 400,
                }}
            >
                Choose pantry ingredients or add your own to discover delicious recipes that reduce
                food waste.
            </Typography>

            <Card sx={{ mb: 3 }}>
                <CardContent
                    sx={{
                        p: 3,
                        "&:last-child": {
                            pb: 3,
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6" fontWeight={700}>
                            Select Ingredients
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 3,
                            }}
                        >
                            <Button
                                variant="text"
                                size="small"
                                disableRipple
                                onClick={() => setSelectedIngredients([])}
                                sx={{
                                    color: "text.primary",
                                    fontWeight: 600,
                                    textTransform: "none",
                                    minWidth: "auto",
                                    p: 0,
                                    "&:hover": {
                                        background: "transparent",
                                        textDecoration: "underline",
                                    },
                                }}
                            >
                                Clear
                            </Button>

                            <Button
                                variant="text"
                                size="small"
                                disableRipple
                                onClick={() => setSelectedIngredients(pantryIngredients)}
                                sx={{
                                    color: "text.primary",
                                    fontWeight: 600,
                                    textTransform: "none",
                                    minWidth: "auto",
                                    p: 0,
                                    "&:hover": {
                                        background: "transparent",
                                        textDecoration: "underline",
                                    },
                                }}
                            >
                                Select All
                            </Button>
                        </Box>
                    </Box>
                    <Autocomplete
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                minHeight: 60,
                                borderRadius: 3,
                                alignItems: "center",
                                px: 1,
                            },
                            "& .MuiAutocomplete-tag": {
                                m: 0.4,
                            },
                        }}
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
                        renderValue={(selected) =>
                            selected.map((option) => (
                                <Chip
                                    key={option}
                                    label={option}
                                    color="success"
                                    size="small"
                                    onDelete={() =>
                                        setSelectedIngredients((prev) =>
                                            prev.filter((item) => item !== option)
                                        )
                                    }
                                    sx={{
                                        fontWeight: 500,
                                        m: 0.4,
                                    }}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Search pantry or add an ingredient..."
                                size="small"
                            />
                        )}
                    />
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 1,
                            ml: 1,
                        }}
                    >
                        {selectedIngredients.length} ingredient
                        {selectedIngredients.length !== 1 ? "s" : ""} selected
                    </Typography>
                    <Box
                        mt={2}
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            disableElevation
                            variant="contained"
                            color="success"
                            size="large"
                            startIcon={<FaRecycle />}
                            onClick={handleGenerate}
                            disabled={loading}
                            sx={{
                                minWidth: 220,
                                borderRadius: 3,
                                fontWeight: 700,
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={22} color="inherit" />
                            ) : (
                                "Generate Recipes"
                            )}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Box mt={4}>
                {result && (
                    <>
                        <Typography variant="h5" fontWeight={700} mb={2}>
                            Suggested Recipes
                        </Typography>

                        <Stack spacing={3}>
                            {result.recipes.map((recipe, index) => (
                                <Card
                                    key={index}
                                    onClick={() => setSelectedRecipe(recipe)}
                                    sx={{
                                        cursor: "pointer",
                                        borderRadius: 3,
                                        transition: ".25s",
                                        "&:hover": {
                                            transform: "translateY(-3px)",
                                            boxShadow: 5,
                                        },
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            p: 3,
                                            "&:last-child": {
                                                pb: 3,
                                            },
                                        }}
                                    >
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
                                            useFlexGap
                                            mb={2}
                                            sx={{ display: "flex", flexWrap: "wrap" }}
                                        >
                                            {(
                                                recipe.required_ingredients ??
                                                recipe.ingredients ??
                                                []
                                            ).map((item) => (
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
                                                    useFlexGap
                                                    mb={2}
                                                    sx={{ display: "flex", flexWrap: "wrap" }}
                                                >
                                                    {recipe.optional_ingredients.map((item) => (
                                                        <Chip
                                                            key={item}
                                                            label={item}
                                                            color="default"
                                                        />
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
            <Dialog
                open={Boolean(selectedRecipe)}
                onClose={() => setSelectedRecipe(null)}
                maxWidth="md"
                fullWidth
            >
                {selectedRecipe && (
                    <>
                        <DialogTitle
                            sx={{
                                fontWeight: 700,
                                fontSize: 28,
                            }}
                        >
                            {selectedRecipe.title}
                        </DialogTitle>

                        <DialogContent dividers>
                            <Typography color="text.secondary" mb={3}>
                                {selectedRecipe.description}
                            </Typography>

                            <Stack direction="row" spacing={1} mb={3}>
                                <Chip label={selectedRecipe.difficulty} color="primary" />

                                <Chip
                                    label={`${selectedRecipe.estimated_time} mins`}
                                    color="success"
                                />
                            </Stack>

                            <Typography variant="h6" gutterBottom>
                                Required Ingredients
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={1}
                                useFlexGap
                                mb={3}
                                sx={{ display: "flex", flexWrap: "wrap" }}
                            >
                                {selectedRecipe.required_ingredients.map((item) => (
                                    <Chip key={item} label={item} color="success" />
                                ))}
                            </Stack>

                            {selectedRecipe.optional_ingredients?.length > 0 && (
                                <>
                                    <Typography variant="h6" gutterBottom>
                                        Optional Ingredients
                                    </Typography>

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        useFlexGap
                                        mb={3}
                                        sx={{ display: "flex", flexWrap: "wrap" }}
                                    >
                                        {selectedRecipe.optional_ingredients.map((item) => (
                                            <Chip key={item} label={item} />
                                        ))}
                                    </Stack>
                                </>
                            )}

                            {selectedRecipe.steps?.length > 0 && (
                                <>
                                    <Typography variant="h6" gutterBottom>
                                        Cooking Instructions
                                    </Typography>

                                    {selectedRecipe.steps.map((step, index) => (
                                        <Typography key={index} sx={{ mb: 1 }}>
                                            {index + 1}. {step}
                                        </Typography>
                                    ))}
                                </>
                            )}

                            <Alert severity="success" sx={{ mt: 3 }}>
                                <strong>Waste Reduction Tip:</strong>{" "}
                                {selectedRecipe.waste_reduction_tip}
                            </Alert>
                        </DialogContent>

                        <DialogActions
                            sx={{
                                justifyContent: "space-between",
                                px: 3,
                                py: 2,
                            }}
                        >
                            <Button variant="outlined" onClick={() => setSelectedRecipe(null)}>
                                Close
                            </Button>

                            <Button variant="contained" color="success" onClick={openCookingGuide}>
                                View Step-by-Step Recipe
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}
