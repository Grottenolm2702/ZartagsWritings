import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import CampaignOverview from "./pages/CampaignOverview";
import PC from "./pages/campaign/PC";
import NPC from "./pages/campaign/NPC";
import Location from "./pages/campaign/Location";
import MagicItem from "./pages/campaign/MagicItem";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/about.html" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login.html" element={<Login />} />
        <Route path="/capaign1" element={<CampaignOverview />} />
        <Route path="/capaign1/overview" element={<CampaignOverview />} />
        <Route path="/capaign1/pc" element={<PC />} />
        <Route path="/capaign1/npc" element={<NPC />} />
        <Route path="/capaign1/location" element={<Location />} />
        <Route path="/capaign1/magicitem" element={<MagicItem />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
