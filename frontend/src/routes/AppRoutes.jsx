import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AppLayout } from "../components/layout";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Pantry from "../pages/Pantry";
import Recipes from "../pages/Recipes";
import Profiles from "../pages/Profiles";
import Nutrition from "../pages/Nutrition";
import CookingGuide from "../pages/CookingGuide";
import Leftover from "../pages/Leftover";
import Expiry from "../pages/Expiry";
import Assistant from "../pages/Assistant";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Landing page without sidebar/navbar */}
                <Route path="/" element={<Home />} />

                {/* All application pages */}
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/pantry" element={<Pantry />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/profiles" element={<Profiles />} />
                    <Route path="/nutrition" element={<Nutrition />} />
                    <Route path="/cooking-guide" element={<CookingGuide />} />
                    <Route path="/leftover" element={<Leftover />} />
                    <Route path="/expiry" element={<Expiry />} />
                    <Route path="/assistant" element={<Assistant />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
