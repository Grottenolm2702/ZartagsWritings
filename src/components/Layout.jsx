import React from 'react'
import Header from './Header'

export default function Layout({ children }) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const navbar = document.getElementById('navbar')
    const openBtn = document.getElementById('open-sidebar-button')
    const media = window.matchMedia('(width < 800px)')

    function updateNavbar(e) {
      const isMobile = e.matches
      if (!navbar) return
      if (isMobile) navbar.setAttribute('inert', '')
      else navbar.removeAttribute('inert')
    }

    function onMediaChange(e) {
      updateNavbar(e)
    }

    media.addEventListener('change', onMediaChange)
    updateNavbar({ matches: media.matches })

    // close sidebar on nav link click
    const navLinks = document.querySelectorAll('nav a')
    const onNavClick = () => {
      if (!navbar) return
      navbar.classList.remove('show')
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false')
      navbar.setAttribute('inert', '')
      setOpen(false)
    }
    navLinks.forEach((l) => l.addEventListener('click', onNavClick))

    return () => {
      media.removeEventListener('change', onMediaChange)
      navLinks.forEach((l) => l.removeEventListener('click', onNavClick))
    }
  }, [])

  React.useEffect(() => {
    const navbar = document.getElementById('navbar')
    const openBtn = document.getElementById('open-sidebar-button')
    if (!navbar) return
    if (open) {
      navbar.classList.add('show')
      if (openBtn) openBtn.setAttribute('aria-expanded', 'true')
      navbar.removeAttribute('inert')
    } else {
      navbar.classList.remove('show')
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false')
      navbar.setAttribute('inert', '')
    }
  }, [open])

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
