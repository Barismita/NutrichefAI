import { Card, CardContent } from "@mui/material";

export default function SectionCard({ children, sx = {} }) {
    return (
        <Card
            elevation={3}
            sx={{
                width: "100%",
                borderRadius: 3,
                ...sx,
            }}
        >
            <CardContent>{children}</CardContent>
        </Card>
    );
}
