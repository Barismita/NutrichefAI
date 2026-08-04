import { Box, Chip, Paper, Typography } from "@mui/material";

export default function StepCard({ step, index, active = false, completed = false }) {
    const instruction = typeof step === "string" ? step : step.instruction || step.description;

    const duration = typeof step === "object" ? step.duration : null;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                mb: 2,
                borderRadius: 3,
                border: active ? "2px solid #2E7D32" : "1px solid #E5E7EB",
                bgcolor: completed ? "#F1F8E9" : active ? "#F9FFF8" : "white",
                transition: ".2s",
            }}
        >
            <Box
                mb={2}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Chip
                    label={completed ? `✓ STEP ${index + 1}` : `STEP ${index + 1}`}
                    color={active || completed ? "success" : "default"}
                />
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
