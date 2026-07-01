"use client"
import { useState, useEffect } from "react"
import Lanyard from "./Lanyard"
import ProfileCard from "./ProfileCard"
import StackGraph from "./StackGraph"
import SkillTree from "./SkillTree"
import CertPreview from "./CertPreview"
import ScrollCue from "../components/ScrollCue"
import { useInView } from "../components/use-in-view"
import { useTiltGlow } from "../components/use-tilt-glow"
import "../styles/about.css"

function useIsMobile(breakpoint = 920) {
  const [isMobile, setIsMobile] = useState(false)
  const [resolved, setResolved] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    setIsMobile(mq.matches)
    setResolved(true)
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [breakpoint])
  return [isMobile, resolved]
}

const PATH = [
  {
    period: "2021 — 2024", title: "BCA", place: "IITM, Janakpuri",
    note: "Bachelor of Computer Applications"
  },
  {
    period: "2024 — 2026", title: "MCA", place: "JIMS, Rohini Sector 5",
    note: "Master of Computer Applications"
  },
  {
    period: "2025  — now", title: "Freelance Developer", place: "Self-employed",
    note: "Building and shipping web apps for clients — frontend, backend and the deploy.", wide: true
  },
]

const CERTS = [
  { tag: "Elite", title: "Introduction to Japanese Language & Culture", issuer: "NPTEL · IIT Kanpur", year: "2026", img: "/certs/japanese.jpg" },
  { tag: "Award", title: "Smart India Hackathon — Project Exhibition", issuer: "IITM, GGSIPU", year: "2024", img: "/certs/best-award.jpg" },
  { tag: "Top 10", title: "Code Blitz — Coding Contest", issuer: "Geek Room · JIMS", year: "2024", img: "/certs/code-blitz.jpg" },
  { tag: "Training", title: "MERN Stack — Industrial Training", issuer: "InternNexus · TechIntelliverse", year: "2023", img: "/certs/mern.jpg" },
  { tag: "Research", title: "Asteroid Search Campaign", issuer: "IASC · NASA / Pan-STARRS", year: "2022", img: "/certs/asteroid.jpg" },
]

function CertCard({ c, i, isMobile }) {
  const tilt = useTiltGlow(3)
  const [previewOpen, setPreviewOpen] = useState(false)

  function onEyeClick(e) {
    e.stopPropagation()
    if (!isMobile) return
    setPreviewOpen(v => !v)
  }
  function onEyeMouseEnter() {
    if (isMobile) return
    setPreviewOpen(true)
  }
  function onEyeMouseLeave() {
    if (isMobile) return
    setPreviewOpen(false)
  }

  return (
    <div
      className="cert-card"
      style={{ "--i": i }}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
    >
      <div className="cert-glow" aria-hidden="true" />
      <img className="cert-dither" src="/dither.png" alt="" aria-hidden="true" draggable={false} />
      <span className="cert-tag">{c.tag}</span>
      <h3 className="cert-title">{c.title}</h3>
      <span className="cert-meta">{c.issuer} · {c.year}</span>

      <span
        className="cert-view"
        tabIndex={0}
        role="button"
        aria-label={`View ${c.title} certificate`}
        onMouseEnter={onEyeMouseEnter}
        onMouseLeave={onEyeMouseLeave}
        onFocus={onEyeMouseEnter}
        onBlur={onEyeMouseLeave}
        onClick={onEyeClick}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </span>

      <CertPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        img={c.img}
        title={c.title}
        isMobile={isMobile}
      />
    </div>
  )
}

