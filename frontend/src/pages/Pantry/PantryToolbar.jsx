import { Box, Button, Typography } from "@mui/material";
import { FaPlus, FaBoxOpen } from "react-icons/fa";
import { SearchBar } from "../../components/common";

export default function PantryToolbar({ search, setSearch, onAdd }) {
    return (
        <Box sx={{ mb: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        md: "center",
                    },
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    gap: 3,
                    mb: 3,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: "#2E7D32",
                            mb: 0.5,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mb: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Box>
                                    <FaBoxOpen size={40} color="#5A6A2A" />
                                </Box>

                                <Box>
                                    <Typography variant="h3" fontWeight={700}>
                                        My Pantry
                                    </Typography>

                                    <Typography>
                                        Keep track of your kitchen ingredients and stay organised.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<FaPlus />}
                    onClick={onAdd}
                    sx={{
                        bgcolor: "#BBF1D2",
                        color: "#2F6B45",
                        px: 3,
                        py: 1.2,
                        borderRadius: 8,
                        textTransform: "none",
                        fontWeight: 700,
                        boxShadow: "none",

                        "&:hover": {
                            bgcolor: "#A6E9C4",
                            boxShadow: "0 6px 18px rgba(0,0,0,.08)",
                        },
                    }}
                >
                    Add Ingredient
                </Button>
            </Box>

            <SearchBar value={search} onChange={setSearch} placeholder="Search ingredients..." />
        </Box>
    );
}
