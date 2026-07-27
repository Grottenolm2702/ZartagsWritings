import React from "react";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    // ensure body scroll not locked from previous runs
    document.body.style.overflow = "";

    const navbar = document.getElementById("navbar");
    const openBtn = document.getElementById("open-sidebar-button");
    const media = window.matchMedia("(max-width: 800px)");

    function updateNavbar(e: MediaQueryListEvent | { matches: boolean }) {
      const isMobile = e.matches;
      if (!navbar) return;
      if (isMobile) navbar.setAttribute("inert", "");
      else navbar.removeAttribute("inert");
    }

    function onMediaChange(e: MediaQueryListEvent) {
      updateNavbar(e);
    }

    media.addEventListener("change", onMediaChange);
    updateNavbar({ matches: media.matches });

    // close sidebar on nav link click
    const navLinks = document.querySelectorAll("nav a");
    const onNavClick = () => {
      if (!navbar) return;
      navbar.classList.remove("show");
      if (openBtn) openBtn.setAttribute("aria-expanded", "false");
      const isMobile = window.matchMedia("(max-width: 800px)").matches;
      if (isMobile) navbar.setAttribute("inert", "");
      else navbar.removeAttribute("inert");
      // restore body scroll when navigating
      document.body.style.overflow = "";
      setOpen(false);
    };
    navLinks.forEach((l) => l.addEventListener("click", onNavClick));

    return () => {
      media.removeEventListener("change", onMediaChange);
      navLinks.forEach((l) => l.removeEventListener("click", onNavClick));
      document.body.style.overflow = "";
    };
  }, []);

  React.useEffect(() => {
    const navbar = document.getElementById("navbar");
    const openBtn = document.getElementById("open-sidebar-button");
    if (!navbar) return;
    const header = document.querySelector("header");
    const isMobile = window.matchMedia("(max-width: 800px)").matches;
    if (open) {
      navbar.classList.add("show");
      if (header) header.classList.add("show");
      if (openBtn) openBtn.setAttribute("aria-expanded", "true");
      navbar.removeAttribute("inert");
      // prevent background scroll on mobile when sidebar open
      if (isMobile) document.body.style.overflow = "hidden";
    } else {
      navbar.classList.remove("show");
      if (header) header.classList.remove("show");
      if (openBtn) openBtn.setAttribute("aria-expanded", "false");
      if (isMobile) navbar.setAttribute("inert", "");
      else navbar.removeAttribute("inert");
      // restore scroll
      document.body.style.overflow = "";
    }

    return () => {
      // cleanup in case component unmounts while sidebar open
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        id="open-sidebar-button"
        onClick={() => setOpen(true)}
        aria-label="Open Sidebar"
        aria-expanded={open}
        aria-controls="navbar"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="4" width="24" height="2" fill="#666" />
          <rect y="11" width="24" height="2" fill="#666" />
          <rect y="18" width="24" height="2" fill="#666" />
        </svg>
      </button>

      <Header />

      <div
        id="overlay"
        onClick={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(false);
          }
        }}
        role="button"
        tabIndex={open ? 0 : -1}
        aria-label="Close sidebar"
        aria-hidden={!open}
      ></div>

      {children}
    </>
  );
}
