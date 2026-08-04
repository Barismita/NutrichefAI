import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { FaClock, FaFire, FaUtensils } from "react-icons/fa";

export default function RecipeCard({ recipe, onView, onDelete }) {
    return (
        <Card
            sx={{
                borderRadius: 3,
                height: "100%",
                boxShadow: "0 8px 20px rgba(0,0,0,.08)",
            }}
        >
            <CardContent>
                <Typography variant="h6" fontWeight={700}>
                    {recipe.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" mt={1} mb={2} noWrap>
                    {recipe.description}
                </Typography>

                <Stack direction="row" spacing={1} mb={2}>
                    <Chip icon={<FaClock />} label={`${recipe.cooking_time_minutes || "-"} min`} />

                    <Chip icon={<FaFire />} label={`${recipe.nutrition?.calories ?? "-"} kcal`} />
                </Stack>

                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <FaUtensils />

                    <Typography variant="body2">{recipe.difficulty}</Typography>
                </Box>

                <Box display="flex" gap={2} mt={2}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        onClick={() => onView(recipe)}
                    >
                        View Recipe
                    </Button>

                    {onDelete && (
                        <Button
                            color="error"
                            variant="outlined"
                            onClick={() => onDelete(recipe.id ?? recipe._id)}
                            sx={{ mt: 1 }}
                        >
                            Delete
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}
