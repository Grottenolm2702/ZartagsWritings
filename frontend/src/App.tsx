import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import CampaignOverview from "./pages/CampaignOverview";
import CampaignTypePage from "./pages/campaign/CampaignTypePage";
import EditItemPage from "./pages/campaign/EditItem";
import ManageCampaign from "./pages/campaign/ManageCampaign";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import Users from "./pages/Users";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<Users />} />
          <Route path="/capaign1" element={<CampaignOverview />} />
          <Route path="/capaign1/overview" element={<CampaignOverview />} />
          <Route path="/capaign1/:type" element={<CampaignTypePage />} />
          <Route path="/capaign1/:type/new" element={<EditItemPage />} />
          <Route path="/capaign1/:type/:slug/edit" element={<EditItemPage />} />
          <Route path="/capaign1/manage" element={<ManageCampaign />} />
          <Route path="/capaign1/:type/:slug" element={<CampaignTypePage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
