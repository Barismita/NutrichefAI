import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { FaBoxOpen, FaClock, FaHome, FaRecycle, FaRobot, FaUtensils } from "react-icons/fa";

const drawerWidth = 240;

const sections = [
    {
        title: "",
        items: [
            {
                label: "Dashboard",
                path: "/dashboard",
                icon: <FaHome />,
            },
        ],
    },
    {
        title: "PANTRY",
        items: [
            {
                label: "Pantry",
                path: "/pantry",
                icon: <FaBoxOpen />,
            },
        ],
    },
    {
        title: "COOKING",
        items: [
            {
                label: "Recipes",
                path: "/recipes",
                icon: <FaUtensils />,
            },
        ],
    },
    {
        title: "SAVE FOOD",
        items: [
            {
                label: "Leftovers",
                path: "/leftovers",
                icon: <FaRecycle />,
            },
            {
                label: "Expiring",
                path: "/expiry",
                icon: <FaClock />,
            },
        ],
    },
];

export default function Sidebar() {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    top: 64,
                    height: "calc(100vh - 64px)",
                    borderRight: "1px solid #E5E7EB",
                    background: "#FFFFFF",
                    boxSizing: "border-box",
                    overflowY: "auto",
                },
            }}
        >
            <Box
                sx={{
                    px: 1.5,
                    pt: 0.5,
                    pb: 2,
                }}
            >
                {sections.map((section) => (
                    <Box key={section.title} sx={{ mb: 2 }}>
                        {section.title && (
                            <Typography
                                sx={{
                                    px: 2,
                                    mb: 1,
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: 1.2,
                                    color: "#9CA3AF",
                                }}
                            >
                                {section.title}
                            </Typography>
                        )}

                        <List disablePadding>
                            {section.items.map((item) => (
                                <ListItemButton
                                    key={item.path}
                                    component={NavLink}
                                    to={item.path}
                                    sx={{
                                        py: 1.3,
                                        px: 2,
                                        mb: 0.8,
                                        borderRadius: 3,
                                        color: "#374151",
                                        transition: "all .25s",

                                        "& .MuiListItemIcon-root": {
                                            minWidth: 38,
                                            color: "#6B7280",
                                            transition: "all .25s",
                                        },

                                        "&.active": {
                                            bgcolor: "#EEF8CD",
                                            color: "#355E3B",
                                            fontWeight: 700,
                                            borderLeft: "5px solid #5FAE63",
                                        },

                                        "&.active .MuiListItemIcon-root": {
                                            color: "#355E3B",
                                        },

                                        "&:hover": {
                                            bgcolor: "#F6FAEE",
                                            transform: "translateX(4px)",
                                        },
                                    }}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>

                                    <ListItemText
                                        primary={
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: 15,
                                                }}
                                            >
                                                {item.label}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Box>
                ))}
            </Box>
        </Drawer>
    );
}
