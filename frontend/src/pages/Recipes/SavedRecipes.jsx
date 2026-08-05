import { Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import RecipeCard from "./RecipeCard";

export default function SavedRecipes({ recipes, onDelete }) {
    const navigate = useNavigate();

    if (!recipes.length) {
        return <Typography color="text.secondary">No saved recipes.</Typography>;
    }

    return (
        <Grid container spacing={3}>
            {recipes.map((recipe) => (
                <Grid size={{ xs: 12, md: 4 }} key={recipe.id ?? recipe._id}>
                    <RecipeCard
                        recipe={recipe}
                        onView={() =>
                            navigate("/cooking-guide", {
                                state: {
                                    recipe,
                                    allowSave: false,
                                    source: "saved",
                                },
                            })
                        }
                        onDelete={onDelete}
                    />
                </Grid>
            ))}
        </Grid>
    );
}
