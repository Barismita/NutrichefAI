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
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { FaHeartbeat } from "react-icons/fa";

import { analyzeNutrition, getHealthyAlternatives, getPantry } from "../../api";

export default function Nutrition() {
    const [pantryIngredients, setPantryIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    const [recipeName, setRecipeName] = useState("");

    const [loading, setLoading] = useState(false);

    const [nutrition, setNutrition] = useState(null);
    const [alternatives, setAlternatives] = useState(null);

    const [error, setError] = useState("");

    async function loadPantry() {
        try {
            const response = await getPantry();

            const pantry = response?.ingredients || [];

            const names = pantry.map((item) => item.name);

            setPantryIngredients(names);
            setSelectedIngredients(names);
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        loadPantry();
    }, []);

    const handleAnalyze = async () => {
        try {
            setLoading(true);
            setError("");

            if (!recipeName.trim()) {
                setError("Recipe name is required.");
                return;
            }

            if (!selectedIngredients.length) {
                setError("Select at least one ingredient.");
                return;
            }

            const [nutritionResponse, alternativesResponse] = await Promise.all([
                analyzeNutrition(recipeName, selectedIngredients),
                getHealthyAlternatives(selectedIngredients),
            ]);

            setNutrition(nutritionResponse);
            setAlternatives(alternativesResponse);
        } catch (err) {
            console.error(err);

            setError(err.response?.data?.detail ?? "Failed to analyze nutrition.");
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
            <Typography variant="h4" fontWeight={700} mb={3}>
                Nutrition Insights
            </Typography>

            <Stack spacing={3}>
                <TextField
                    label="Recipe Name"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    fullWidth
                />

                <Autocomplete
                    multiple
                    freeSolo
                    options={pantryIngredients}
                    value={selectedIngredients}
                    onChange={(event, value) => {
                        setSelectedIngredients([
                            ...new Set(
                                value
                                    .map((v) => (typeof v === "string" ? v.trim() : ""))
                                    .filter(Boolean)
                            ),
                        ]);
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
                            placeholder="Search or add ingredients..."
                        />
                    )}
                />

                <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<FaHeartbeat />}
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={22} color="inherit" /> : "Analyze Nutrition"}
                </Button>

                {error && <Alert severity="error">{error}</Alert>}

                <Box mt={4}>
                    {nutrition && (
                        <>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" fontWeight={700} mb={3}>
                                        Nutrition Facts
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: {
                                                xs: "repeat(2, 1fr)",
                                                md: "repeat(4, 1fr)",
                                            },
                                            gap: 2,
                                            mb: 4,
                                        }}
                                    >
                                        {[
                                            {
                                                label: "Calories",
                                                value: nutrition.nutrition.calories,
                                                unit: "kcal",
                                                color: "#1976d2",
                                            },
                                            {
                                                label: "Protein",
                                                value: nutrition.nutrition.protein,
                                                unit: "g",
                                                color: "#2e7d32",
                                            },
                                            {
                                                label: "Carbs",
                                                value: nutrition.nutrition.carbohydrates,
                                                unit: "g",
                                                color: "#ed6c02",
                                            },
                                            {
                                                label: "Fat",
                                                value: nutrition.nutrition.fat,
                                                unit: "g",
                                                color: "#9c27b0",
                                            },
                                        ].map((item) => (
                                            <Card
                                                key={item.label}
                                                elevation={2}
                                                sx={{
                                                    borderRadius: 3,
                                                    textAlign: "center",
                                                    py: 2,
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography
                                                        variant="subtitle1"
                                                        color="text.secondary"
                                                        fontWeight={600}
                                                    >
                                                        {item.label}
                                                    </Typography>

                                                    <Typography
                                                        variant="h3"
                                                        fontWeight={700}
                                                        sx={{
                                                            color: item.color,
                                                            my: 1,
                                                        }}
                                                    >
                                                        {item.value}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {item.unit}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: {
                                                xs: "repeat(3, 1fr)",
                                                md: "repeat(3, 1fr)",
                                            },
                                            gap: 2,
                                            mb: 4,
                                        }}
                                    >
                                        <Chip
                                            color="info"
                                            label={`Fibre: ${nutrition.nutrition.fibre} g`}
                                            sx={{ justifyContent: "center", py: 2 }}
                                        />

                                        <Chip
                                            color="error"
                                            label={`Sugar: ${nutrition.nutrition.sugar} g`}
                                            sx={{ justifyContent: "center", py: 2 }}
                                        />

                                        <Chip
                                            color="default"
                                            label={`Sodium: ${nutrition.nutrition.sodium} mg`}
                                            sx={{ justifyContent: "center", py: 2 }}
                                        />
                                    </Box>

                                    <Typography variant="h6" gutterBottom>
                                        Health Score
                                    </Typography>

                                    <Chip
                                        label={`${nutrition.health_score}/10`}
                                        color={
                                            nutrition.health_score >= 8
                                                ? "success"
                                                : nutrition.health_score >= 5
                                                  ? "warning"
                                                  : "error"
                                        }
                                        sx={{
                                            fontSize: 18,
                                            p: 2,
                                            mb: 3,
                                        }}
                                    />

                                    <Typography variant="h6" gutterBottom>
                                        Dietary Tags
                                    </Typography>

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        useFlexGap
                                        mb={3}
                                        sx={{ display: "flex", flexWrap: "wrap" }}
                                    >
                                        {nutrition.dietary_tags.map((tag) => (
                                            <Chip key={tag} label={tag} color="success" />
                                        ))}
                                    </Stack>

                                    <Alert severity="info">{nutrition.summary}</Alert>
                                </CardContent>
                            </Card>

                            {alternatives && (
                                <Card sx={{ mt: 4 }}>
                                    <CardContent>
                                        <Typography variant="h5" fontWeight={700} mb={3}>
                                            Healthy Alternatives
                                        </Typography>

                                        <Stack spacing={2}>
                                            {alternatives.alternatives.map((item, index) => (
                                                <Card key={index} variant="outlined">
                                                    <CardContent>
                                                        <Typography fontWeight={700}>
                                                            {item.ingredient}
                                                        </Typography>

                                                        <Typography color="success.main" mt={1}>
                                                            → {item.alternative}
                                                        </Typography>

                                                        <Typography color="text.secondary" mt={1}>
                                                            {item.reason}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Stack>

                                        {alternatives.tips.length > 0 && (
                                            <>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight={700}
                                                    mt={4}
                                                    mb={2}
                                                >
                                                    Health Tips
                                                </Typography>

                                                <Stack spacing={1}>
                                                    {alternatives.tips.map((tip, index) => (
                                                        <Alert key={index} severity="success">
                                                            {tip}
                                                        </Alert>
                                                    ))}
                                                </Stack>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </Box>
            </Stack>
        </Box>
    );
}
