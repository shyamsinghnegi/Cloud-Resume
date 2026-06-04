"use client"

import { useState } from "react"
import Home from "./components/Home"
import About from "./components/About"
import Projects from "./components/Projects"
import Hobbies from "./components/Hobbies"
import Contact from "./components/Contact"
import Nav from "./components/Nav"

export default function Page() {
  const [section, setSection] = useState("home")
  const [stageClass, setStageClass] = useState("")

  const navigate = (newSection) => {
    if (newSection === section || stageClass) return
    setStageClass("is-exiting")
    setTimeout(() => {
      setSection(newSection)
      setStageClass("is-entering")
      setTimeout(() => setStageClass(""), 450)
    }, 300)
  }

  return (
    <div className="app">

      {section === "home" && (
        <>
          <div className="chrome chrome--top">
            <span className="mono">PORTFOLIO — 2026 / V1</span>
            <span className="mono">PG.01</span>
          </div>
          <div className="chrome chrome--bottom">
            <span className="mono">AVAILABLE FOR WORK — 2026</span>
            <div className="barcode" />
          </div>
        </>
      )}

      {section !== "home" && (
        <Nav collapsed currentSection={section} onNavigate={navigate} />
      )}

      <div className={`stage ${stageClass}`}>
        {section === "home"     && <Home     onNavigate={navigate} />}
        {section === "about"    && <About    onNavigate={navigate} />}
        {section === "projects" && <Projects onNavigate={navigate} />}
        {section === "hobbies"  && <Hobbies  onNavigate={navigate} />}
        {section === "contact"  && <Contact  onNavigate={navigate} />}
      </div>

    </div>
  )
}
