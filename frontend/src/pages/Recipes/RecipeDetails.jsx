import {
    Alert,
    Box,
    Button,
    Chip,
    Collapse,
    Divider,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Snackbar,
    Typography,
} from "@mui/material";

import {
    FaCheckCircle,
    FaClock,
    FaHeart,
    FaMagic,
    FaRedo,
    FaUsers,
    FaUtensils,
} from "react-icons/fa";
import NutritionCard from "../../components/recipes/NutritionCard";
import RecipeIngredient from "../../components/recipes/RecipeIngredient";
import StepCard from "../../components/recipes/StepCard";
import { saveRecipe } from "../../api/index";
import { useState } from "react";

export default function RecipeDetails({ recipe, onGenerateAgain, onSave }) {
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: "",
    });
    const [currentStep, setCurrentStep] = useState(0);
    const [showAllSteps, setShowAllSteps] = useState(false);
    const handleSave = async () => {
        try {
            await saveRecipe(recipe);

            if (onSave) {
                onSave(recipe);
            }

            setSnackbar({
                open: true,
                severity: "success",
                message: "Recipe saved successfully!",
            });
        } catch (err) {
            console.error(err);
            setSnackbar({
                open: true,
                severity: "error",
                message: "Unable to save recipe.",
            });
        }
    };
    const totalSteps = recipe.instructions?.length || 0;

    const progress = totalSteps === 0 ? 0 : ((currentStep + 1) / totalSteps) * 100;
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

            <Box
                mb={4}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        {recipe.name || recipe.title}
                    </Typography>

                    <Typography color="text.secondary" mt={1}>
                        {recipe.description}
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
                        value={`${recipe.cooking_time_minutes ?? "-"} mins`}
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

            <Typography variant="h5" fontWeight={700}>
                Step-by-Step Cooking
            </Typography>

            <Box mt={2} mb={3}>
                <Typography fontWeight={600}>
                    Step {currentStep + 1} of {totalSteps}
                </Typography>

                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        mt: 1,
                        height: 10,
                        borderRadius: 5,
                    }}
                />

                <Typography variant="body2" color="text.secondary" mt={1}>
                    {Math.round(progress)}% Complete
                </Typography>
            </Box>

            <StepCard step={recipe.instructions[currentStep]} index={currentStep} />

            <Box
                mt={3}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Button
                    variant="outlined"
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                >
                    Previous
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    disabled={currentStep === totalSteps - 1}
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                >
                    Next
                </Button>
            </Box>

            <Box mt={3}>
                <Button onClick={() => setShowAllSteps(!showAllSteps)}>
                    {showAllSteps ? "Hide All Steps" : "View All Steps"}
                </Button>

                <Collapse in={showAllSteps}>
                    <Box mt={2}>
                        {recipe.instructions.map((step, index) => (
                            <StepCard
                                key={index}
                                step={step}
                                index={index}
                                active={index === currentStep}
                                completed={index < currentStep}
                            />
                        ))}
                    </Box>
                </Collapse>
            </Box>

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

            <Box
                gap={2}
                mt={5}
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
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
                    startIcon={<FaHeart />}
                    variant="outlined"
                    color="success"
                    onClick={handleSave}
                >
                    Save Recipe
                </Button>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false,
                    })
                }
            >
                <Alert severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
}
