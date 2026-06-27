import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useJWTAuth } from "../context/JWTAuthContext";

export default function Header() {
  const { user, logout, isLoggedIn } = useJWTAuth();
  const navigate = useNavigate();

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
                <Link className="accent-link" to="/login">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
