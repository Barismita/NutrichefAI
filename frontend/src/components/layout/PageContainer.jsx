import { Box } from "@mui/material";

const PageContainer = ({ children }) => {
    return (
        <Box
            component="main"
            sx={{
                flex: 1,
                pt: 9,
                px: 4,
                pb: 4,
                overflow: "auto",
                bgcolor: "#FFFFFF",
            }}
        >
            {children}
        </Box>
    );
};

export default PageContainer;
