import { Box, Typography } from "@mui/material";

export default function EmptyState({ title, description }) {
    return (
        <Box
            sx={{
                py: 6,
                textAlign: "center",
            }}
        >
            <Typography variant="h5" fontWeight={600}>
                {title}
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
                {description}
            </Typography>
        </Box>
    );
}
