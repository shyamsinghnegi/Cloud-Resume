"use client"
import { useState, useEffect } from "react"
import "../styles/Nav.css"

const SECTIONS = [
  { id: "about",    label: "About Me",        ix: "01" },
  { id: "projects", label: "Projects",         ix: "02" },
  { id: "hobbies",  label: "Hobbies / Gaming", ix: "03" },
  { id: "contact",  label: "Contact Me",       ix: "04" },
]

const ALL_NAV = [
  { id: "home", label: "HOME", icon: (
    <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
  )},
  { id: "about", label: "ABOUT", icon: (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
  )},
  { id: "projects", label: "PROJECTS", icon: (
    <svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>
  )},
  { id: "hobbies", label: "HOBBIES", icon: (
    <svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4M8 10v4M15 11h2M17 13h2"/></svg>
  )},
  { id: "contact", label: "CONTACT", icon: (
    <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
  )},
]

export default function Nav({ onNavigate, collapsed = false, currentSection = "home" }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!collapsed) return
    const t = setTimeout(() => setShow(true), 50)
    return () => clearTimeout(t)
  }, [collapsed])

  if (!collapsed) {
    return (
      <nav className="nav-expanded">
        <div className="nav-head">
          <div className="rule" />
          <span className="mono">Navigation — 04</span>
        </div>
        <ul className="nav-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button className="nav-link" onClick={() => onNavigate(s.id)}>
                <span className="arr">→</span>
                <span className="lbl">{s.label}</span>
                <span className="ix">{s.ix}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  return (
    <nav className={`nav-collapsed ${show ? "show" : ""}`}>
      {ALL_NAV.map((s) => (
        <button
          key={s.id}
          className={`glass-icon ${currentSection === s.id ? "active" : ""}`}
          onClick={() => onNavigate(s.id)}
        >
          {s.icon}
        </button>
      ))}
    </nav>
  )
}
