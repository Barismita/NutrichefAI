import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import PageContainer from "./PageContainer";

const AppLayout = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <Navbar />

            <Box
                sx={{
                    display: "flex",
                    flex: 1,
                    overflow: "hidden",
                }}
            >
                <Sidebar />

                <PageContainer>
                    <Outlet />
                </PageContainer>
            </Box>

            <Footer />
        </Box>
    );
};

export default AppLayout;
