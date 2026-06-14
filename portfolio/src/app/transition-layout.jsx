"use client"
import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Nav from "./components/Nav"
import { NavCtx } from "./nav-context"

const PATHS = {
  home:     "/",
  about:    "/about",
  projects: "/projects",
  hobbies:  "/hobbies",
  contact:  "/contact",
}

function pathToSection(p) {
  return Object.entries(PATHS).find(([, v]) => v === p)?.[0] ?? "home"
}

export default function TransitionLayout({ children }) {
  const pathname  = usePathname()
  const router    = useRouter()
  const [section,    setSection]    = useState(() => pathToSection(pathname))
  const [stageClass, setStageClass] = useState("")
  const busy     = useRef(false)
  const prevPath = useRef(pathname)

  const navigate = useCallback((target) => {
    const path = PATHS[target] ?? "/"
    if (path === prevPath.current || busy.current) return
    busy.current = true
    setStageClass("is-exiting")
    setTimeout(() => {
      setStageClass("is-hidden")
      router.push(path)
    }, 160)
  }, [router])

  useEffect(() => {
    if (pathname === prevPath.current) return
    prevPath.current = pathname
    setSection(pathToSection(pathname))
    const raf = requestAnimationFrame(() => {
      setStageClass("is-entering")
      setTimeout(() => {
        setStageClass("")
        busy.current = false
      }, 500)
    })
    return () => cancelAnimationFrame(raf)
  }, [pathname])

  const isHome = section === "home"

  return (
    <NavCtx.Provider value={navigate}>
      <div className={`app${isHome ? " is-home" : ""}`}>
        {isHome && (
          <div className="chrome chrome--bottom">
            <span className="mono">AVAILABLE FOR WORK — 2026</span>
            <div className="barcode" />
          </div>
        )}
        {/* icon nav: left strip on desktop (non-home), bottom pill on mobile (all pages) */}
        <Nav collapsed currentSection={section} onNavigate={navigate} />
        <div key={section} className={`stage ${stageClass}`}>
          {children}
        </div>
      </div>
    </NavCtx.Provider>
  )
}
