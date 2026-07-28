import { useState } from "react";
import { Box } from "@mui/material";

import RecipeGenerator from "./RecipeGenerator";
import RecipeEmpty from "./RecipeEmpty";
import RecipeDetails from "./RecipeDetails";

export default function Recipes() {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRecipeGenerated = (generatedRecipe) => {
        setRecipe(generatedRecipe);
        setLoading(false);
    };

    const handleGenerateAgain = () => {
        setRecipe(null);
    };

    return (
        <Box
            sx={{
                p: 4,
                maxWidth: 1400,
                mx: "auto",
            }}
        >
            <RecipeGenerator
                loading={loading}
                setLoading={setLoading}
                onRecipeGenerated={handleRecipeGenerated}
            />

            {!loading && !recipe && (
                <Box mt={4}>
                    <RecipeEmpty />
                </Box>
            )}

            {!loading && recipe && (
                <RecipeDetails recipe={recipe} onGenerateAgain={handleGenerateAgain} />
            )}
        </Box>
    );
}