export default function AboutPage() {
  const [isMobile, mobileResolved] = useIsMobile()
  const [headRef, headIn] = useInView()
  const [gridRef, gridIn] = useInView({ rootMargin: "0px 0px -12% 0px" })
  const [pathHeadRef, pathHeadIn] = useInView()
  const [pathRef, pathIn] = useInView({ rootMargin: "0px 0px -12% 0px" })
  const [certHeadRef, certHeadIn] = useInView()
  const [certRef, certIn] = useInView({ rootMargin: "0px 0px -12% 0px" })

  const [showCertHint, setShowCertHint] = useState(false)
  useEffect(() => {
    if (!certIn) return
    const raf = requestAnimationFrame(() => setShowCertHint(true))
    const t = setTimeout(() => setShowCertHint(false), 2000)
    return () => { cancelAnimationFrame(raf); clearTimeout(t) }
  }, [certIn])

  const [showFlipHint, setShowFlipHint] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShowFlipHint(true), 100)
    const t2 = setTimeout(() => setShowFlipHint(false), 3000)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  return (
    <>
      <section className="about-hero stage-el">
        <div className={`cert-hint${showFlipHint ? " show" : ""}`} role="status">
          <span className="cert-hint-dot" />
          Tap the card to flip it
        </div>
        <div className="about-left">
          <div className="ph-index">
            <span>01 / About Me</span>
          </div>

          <h2 className="about-heading">Who I Am<span className="accent-dot">.</span></h2>

          <div className="profile-card-slot">
            {mobileResolved && isMobile && <ProfileCard />}
          </div>

          <div className="about-bio">
            <p>
              Cloud &amp; DevOps engineer based in India. I build the infrastructure
              that keeps things running — serverless functions, CI/CD pipelines,
              static deployments — and then go further to wire up the full product.
            </p>
            <p>
              Currently open to remote roles in cloud engineering, DevOps, or
              full-stack. I ship real things: this portfolio runs on Azure Static
              Web Apps with Python Azure Functions and Cosmos DB.
            </p>
          </div>

          <div className="about-status">
            <span className="status-dot" />
            <span>Available for work — remote · contract · full-time</span>
          </div>
        </div>

        {mobileResolved && !isMobile && (
          <div className="about-right">
            <Lanyard />
          </div>
        )}

        <ScrollCue label="Scroll — the stack" />
      </section>

      <section className="stack-section">
        <div
          ref={headRef}
          className={`stack-head reveal${headIn ? " visible" : ""}`}
        >
          <div className="ph-index">
            <span>02 / The Stack</span>
          </div>
          <h2>Tools I build with<span className="accent-dot">.</span></h2>
          <p>
            The kit I reach for across cloud, infrastructure and the full product —
            from provisioning to shipping the frontend.
          </p>
          <p>
            It&apos;s grouped the way I think about a build: the cloud platforms I
            deploy on, the languages I write in, the databases behind them, and the
            tooling that tests, ships and runs everything.
          </p>
          <p>
            Some I use every day, others on specific projects. Drag any node to move
            it around — the map settles back on its own.
          </p>
        </div>

        <div ref={gridRef} className={`stack-graph-wrap${gridIn ? " visible" : ""}`}>
          {mobileResolved && (isMobile ? <SkillTree /> : <StackGraph />)}
        </div>

        <ScrollCue label="Scroll — background" />
      </section>

      <section className="path-section">
        <div
          ref={pathHeadRef}
          className={`path-head reveal${pathHeadIn ? " visible" : ""}`}
        >
          <div className="ph-index">
            <span>03 / Background</span>
          </div>
          <h2>The path so far<span className="accent-dot">.</span></h2>
          <p>
            Studied computer applications through a BCA and an MCA, while freelancing
            on the side. The coursework gave me the fundamentals; the client work
            taught me to ship.
          </p>
        </div>

        <div ref={pathRef} className={`path-cards${pathIn ? " visible" : ""}`}>
          {PATH.map((p, i) => (
            <div
              key={p.title}
              className={`path-card${p.wide ? " path-card--wide" : ""}`}
              style={{ "--i": i }}
            >
              <span className="path-period">{p.period}</span>
              <h3 className="path-title">{p.title}</h3>
              <span className="path-place">{p.place}</span>
              <p className="path-note">{p.note}</p>
            </div>
          ))}
        </div>

        <ScrollCue label="Scroll — certifications" />
      </section>

      <section className="cert-section">
        <div
          ref={certHeadRef}
          className={`cert-head reveal${certHeadIn ? " visible" : ""}`}
        >
          <div className="ph-index">
            <span>04 / Certifications</span>
          </div>
          <h2>Earned along the way<span className="accent-dot">.</span></h2>
          <p>
            A mix of coursework, hands-on training, and one campaign with NASA&apos;s
            asteroid search.
          </p>
        </div>

        <div ref={certRef} className={`cert-grid${certIn ? " visible" : ""}`}>
          {CERTS.map((c, i) => (
            <CertCard key={c.title} c={c} i={i} isMobile={isMobile} />
          ))}
        <div className={`cert-hint${showCertHint ? " show" : ""}`} role="status">
          <span className="cert-hint-dot" />
          {isMobile ? "Tap a card to view the certificate" : "Hover a card to view the certificate"}
        </div>
        </div>

      </section>
    </>
  )
}
