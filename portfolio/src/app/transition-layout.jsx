"use client"
import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Nav from "./components/Nav"
import BgTexture from "./components/BgTexture"
import { NavCtx } from "./nav-context"

const PATHS = {
  home:     "/",
  about:    "/about",
  projects: "/projects",
  hobbies:  "/hobbies",
  contact:  "/contact",
}

function pathToSection(p) {
  const exact = Object.entries(PATHS).find(([, v]) => v === p)?.[0]
  if (exact) return exact
  const [, top] = p.split("/")
  return Object.keys(PATHS).includes(top) ? top : "home"
}

function isProjectDetail(p) {
  return /^\/projects\/[^/]+/.test(p)
}

export default function TransitionLayout({ children }) {
  const pathname  = usePathname()
  const router    = useRouter()
  const [section,    setSection]    = useState(() => pathToSection(pathname))
  const [stageClass, setStageClass] = useState("")
  const [homeIntro,  setHomeIntro]  = useState(() => pathToSection(pathname) === "home")
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

  useEffect(() => {
    if (section !== "home") return
    setHomeIntro(true)
    const t = setTimeout(() => setHomeIntro(false), 1500)
    return () => clearTimeout(t)
  }, [section])

  const isHome = section === "home"
  const isDetail = isProjectDetail(pathname)

  return (
    <NavCtx.Provider value={navigate}>
      {!isDetail && <BgTexture />}
      <div className={`app${isHome ? " is-home" : ""}${isDetail ? " is-project-detail" : ""}${isHome && homeIntro ? " home-intro" : ""}`}>
        {!isDetail && <div className={`bg-scrim${isHome && homeIntro ? " intro" : ""}`} aria-hidden="true" />}
        {isHome && (
          <div className="chrome chrome--bottom">
            <span className="mono">AVAILABLE FOR WORK — 2026</span>
            <div className="barcode" />
          </div>
        )}
        {!isDetail && <Nav collapsed currentSection={section} onNavigate={navigate} />}
        <div key={section} className={`stage ${stageClass}`}>
          {children}
        </div>
      </div>
    </NavCtx.Provider>
  )
}
