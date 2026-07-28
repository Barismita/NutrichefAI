import {
    Paper,
    Typography,
    Box,
    Chip,
    Grid,
    Divider,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import {
    FaUtensils,
    FaClock,
    FaUsers,
    FaCheckCircle,
    FaMagic,
    FaHeart,
    FaRedo,
} from "react-icons/fa";
import NutritionCard from "../../components/recipes/NutritionCard";
import RecipeIngredient from "../../components/recipes/RecipeIngredient";
import StepCard from "../../components/recipes/StepCard";

export default function RecipeDetails({ recipe, onGenerateAgain }) {
    if (!recipe) return null;

    return (
        <Paper
            elevation={0}
            sx={{
                mt: 4,
                p: 4,
                borderRadius: 4,
                border: "1px solid #DDE3EA",
            }}
        >
            {/* Header */}

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        {recipe.name || recipe.title}
                    </Typography>

                    <Typography color="text.secondary" mt={1}>
                        AI Generated Recipe
                    </Typography>
                </Box>

                <Chip icon={<FaMagic />} label="AI Recipe" color="success" />
            </Box>

            {/* Stats */}

            <Grid container spacing={2} mb={4}>
                <Grid item xs={6} md={3}>
                    <NutritionCard
                        icon={<FaClock />}
                        title="Cooking Time"
                        value={`${recipe.cooking_time || "-"} mins`}
                    />
                </Grid>

                <Grid item xs={6} md={3}>
                    <NutritionCard
                        icon={<FaUsers />}
                        title="Servings"
                        value={recipe.servings || "-"}
                    />
                </Grid>

                <Grid item xs={6} md={3}>
                    <NutritionCard
                        icon={<FaUtensils />}
                        title="Difficulty"
                        value={recipe.difficulty || "-"}
                    />
                </Grid>

                <Grid item xs={6} md={3}>
                    <NutritionCard
                        icon={<FaHeart />}
                        title="Calories"
                        value={recipe.nutrition?.calories ?? "-"}
                    />
                </Grid>
            </Grid>

            <Divider sx={{ mb: 4 }} />

            {/* Ingredients */}

            <Typography variant="h5" fontWeight={700} mb={2}>
                Ingredients
            </Typography>

            <Grid container spacing={2} mb={4}>
                {(recipe.ingredients || []).map((ingredient, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <RecipeIngredient ingredient={ingredient} />
                    </Grid>
                ))}
            </Grid>

            <Divider sx={{ mb: 4 }} />

            {/* Steps */}

            <Typography variant="h5" fontWeight={700} mb={2}>
                Cooking Steps
            </Typography>

            {(recipe.steps || []).map((step, index) => (
                <StepCard key={index} step={step} index={index} />
            ))}

            {/* Nutrition */}

            {recipe.nutrition && (
                <>
                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h5" fontWeight={700} mb={2}>
                        Nutrition
                    </Typography>

                    <Grid container spacing={2}>
                        {Object.entries(recipe.nutrition).map(([key, value]) => (
                            <Grid item xs={6} md={3} key={key}>
                                <NutritionCard title={key} value={value} />
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}

            {/* Substitutions */}

            {recipe.substitutions?.length > 0 && (
                <>
                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h5" fontWeight={700} mb={2}>
                        Ingredient Substitutions
                    </Typography>

                    <List>
                        {recipe.substitutions.map((item, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <FaCheckCircle color="success" />
                                </ListItemIcon>

                                <ListItemText primary={item} />
                            </ListItem>
                        ))}
                    </List>
                </>
            )}

            {/* Footer */}

            <Box display="flex" justifyContent="flex-end" gap={2} mt={5}>
                <Button
                    variant="outlined"
                    startIcon={<FaRedo />}
                    onClick={onGenerateAgain}
                    sx={{
                        textTransform: "none",
                        borderRadius: 3,
                    }}
                >
                    Generate Again
                </Button>

                <Button
                    variant="contained"
                    startIcon={<FaHeart />}
                    sx={{
                        textTransform: "none",
                        borderRadius: 3,
                        bgcolor: "#2E7D32",
                        "&:hover": {
                            bgcolor: "#256628",
                        },
                    }}
                >
                    Save Recipe
                </Button>
            </Box>
        </Paper>
    );
}
