import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { FaChartBar } from "react-icons/fa";

import { getPantry } from "../../api";
import { CATEGORY_THRESHOLDS, UNIT_THRESHOLDS } from "../../constants/pantryThresholds";

import DashboardStats from "./DashboardStats";
import DashboardItemDialog from "./DashboardItemDialog";

export default function Dashboard() {
    const navigate = useNavigate();

    const [pantry, setPantry] = useState([]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        const loadPantry = async () => {
            try {
                const response = await getPantry();
                setPantry(response?.ingredients || []);
            } catch (error) {
                console.error(error);
            }
        };

        loadPantry();
    }, []);

    const today = dayjs().startOf("day");

    const expired = pantry.filter((item) => {
        if (!item.expiry_date) return false;

        const expiry = dayjs(item.expiry_date).startOf("day");

        return !expiry.isAfter(today);
    });

    const expiringSoon = pantry.filter((item) => {
        if (!item.expiry_date) return false;

        const expiry = dayjs(item.expiry_date).startOf("day");
        const daysLeft = expiry.diff(today, "day");

        return daysLeft > 0 && daysLeft <= 7;
    });

    const lowStock = pantry.filter((item) => {
        const quantity = Number(item.quantity);

        const unit = item.unit?.toLowerCase();
        const category = item.category;

        const unitThreshold = UNIT_THRESHOLDS[unit];
        const categoryThreshold = CATEGORY_THRESHOLDS[category];

        const threshold = unitThreshold ?? categoryThreshold ?? 2;

        return quantity <= threshold;
    });

    const openDialog = (title, items) => {
        setDialogTitle(title);
        setSelectedItems(items);
        setDialogOpen(true);
    };

    return (
        <Box>
            <Box
                sx={{
                    mb: 3,
                    mt: 1,
                    ml: 4,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1,
                    }}
                >
                    <FaChartBar size={50} />

                    <Typography
                        variant="h3"
                        fontWeight={800}
                        sx={{
                            color: "#10471f",
                            letterSpacing: "-0.5px",
                        }}
                    >
                        Pantry Dashboard
                    </Typography>
                </Box>

                <Typography color="text.secondary">
                    Keep track of ingredients, expiry dates and pantry health.
                </Typography>
            </Box>

            <DashboardStats
                pantry={pantry}
                expiringSoon={expiringSoon}
                expired={expired}
                lowStock={lowStock}
                onIngredientsClick={() => navigate("/pantry")}
                onExpiringClick={() => openDialog("Expiring Soon", expiringSoon)}
                onExpiredClick={() => openDialog("Expired Ingredients", expired)}
                onLowStockClick={() => openDialog("Low Stock Ingredients", lowStock)}
            />

            <DashboardItemDialog
                open={dialogOpen}
                title={dialogTitle}
                items={selectedItems}
                onClose={() => setDialogOpen(false)}
            />
        </Box>
    );
}
