import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const auth = (() => {
    try {
      return useAuth();
    } catch {
      return { isEditor: false, isDungeonMaster: false, toggleEditor: () => {}, toggleDungeonMaster: () => {} } as any;
    }
  })();

  return (
    <header>
      <nav id="navbar">
        <ul>
          <li className="home-li">
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link className="accent-link" to="/login">
              Login
            </Link>
          </li>
        </ul>

        <div style={{ position: "absolute", right: 16, top: 12, display: "flex", gap: "8px", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input type="checkbox" checked={auth.isEditor} onChange={auth.toggleEditor} /> Editor
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input type="checkbox" checked={auth.isDungeonMaster} onChange={auth.toggleDungeonMaster} /> DM
          </label>
        </div>
      </nav>
    </header>
  );
}
