import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import RecipeGenerator from "./RecipeGenerator";
import RecipeEmpty from "./RecipeEmpty";
import RecipeDetails from "./RecipeDetails";
import RecipeHistory from "./RecipeHistory";
import SavedRecipes from "./SavedRecipes";
import RecipeTabs from "./RecipeTabs";
import RecipeLoading from "./RecipeLoading";
import RecipeHeader from "./RecipeHeader";
import { deleteSavedRecipe, getSavedRecipes } from "../../api/index.js";

export default function Recipes() {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState(0);

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
        console.log("Parent received:", generatedRecipe);

        setRecipe(generatedRecipe);

        setHistory((prev) => [
            {
                ...generatedRecipe,
                created_at: new Date(),
            },
            ...prev,
        ]);

        setLoading(false);
    };
    const handleGenerateAgain = () => {
        setRecipe(null);
    };
    const handleRecipeSaved = () => {
        loadSavedRecipes();
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

                    {!loading && !recipe && <RecipeEmpty />}

                    {!loading && recipe && (
                        <RecipeDetails
                            recipe={recipe}
                            onGenerateAgain={handleGenerateAgain}
                            onSave={handleRecipeSaved}
                        />
                    )}
                </>
            )}

            {tab === 1 && (
                <SavedRecipes
                    recipes={savedRecipes}
                    onView={(savedRecipe) => {
                        setRecipe(savedRecipe);
                        setTab(0);
                    }}
                    onDelete={handleDeleteRecipe}
                />
            )}

            {tab === 2 && <RecipeHistory history={history} />}
        </Box>
    );
}
