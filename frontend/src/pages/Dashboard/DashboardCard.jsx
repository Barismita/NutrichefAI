import { Card, CardContent, Typography, Box } from "@mui/material";

export default function DashboardCard({ title, value, subtitle, icon, color, onClick }) {
    return (
        <Card
            elevation={0}
            onClick={onClick}
            sx={{
                cursor: onClick ? "pointer" : "default",
                borderRadius: 2,
                border: "1px solid #DDE3EA",
                backgroundColor: "#FCFCFD",
                mx: "auto",
                maxWidth: 570,
                width: "100%",
                transition: ".25s",
                "&:hover": onClick
                    ? {
                          transform: "translateY(-4px)",
                          boxShadow: "0 10px 24px rgba(0,0,0,.08)",
                      }
                    : {},
            }}
        >
            <CardContent
                sx={{
                    p: 3,
                    position: "relative",
                    minHeight: 140,
                }}
            >
                {/* Icon */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 50,
                        right: 24,
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        bgcolor: `${color}18`,
                        color,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 48,
                    }}
                >
                    {icon}
                </Box>

                {/* Title */}
                <Typography variant="h4" fontWeight={700}>
                    {title}
                </Typography>

                {/* Number */}
                <Typography
                    sx={{
                        fontSize: 60,
                        fontWeight: 500,
                        lineHeight: 1,
                        mt: 2,
                    }}
                >
                    {value}
                </Typography>

                {/* Subtitle */}
                <Typography variant="body1" color="text.secondary" mt={2}>
                    {subtitle}
                </Typography>
            </CardContent>
        </Card>
    );
}
