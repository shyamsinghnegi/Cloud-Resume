"use client"
import { useState } from "react"
import Lanyard from "./Lanyard"
import ScrollCue from "../components/ScrollCue"
import { useInView } from "../components/use-in-view"

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons"
const logo = (slug, file) => `${DEVICON}/${slug}/${file}.svg`

const GROUPS = [
  {
    cat: "Cloud",
    items: [
      { name: "AWS",   src: logo("amazonwebservices", "amazonwebservices-original-wordmark") },
      { name: "Azure", src: logo("azure", "azure-original") },
    ],
  },
  {
    cat: "Frontend",
    items: [
      { name: "React",      src: logo("react", "react-original") },
      { name: "Next.js",    src: logo("nextjs", "nextjs-original") },
      { name: "JavaScript", src: logo("javascript", "javascript-original") },
    ],
  },
  {
    cat: "Backend",
    items: [
      { name: "Python",    src: logo("python", "python-original") },
      { name: "Cosmos DB", src: logo("cosmosdb", "cosmosdb-original") },
      { name: "DynamoDB",  src: logo("dynamodb", "dynamodb-original") },
    ],
  },
  {
    cat: "DevOps / CI",
    items: [
      { name: "Docker",         src: logo("docker", "docker-original") },
      { name: "Terraform",      src: logo("terraform", "terraform-original") },
      { name: "GitHub Actions", src: logo("githubactions", "githubactions-original") },
      { name: "Linux",          src: logo("linux", "linux-original") },
    ],
  },
]

export default function AboutPage() {
  const [headRef, headIn] = useInView()
  const [gridRef, gridIn] = useInView({ rootMargin: "0px 0px -12% 0px" })
  const [active, setActive] = useState("Frontend")
  const activeGroup = GROUPS.find((g) => g.cat === active) ?? GROUPS[0]

  return (
    <>
      {/* ── Hero: one viewport ── */}
      <section className="about-hero stage-el">
        <div className="about-left">
          <div className="ph-index">
            <div className="rule" />
            <span>01 / About Me</span>
          </div>

          <h2 className="about-heading">Who I Am.</h2>

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

        <div className="about-right">
          <Lanyard cardW={252} cardH={366} />
        </div>

        <ScrollCue label="Scroll — the stack" />
      </section>

      {/* ── Stack: scrolls into view ── */}
      <section className="stack-section">
        <div
          ref={headRef}
          className={`stack-head reveal${headIn ? " visible" : ""}`}
        >
          <div className="ph-index">
            <div className="rule" />
            <span>02 / The Stack</span>
          </div>
          <h2>Tools I build with.</h2>
          <p>
            The kit I reach for across cloud, infrastructure and the full product —
            from provisioning to shipping the frontend.
          </p>
        </div>

        <div ref={gridRef} className={`stack-ui${gridIn ? " visible" : ""}`}>
          <div className="stack-tabs">
            {GROUPS.map((g) => {
              const on = g.cat === active
              return (
                <button
                  key={g.cat}
                  className={`stack-tab${on ? " active" : ""}`}
                  onClick={() => setActive(g.cat)}
                  disabled={on}
                >
                  <span>{g.cat}</span>
                  <span className="tab-count">{String(g.items.length).padStart(2, "0")}</span>
                </button>
              )
            })}
          </div>

          <div className="stack-panel">
            <div className="stack-bubbles" key={active}>
              {activeGroup.items.map((t, i) => (
                <div key={t.name} className="tech-bubble" style={{ "--i": i }}>
                  <img src={t.src} alt={`${t.name} logo`} loading="lazy" draggable={false} />
                  <span>{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
