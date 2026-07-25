import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Pantry from "../pages/Pantry";
import Recipes from "../pages/Recipes";
import Profile from "../pages/Profile";
import Nutrition from "../pages/Nutrition";
import CookingGuide from "../pages/CookingGuide";
import Leftover from "../pages/Leftover";
import Expiry from "../pages/Expiry";
import Assistant from "../pages/Assistant";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pantry" element={<Pantry />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/cooking-guide" element={<CookingGuide />} />
                <Route path="/leftover" element={<Leftover />} />
                <Route path="/expiry" element={<Expiry />} />
                <Route path="/assistant" element={<Assistant />} />
            </Routes>
        </BrowserRouter>
    );
}
