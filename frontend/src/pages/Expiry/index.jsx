import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";
import { FaExclamationTriangle, FaTrashAlt, FaUtensils } from "react-icons/fa";
import { getPantry } from "../../api";

export default function Expiry() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [expired, setExpired] = useState([]);
    const [expiringSoon, setExpiringSoon] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        loadPantry();
    }, []);

    const loadPantry = async () => {
        try {
            setLoading(true);

            const response = await getPantry();
            const pantry = response?.ingredients || [];

            const today = dayjs().startOf("day");

            const expiredItems = [];
            const expiringItems = [];

            pantry.forEach((ingredient) => {
                if (!ingredient.expiry_date) return;

                const expiry = dayjs(ingredient.expiry_date).startOf("day");
                const daysLeft = expiry.diff(today, "day");

                if (daysLeft < 0) {
                    expiredItems.push({
                        ...ingredient,
                        daysLeft,
                    });
                } else if (daysLeft <= 3) {
                    expiringItems.push({
                        ...ingredient,
                        daysLeft,
                    });
                }
            });

            expiredItems.sort((a, b) => a.daysLeft - b.daysLeft);
            expiringItems.sort((a, b) => a.daysLeft - b.daysLeft);

            setExpired(expiredItems);
            setExpiringSoon(expiringItems);
        } catch (err) {
            console.error(err);
            setError("Failed to load pantry.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateRecipe = () => {
        navigate("/recipes", {
            state: {
                ingredients: expiringSoon.map((item) => item.name),
            },
        });
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 8,
                }}
            >
                <CircularProgress color="success" />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: 900,
                mx: "auto",
                p: 4,
            }}
        >
            <Typography variant="h4" fontWeight={700} mb={4}>
                Pantry Expiry
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Stack direction={{ xs: "column", md: "row" }} spacing={3} mb={4}>
                <Card sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="h3" color="error.main">
                            {expired.length}
                        </Typography>

                        <Typography>Expired</Typography>
                    </CardContent>
                </Card>

                <Card sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="h3" color="warning.main">
                            {expiringSoon.length}
                        </Typography>

                        <Typography>Expiring Soon</Typography>
                    </CardContent>
                </Card>
            </Stack>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <FaTrashAlt color="#ef4444" />

                        <Typography variant="h6" fontWeight={600}>
                            Expired
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {expired.length === 0 ? (
                        <Typography color="text.secondary">No expired ingredients.</Typography>
                    ) : (
                        <List>
                            {expired.map((item) => (
                                <ListItem key={item.name}>
                                    <ListItemText
                                        primary={item.name}
                                        secondary={`Expired ${Math.abs(item.daysLeft)} day(s) ago`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>

            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <FaExclamationTriangle color="#f59e0b" />

                        <Typography variant="h6" fontWeight={600}>
                            Expiring Soon
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {expiringSoon.length === 0 ? (
                        <Typography color="text.secondary">
                            Nothing expiring in the next 3 days.
                        </Typography>
                    ) : (
                        <List>
                            {expiringSoon.map((item) => (
                                <ListItem key={item.name}>
                                    <ListItemText primary={item.name} />

                                    <Chip
                                        color={item.daysLeft === 0 ? "error" : "warning"}
                                        label={
                                            item.daysLeft === 0
                                                ? "Today"
                                                : `${item.daysLeft} day(s)`
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>

            <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<FaUtensils />}
                onClick={handleGenerateRecipe}
                disabled={expiringSoon.length === 0}
            >
                Generate Recipe Using Expiring Ingredients
            </Button>
        </Box>
    );
}
