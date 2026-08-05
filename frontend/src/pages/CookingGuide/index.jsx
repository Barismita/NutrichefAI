import { useLocation } from "react-router-dom";
import { Alert, Box, Card, CardContent, Chip, Divider, Stack, Typography } from "@mui/material";

export default function CookingGuide() {
    const { state } = useLocation();

    const recipe = state?.recipe;

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

                <Chip label={`${recipe.estimated_time} mins`} color="success" />
                <Chip label={`Prep ${recipe.prep_time} mins`} color="warning" />

                <Chip label={`Cook ${recipe.cook_time} mins`} color="secondary" />

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
                        {recipe.required_ingredients.map((item) => (
                            <Chip key={item} label={item} color="success" />
                        ))}
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h5" gutterBottom>
                        Cooking Instructions
                    </Typography>

                    {recipe.steps?.length ? (
                        recipe.steps.map((step, index) => (
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
                        <strong>Waste Reduction Tip:</strong> {recipe.waste_reduction_tip}
                    </Alert>
                </CardContent>
            </Card>
        </Box>
    );
}
