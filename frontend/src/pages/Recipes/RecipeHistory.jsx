import { Paper, Typography, Stack, Chip, Button, Box } from "@mui/material";

export default function RecipeHistory({ history }) {
    if (!history.length) {
        return <Typography color="text.secondary">No recipe history found.</Typography>;
    }

    return (
        <Stack spacing={3}>
            {history.map((recipe) => (
                <Paper
                    key={recipe.id}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                    }}
                >
                    <Typography variant="h6" fontWeight={700}>
                        {recipe.title}
                    </Typography>

                    <Typography color="text.secondary">
                        {new Date(recipe.created_at).toLocaleString()}
                    </Typography>

                    <Box mt={2}>
                        <Chip label={recipe.cuisine} color="success" sx={{ mr: 1 }} />

                        <Chip label={`${recipe.nutrition?.calories ?? "-"} kcal`} />
                    </Box>

                    <Box mt={3}>
                        <Button variant="contained">Cook Again</Button>
                    </Box>
                </Paper>
            ))}
        </Stack>
    );
}
