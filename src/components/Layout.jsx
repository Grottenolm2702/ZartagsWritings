import React from 'react'
import Header from './Header'

export default function Layout({ children }) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <button
        id="open-sidebar-button"
        onClick={() => setOpen(true)}
        aria-label="Open Sidebar"
        aria-expanded={open}
        aria-controls="navbar"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="4" width="24" height="2" fill="#666" />
          <rect y="11" width="24" height="2" fill="#666" />
          <rect y="18" width="24" height="2" fill="#666" />
        </svg>
      </button>

      <Header />

      <div id="overlay" onClick={() => setOpen(false)} aria-hidden={!open} style={{ display: open ? 'block' : 'none' }}></div>

      {children}
    </>
  )
}
