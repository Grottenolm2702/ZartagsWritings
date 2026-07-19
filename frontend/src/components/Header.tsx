import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useJWTAuth } from "../context/JWTAuthContext";
import contentStyles from "../styles/content.module.css";

type ThemeMode = "light" | "dark";

export default function Header() {
  const { user, logout, isLoggedIn } = useJWTAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = React.useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "dark";
    const storage =
      "localStorage" in window && window.localStorage ? window.localStorage : null;
    const stored = storage?.getItem("theme") ?? null;
    if (stored === "light" || stored === "dark") return stored;
    const prefersLight =
      "matchMedia" in window &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    return prefersLight ? "light" : "dark";
  });

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if ("localStorage" in window && window.localStorage) {
      window.localStorage.setItem("theme", theme);
    }
  }, [theme]);

  function isActive(path: string) {
    return location.pathname === path;
  }

  return (
    <header>
      <nav id="navbar">
        <ul>
          <li className="home-li">
            <Link className={isActive('/') ? contentStyles.navLinkActive : contentStyles.navLink} to="/">Home</Link>
          </li>
          <li>
            <Link className={isActive('/about') ? contentStyles.navLinkActive : contentStyles.navLink} to="/about">About</Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link
                  className={isActive("/users") ? contentStyles.navLinkActive : contentStyles.navLink}
                  to="/users"
                >
                  Users
                </Link>
              </li>
              <li>
                <button
                  className="nav-button"
                  onClick={async () => {
                    await logout();
                    navigate("/");
                  }}
                >
                  Logout{user?.name ? ` (${user.name})` : ""}
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link className={isActive('/login') ? contentStyles.navLinkActive : contentStyles.navLink} to="/login">
                  Login
                </Link>
              </li>
              <li>
                <Link className={isActive('/register') ? contentStyles.navLinkActive : contentStyles.navLink} to="/register">Register</Link>
              </li>
            </>
          )}
          <li>
            <button
              className="nav-button"
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              aria-label={theme === "dark" ? "Zum Light Mode wechseln" : "Zum Dark Mode wechseln"}
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
