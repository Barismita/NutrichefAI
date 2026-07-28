import { Box, Typography } from "@mui/material";
import { FaUtensils } from "react-icons/fa";

export default function RecipeEmpty() {
    return (
        <Box
            sx={{
                py: 8,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    textAlign: "center",
                    maxWidth: 520,
                }}
            >
                {/* Illustration */}

                <Box
                    sx={{
                        width: 130,
                        height: 130,
                        mx: "auto",
                        mb: 3,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #ECFDF5 0%, #DCFCE7 100%)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0 12px 30px rgba(34,197,94,.18)",
                        animation: "float 3s ease-in-out infinite",

                        "@keyframes float": {
                            "0%": {
                                transform: "translateY(0px)",
                            },
                            "50%": {
                                transform: "translateY(-8px)",
                            },
                            "100%": {
                                transform: "translateY(0px)",
                            },
                        },
                    }}
                >
                    <FaUtensils size={58} color="#16A34A" />
                </Box>

                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Ready to Cook?
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        mb: 4,
                        fontSize: 17,
                    }}
                >
                    We'll generate personalized recipes based on your preferences.
                </Typography>

                <Box
                    sx={{
                        display: "inline-flex",
                        flexDirection: "column",
                        gap: 1.5,
                        textAlign: "left",
                    }}
                >
                    <Typography fontWeight={500}>📦 Pantry Ingredients</Typography>

                    <Typography fontWeight={500}>🥗 Dietary Preferences</Typography>

                    <Typography fontWeight={500}>🌍 Favourite Cuisine</Typography>

                    <Typography fontWeight={500}>🎯 Health Goals</Typography>
                </Box>
            </Box>
        </Box>
    );
}
