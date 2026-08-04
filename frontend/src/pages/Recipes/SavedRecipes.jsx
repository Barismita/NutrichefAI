import { Grid, Typography } from "@mui/material";

import RecipeCard from "./RecipeCard";

export default function SavedRecipes({ recipes, onView, onDelete }) {
    if (!recipes.length) {
        return <Typography color="text.secondary">No saved recipes.</Typography>;
    }

    return (
        <Grid container spacing={3}>
            {recipes.map((recipe) => (
                <Grid item xs={12} md={4} key={recipe.id ?? recipe._id}>
                    <RecipeCard recipe={recipe} onView={onView} onDelete={onDelete} />
                </Grid>
            ))}
        </Grid>
    );
}
