import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import RecipeGenerator from "./RecipeGenerator";
import RecipeHistory from "./RecipeHistory";
import SavedRecipes from "./SavedRecipes";
import RecipeTabs from "./RecipeTabs";
import RecipeLoading from "./RecipeLoading";
import RecipeHeader from "./RecipeHeader";
import { deleteSavedRecipe, getSavedRecipes } from "../../api/index.js";
import { useNavigate } from "react-router-dom";

export default function Recipes() {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState(0);
    const navigate = useNavigate();
    const [savedRecipes, setSavedRecipes] = useState([]);
    const handleDeleteRecipe = async (recipeId) => {
        try {
            await deleteSavedRecipe(recipeId);

            setSavedRecipes((prev) =>
                prev.filter((recipe) => (recipe.id ?? recipe._id) !== recipeId)
            );

            if ((recipe?.id ?? recipe?._id) === recipeId) {
                setRecipe(null);
            }
        } catch (err) {
            console.error(err);
        }
    };
    const loadSavedRecipes = async () => {
        try {
            const recipes = await getSavedRecipes();
            setSavedRecipes(recipes);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadSavedRecipes();
    }, []);
    const [history, setHistory] = useState([]);
    const handleRecipeGenerated = (generatedRecipe) => {
        setHistory((prev) => [
            {
                ...generatedRecipe,
                created_at: new Date(),
            },
            ...prev,
        ]);

        setLoading(false);

        navigate("/cooking-guide", {
            state: {
                recipe: generatedRecipe,
                allowSave: true,
                source: "generator",
            },
        });
    };

    return (
        <Box
            sx={{
                p: 4,
                maxWidth: 1250,
                mx: "auto",
            }}
        >
            <RecipeHeader />
            <RecipeTabs value={tab} onChange={setTab} />

            {tab === 0 && (
                <>
                    <RecipeGenerator
                        loading={loading}
                        setLoading={setLoading}
                        onRecipeGenerated={handleRecipeGenerated}
                    />

                    {loading && <RecipeLoading />}
                </>
            )}

            {tab === 1 && <SavedRecipes recipes={savedRecipes} onDelete={handleDeleteRecipe} />}

            {tab === 2 && <RecipeHistory history={history} />}
        </Box>
    );
}
