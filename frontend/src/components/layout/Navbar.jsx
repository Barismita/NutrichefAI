import { AppBar, Toolbar, Typography, Box, IconButton, Chip } from "@mui/material";

import { FaLeaf } from "react-icons/fa";

const Navbar = () => {
    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                backgroundColor: "#BBF1D2",
                color: "#1F2937",
                borderBottom: "1px solid #E5E7EB",
                height: 64,
                justifyContent: "center",
            }}
        >
            <Toolbar
                sx={{
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1.5,
                        width: "100%",
                    }}
                >
                    <FaLeaf size={22} color="#2F6B45" />

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: "#2F6B45",
                        }}
                    >
                        NutriChef AI
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
