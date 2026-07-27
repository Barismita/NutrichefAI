import { Box, Button, Typography } from "@mui/material";
import { FaPlusCircle } from "react-icons/fa";
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
                        🥗 My Pantry
                    </Typography>

                    <Typography variant="body1" color="text.secondary">
                        Keep track of your kitchen ingredients and stay organised.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<FaPlusCircle />}
                    onClick={onAdd}
                    sx={{
                        px: 4,
                        py: 1.3,
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: 3,
                        backgroundColor: "#43A047",
                        "&:hover": {
                            backgroundColor: "#388E3C",
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
