"use client"
import { useInView } from "../components/use-in-view"
import "../styles/projects.css"

const PROJECTS = [
  {
    name: "POOF",
    desc: "Drop a file, get a link — no sign-up, no friction. Supports multi-file uploads as a single zip link, resumable downloads via HTTP range requests, SHA-256 deduplication, malware scanning via VirusTotal, and automatic 24-hour expiry. Files go directly from your browser to Cloudflare R2 — the server never touches your bytes.",
    tags: ["Next.js", "Vercel", "Cloudflare R2", "D1", "Upstash"],
    status: "live",
    live: "https://poof-file-sharing.vercel.app/",
    gh: "https://github.com/shyamsinghnegi/POOF-File-sharing",
    slot: "a",
  },
  {
    name: "FloatChat",
    desc: "Query and visualise ARGO ocean data in plain language — RAG pipeline over NetCDF datasets.",
    tags: ["Python", "LLM", "RAG", "TypeScript"],
    status: "wip",
    gh: "https://github.com/shyamsinghnegi/FloatChat",
    slot: "b",
  },
  {
    name: "CivicRelay",
    desc: "Report local civic issues with photo and location — routes them to the right municipal department.",
    tags: ["Next.js", "Azure Functions", "Cosmos DB"],
    status: "wip",
    gh: "https://github.com/shyamsinghnegi/CivicRelay",
    slot: "c",
  },
  {
    name: "Cloud Portfolio",
    desc: "This site — static Next.js frontend on Azure Static Web Apps, backed by Azure Functions and Cosmos DB.",
    tags: ["Next.js", "Azure SWA", "Azure Functions", "Python"],
    status: "wip",
    gh: "https://github.com/shyamsinghnegi/Cloud-Portfolio",
    slot: "d",
  },
  {
    name: "Employee Leave Portal",
    desc: "Leave management system with approval workflows and a full CI/CD pipeline.",
    tags: ["Python", "Flask", "MySQL", "Docker", "Jenkins"],
    status: "wip",
    gh: "https://github.com/shyamsinghnegi/Employee_leave_portal",
    slot: "e",
  },
]

const GhIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

const ExtIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
  </svg>
)

function ProjectCard({ p, className = "" }) {
  return (
    <div className={`bento-card bento-${p.slot} ${className}`}>
      <div className="bento-row">
        <span className={`proj-status${p.status === "wip" ? " wip" : ""}`}>
          <span className="proj-status-dot" />
          {p.status === "live" ? "Live" : "In progress"}
        </span>
        <a href={p.gh} target="_blank" rel="noopener noreferrer" className="proj-gh-link">
          <GhIcon />
        </a>
      </div>
      <h3 className="bento-name">{p.name}</h3>
      <p className="bento-desc">{p.desc}</p>
      <div className="proj-tags">
        {p.tags.map(t => <span key={t} className="proj-tag">{t}</span>)}
      </div>
      {p.live && (
        <a href={p.live} target="_blank" rel="noopener noreferrer" className="bento-cta">
          View project <ExtIcon />
        </a>
      )}
    </div>
  )
}

export default function ProjectsPage() {
  const [headRef, headIn] = useInView()
  const [gridRef, gridIn] = useInView({ rootMargin: "0px 0px -8% 0px" })

  return (
    <section className="proj-section stage-el">
      <div ref={headRef} className={`proj-head reveal${headIn ? " visible" : ""}`}>
        <div className="ph-index">
          <div className="rule" />
          <span>03 / Projects</span>
        </div>
        <h2>What I&apos;ve built<span className="accent-dot">.</span></h2>
        <p>One shipped, four in the works — each solving a real problem.</p>
      </div>

      <div ref={gridRef} className={`bento-grid${gridIn ? " visible" : ""}`}>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.name} p={p} />
        ))}
      </div>
    </section>
  )
}
