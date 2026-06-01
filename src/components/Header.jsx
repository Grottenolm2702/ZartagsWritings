import React from "react";

export default function Header() {
  return (
    <header>
      <nav id="navbar">
        <ul>
          <li className="home-li">
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a className="accent-link" href="/login">
              Login
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
