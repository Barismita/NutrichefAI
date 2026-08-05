import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, MenuItem, TextField } from "@mui/material";
import { generateRecipe } from "../../api";
import { FaMagic } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function RecipeGenerator({ onRecipeGenerated }) {
    const [ingredients, setIngredients] = useState("");
    const [diet, setDiet] = useState("");
    const [maxCookingTime, setMaxCookingTime] = useState(30);
    const [servings, setServings] = useState(2);
    const [loading, setLoading] = useState(false);
    const [usePantry, setUsePantry] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.ingredients) {
            setIngredients(location.state.ingredients.join(", "));
            setUsePantry(true);
        }
    }, [location.state]);
    const handleGenerate = async () => {
        try {
            setLoading(true);

            const payload = {
                ingredients:
                    location.state?.ingredients ??
                    ingredients
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                diet,
                max_cooking_time: maxCookingTime === "" ? null : Number(maxCookingTime),
                servings: Number(servings),
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
    useEffect(() => {
        if (location.state?.ingredients && location.state.ingredients.length > 0) {
            handleGenerate();
        }
    }, []);
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
        <Box sx={{ mt: 2 }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        lg: "2fr 1fr 1fr 1fr auto",
                    },
                    gap: 2,
                    alignItems: "center",
                }}
            >
                <TextField
                    fullWidth
                    label="Ingredients"
                    placeholder="Milk, Rice, Chicken..."
                    value={ingredients}
                    disabled={loading}
                    onChange={(e) => setIngredients(e.target.value)}
                    sx={inputStyle}
                />

                <TextField
                    select
                    fullWidth
                    label="Diet"
                    value={diet}
                    disabled={loading}
                    onChange={(e) => setDiet(e.target.value)}
                    sx={inputStyle}
                >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="vegetarian">Vegetarian</MenuItem>
                    <MenuItem value="vegan">Vegan</MenuItem>
                    <MenuItem value="high-protein">High Protein</MenuItem>
                    <MenuItem value="low-carb">Low Carb</MenuItem>
                    <MenuItem value="keto">Keto</MenuItem>
                    <MenuItem value="gluten-free">Gluten Free</MenuItem>
                    <MenuItem value="dairy-free">Dairy Free</MenuItem>
                </TextField>

                <TextField
                    select
                    fullWidth
                    label="Cooking Time"
                    value={maxCookingTime}
                    disabled={loading}
                    onChange={(e) => setMaxCookingTime(e.target.value)}
                    sx={inputStyle}
                >
                    <MenuItem value={15}>15 min</MenuItem>
                    <MenuItem value={30}>30 min</MenuItem>
                    <MenuItem value={45}>45 min</MenuItem>
                    <MenuItem value={60}>60 min</MenuItem>
                    <MenuItem value="">No Limit</MenuItem>
                </TextField>

                <TextField
                    select
                    fullWidth
                    label="Servings"
                    value={servings}
                    disabled={loading}
                    onChange={(e) => setServings(e.target.value)}
                    sx={inputStyle}
                >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                </TextField>

                <Button
                    variant="contained"
                    onClick={handleGenerate}
                    disabled={loading}
                    startIcon={
                        loading ? <CircularProgress size={20} color="inherit" /> : <FaMagic />
                    }
                    sx={{
                        height: 64,
                        minWidth: 240,
                        borderRadius: "999px",
                        textTransform: "none",
                        fontSize: 20,
                        fontWeight: 700,
                        background: "linear-gradient(135deg,#22C55E,#16A34A)",
                        color: "#fff",
                        boxShadow: "0 12px 30px rgba(34,197,94,.25)",
                        whiteSpace: "nowrap",

                        "&:hover": {
                            background: "linear-gradient(135deg,#16A34A,#15803D)",
                        },

                        "&:disabled": {
                            background: "#D1D5DB",
                            color: "#6B7280",
                        },
                    }}
                >
                    {loading ? "Generating..." : "Generate Recipe"}
                </Button>
            </Box>
        </Box>
    );
}
