import { Paper, Typography, Box } from "@mui/material";

export default function NutritionCard({ icon, title, value }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                border: "1px solid #E5E7EB",
                borderRadius: 3,
                textAlign: "center",
                height: "100%",
                transition: "0.2s",
                "&:hover": {
                    boxShadow: 2,
                    transform: "translateY(-2px)",
                },
            }}
        >
            {icon && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 1,
                        color: "#2E7D32",
                    }}
                >
                    {icon}
                </Box>
            )}

            <Typography variant="body2" color="text.secondary">
                {title}
            </Typography>

            <Typography variant="h6" fontWeight={700} mt={1}>
                {value}
            </Typography>
        </Paper>
    );
}
