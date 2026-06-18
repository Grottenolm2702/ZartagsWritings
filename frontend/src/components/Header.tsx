import React from "react";
import { Link } from "react-router-dom";
import { useAuthSafe } from "../context/AuthContext";

export default function Header() {
  const auth = useAuthSafe();

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

        <div
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            display: "flex",
            gap: "8px",
            alignItems: "center",
            zIndex: 1001,
            background: "var(--primary-color)",
            padding: "6px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="checkbox"
              checked={auth.isEditor}
              onChange={auth.toggleEditor}
            />{" "}
            Editor
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="checkbox"
              checked={auth.isDungeonMaster}
              onChange={auth.toggleDungeonMaster}
            />{" "}
            DM
          </label>
        </div>
      </nav>
    </header>
  );
}
