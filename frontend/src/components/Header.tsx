import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useJWTAuth } from "../context/JWTAuthContext";
import contentStyles from "../styles/content.module.css";

export default function Header() {
  const { user, logout, isLoggedIn } = useJWTAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
                <Link to="/users">Users</Link>
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
        </ul>
      </nav>
    </header>
  );
}
