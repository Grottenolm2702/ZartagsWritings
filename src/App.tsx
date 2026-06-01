import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import CampaignOverview from "./pages/CampaignOverview";
import CampaignTypePage from "./pages/campaign/CampaignTypePage";

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
        <Route path="/capaign1/:type" element={<CampaignTypePage />} />
        <Route path="/capaign1/:type/:slug" element={<CampaignTypePage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
