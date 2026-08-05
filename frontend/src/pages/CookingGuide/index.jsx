import { useLocation } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { saveRecipe } from "../../api/index.js";

export default function CookingGuide() {
    const { state } = useLocation();
    const allowSave = state?.allowSave;
    const recipe = state?.recipe;
    const ingredients = recipe?.required_ingredients ?? recipe?.ingredients ?? [];

    const steps = recipe?.steps ?? recipe?.instructions ?? [];

    const totalTime = recipe?.estimated_time ?? recipe?.cooking_time_minutes ?? 0;
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const handleSave = async () => {
        try {
            setSaving(true);

            await saveRecipe(recipe);

            setSaved(true);
        } finally {
            setSaving(false);
        }
    };
    if (!recipe) {
        return (
            <Box p={4}>
                <Alert severity="info">Select a recipe from Leftover Food Rescue.</Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: 900,
                mx: "auto",
                p: 4,
            }}
        >
            <Typography variant="h3" fontWeight={700} mb={2}>
                {recipe.title}
            </Typography>

            <Typography color="text.secondary" mb={3}>
                {recipe.description}
            </Typography>

            <Stack
                direction="row"
                spacing={1}
                useFlexGap
                mb={4}
                sx={{ display: "flex", flexWrap: "wrap" }}
            >
                <Chip label={recipe.difficulty} color="primary" />

                <Chip label={`${totalTime} mins`} color="success" />
                {recipe.prep_time ? (
                    <Chip label={`Prep ${recipe.prep_time} mins`} color="warning" />
                ) : null}

                {recipe.cook_time ? (
                    <Chip label={`Cook ${recipe.cook_time} mins`} color="secondary" />
                ) : null}
                <Chip label={`${recipe.servings} Servings`} color="info" />
            </Stack>

            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Ingredients
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        mb={3}
                        sx={{ display: "flex", flexWrap: "wrap" }}
                    >
                        {ingredients.map((item) => (
                            <Chip key={item} label={item} color="success" />
                        ))}
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h5" gutterBottom>
                        Cooking Instructions
                    </Typography>

                    {steps.length ? (
                        steps.map((step, index) => (
                            <Card
                                key={index}
                                variant="outlined"
                                sx={{
                                    mb: 2,
                                    borderRadius: 2,
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" color="success.main" gutterBottom>
                                        Step {index + 1}
                                    </Typography>

                                    <Typography>{step}</Typography>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Alert severity="info">
                            Detailed cooking instructions are not available for this recipe.
                        </Alert>
                    )}

                    <Alert severity="success" sx={{ mt: 4 }}>
                        <strong>Waste Reduction Tip:</strong>{" "}
                        {recipe.waste_reduction_tip ?? "No tip available."}
                    </Alert>
                    <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        disabled={!allowSave || saved || saving}
                        onClick={handleSave}
                    >
                        {saved ? "Recipe Saved" : "Save Recipe"}
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}
