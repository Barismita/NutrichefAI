import { Box } from "@mui/material";

const PageContainer = ({ children }) => {
    return (
        <Box
            component="main"
            sx={{
                flex: 1,
                p: 3,
                overflow: "auto",
                bgcolor: "background.default",
            }}
        >
            {children}
        </Box>
    );
};

export default PageContainer;
