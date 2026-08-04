import { Box, Typography } from "@mui/material";
import { GiCook } from "react-icons/gi";

export default function RecipeHeader() {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                mb: 5,
            }}
        >
            <GiCook size={70} color="#2E7D32" />

            <Box>
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 700,
                        color: "#1F2937",
                        lineHeight: 1.05,
                    }}
                >
                    Create Your Perfect Recipe
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                        fontSize: 28,
                        color: "#2E7D32",
                        fontWeight: 600,
                    }}
                >
                    Powered by AI • Personalized • Pantry Aware
                </Typography>
            </Box>
        </Box>
    );
}
