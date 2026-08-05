import Grid from "@mui/material/Grid";
import { FaBoxOpen, FaClock, FaExclamationTriangle, FaShoppingBasket } from "react-icons/fa";

import DashboardCard from "./DashboardCard";

export default function DashboardStats({
    pantry,
    expiringSoon,
    expired,
    lowStock,
    onIngredientsClick,
    onExpiringClick,
    onExpiredClick,
    onLowStockClick,
}) {
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
                <DashboardCard
                    title="Ingredients"
                    value={pantry.length}
                    subtitle="View Pantry"
                    icon={<FaBoxOpen />}
                    color="#66BB6A"
                    onClick={onIngredientsClick}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <DashboardCard
                    title="Expiring Soon"
                    value={expiringSoon.length}
                    subtitle="Expires within 7 days"
                    icon={<FaClock />}
                    color="#FB8C00"
                    onClick={onExpiringClick}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <DashboardCard
                    title="Expired"
                    value={expired.length}
                    subtitle="Needs immediate attention"
                    icon={<FaExclamationTriangle />}
                    color="#E53935"
                    onClick={onExpiredClick}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <DashboardCard
                    title="Low Stock"
                    value={lowStock.length}
                    subtitle="Tap to view ingredients"
                    icon={<FaShoppingBasket />}
                    color="#F9A825"
                    onClick={onLowStockClick}
                />
            </Grid>
        </Grid>
    );
}
