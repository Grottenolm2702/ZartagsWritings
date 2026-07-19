import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import CampaignCreate from "./pages/campaign/CreateCampaign";
import CampaignOverview from "./pages/CampaignOverview";
import CampaignTypePage from "./pages/campaign/CampaignTypePage";
import EditItemPage from "./pages/campaign/EditItem";
import ManageCampaign from "./pages/campaign/ManageCampaign";
import { JWTAuthProvider } from "./context/JWTAuthContext";
import Register from "./pages/Register";
import Users from "./pages/Users";

export default function App() {
  return (
    <JWTAuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<Users />} />
          <Route path="/campaigns/new" element={<CampaignCreate />} />
          <Route path="/campaigns/:slug" element={<CampaignOverview />} />
          <Route path="/campaigns/:slug/overview" element={<CampaignOverview />} />
          <Route path="/campaigns/:slug/:type" element={<CampaignTypePage />} />
          <Route path="/campaigns/:slug/:type/new" element={<EditItemPage />} />
          <Route path="/campaigns/:slug/:type/:entitySlug/edit" element={<EditItemPage />} />
          <Route path="/campaigns/:slug/manage" element={<ManageCampaign />} />
          <Route path="/campaigns/:slug/:type/:entitySlug" element={<CampaignTypePage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </JWTAuthProvider>
  );
}
