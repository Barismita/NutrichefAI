import { useState } from "react";
import {
    Paper,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Button,
    CircularProgress,
    Box,
    Checkbox,
    FormControlLabel,
    InputAdornment,
} from "@mui/material";

import { FaMagic } from "react-icons/fa";
import { GiCook } from "react-icons/gi";
import { generateRecipe } from "../../api";

export default function RecipeGenerator({ onRecipeGenerated }) {
    const [ingredients, setIngredients] = useState("");
    const [diet, setDiet] = useState("");
    const [goal, setGoal] = useState("");
    const [loading, setLoading] = useState(false);
    const [usePantry, setUsePantry] = useState(true);

    const handleGenerate = async () => {
        try {
            setLoading(true);

            const payload = {
                ingredients: ingredients
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                diet,

                health_goal: goal,
                use_pantry: usePantry,
            };

            const recipe = await generateRecipe(payload);
            onRecipeGenerated(recipe);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        "& .MuiOutlinedInput-root": {
            height: 64,
            borderRadius: "999px",
            backgroundColor: "#F8FAFC",

            "& input": {
                padding: "20px 22px",
                fontSize: 18,
            },

            "& .MuiSelect-select": {
                padding: "20px 22px",
                fontSize: 18,
            },
        },
    };

    return (
        <Box
            sx={{
                py: 2,
            }}
        >
            {/* Header */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                }}
            >
                <GiCook size={65} color="#2E7D32" style={{ flexShrink: 0 }} />

                <Box>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 600,
                            color: "#1F2937",
                            lineHeight: 1.05,
                            mb: 0.5,
                        }}
                    >
                        Create Your Perfect Recipe
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 400,
                            fontSize: "1.6rem",
                        }}
                    >
                        Powered by AI • Personalized • Pantry Aware
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    gap: 3,
                    flexWrap: "wrap",
                }}
            >
                <Box sx={{ flex: 1, minWidth: 260 }}>
                    <TextField
                        fullWidth
                        label="Ingredients"
                        placeholder="Milk, Rice, Chicken..."
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        sx={inputStyle}
                    />
                </Box>

                <Box sx={{ flex: 1, minWidth: 260 }}>
                    <TextField
                        select
                        fullWidth
                        label="Diet"
                        value={diet}
                        onChange={(e) => setDiet(e.target.value)}
                        sx={inputStyle}
                    >
                        <MenuItem value="">Any</MenuItem>
                        <MenuItem value="vegetarian">Vegetarian</MenuItem>
                        <MenuItem value="non-vegetarian">Non-Vegetarian</MenuItem>
                        <MenuItem value="high-protein">High Protein</MenuItem>
                        <MenuItem value="quick">Quick Meal</MenuItem>
                    </TextField>
                </Box>

                <Box sx={{ flex: 1, minWidth: 260 }}>
                    <TextField
                        fullWidth
                        label="Health Goal"
                        placeholder="Weight Loss, Muscle Gain..."
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        sx={inputStyle}
                    />
                </Box>
            </Box>
            <Box
                mt={4}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 3,
                }}
            >
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={usePantry}
                            onChange={(e) => setUsePantry(e.target.checked)}
                            color="success"
                        />
                    }
                    label="Use only ingredients available in my pantry"
                    sx={{ m: 0 }}
                />
                <Box
                    sx={{
                        mt: 2.5, // adds space above the button
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handleGenerate}
                        disabled={loading}
                        startIcon={
                            loading ? <CircularProgress size={18} color="inherit" /> : <FaMagic />
                        }
                        sx={{
                            minWidth: 260,
                            height: 64,
                            borderRadius: 999,
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: 17,
                            boxShadow: "0 10px 24px rgba(22,163,74,.28)",

                            "&:hover": {
                                background: "linear-gradient(90deg,#16A34A 0%,#15803D 100%)",
                            },
                        }}
                    >
                        {loading ? "Generating..." : "Generate Recipe"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
