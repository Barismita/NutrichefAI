import { Box, CircularProgress, Typography } from "@mui/material";

export default function RecipeLoading() {
    return (
        <Box
            sx={{
                py: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
            }}
        >
            <CircularProgress color="success" size={56} />

            <Typography variant="h6" color="text.secondary">
                Generating your perfect recipe...
            </Typography>
        </Box>
    );
}
