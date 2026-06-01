import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
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
      </nav>
    </header>
  )
}
