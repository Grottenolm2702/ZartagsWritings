import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/base.css";
import "./styles/navigation.css";
import "./styles/content.css";
import "./styles/form.css";
import "./styles/about.css";
import "./styles/overview.css";
import "./script.js";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
