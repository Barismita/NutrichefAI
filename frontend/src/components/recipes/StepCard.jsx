import { Paper, Typography, Box, Chip } from "@mui/material";

export default function StepCard({ step, index }) {
    const instruction = typeof step === "string" ? step : step.instruction || step.description;

    const duration = typeof step === "object" ? step.duration : null;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                mb: 2,
                borderRadius: 3,
                border: "1px solid #E5E7EB",
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Chip label={`STEP ${index + 1}`} color="success" />

                {duration && <Chip label={`${duration} mins`} variant="outlined" />}
            </Box>

            <Typography
                sx={{
                    lineHeight: 1.8,
                }}
            >
                {instruction}
            </Typography>
        </Paper>
    );
}
