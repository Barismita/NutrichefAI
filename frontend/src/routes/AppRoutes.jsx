import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "../components/layout";
import Dashboard from "../pages/Dashboard";
import Pantry from "../pages/Pantry";
import Recipes from "../pages/Recipes";
import Nutrition from "../pages/Nutrition";
import CookingGuide from "../pages/CookingGuide";
import Leftover from "../pages/Leftover";
import Expiry from "../pages/Expiry";
import Assistant from "../pages/Assistant";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* All application pages */}
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route path="/pantry" element={<Pantry />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/nutrition" element={<Nutrition />} />
                    <Route path="/cooking-guide" element={<CookingGuide />} />
                    <Route path="/leftovers" element={<Leftover />} />
                    <Route path="/expiry" element={<Expiry />} />
                    <Route path="/assistant" element={<Assistant />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
