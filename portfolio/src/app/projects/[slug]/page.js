import Link from "next/link"
import { notFound } from "next/navigation"
import { PROJECTS } from "../data"
import ScreenshotStack from "../../components/ScreenshotStack"
import DetailSection from "../../components/DetailSection"
import "../../styles/project-detail.css"

export function generateStaticParams() {
  return PROJECTS.map(p => ({ slug: p.slug }))
}

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

const BackIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params
  const project = PROJECTS.find(p => p.slug === slug)
  if (!project) notFound()

  return (
    <div className="detail-page stage-el">
      <Link href="/projects" className="detail-back">
        <BackIcon />
        Back to projects
      </Link>

      <div className="detail-head">
        <span className={`proj-status${project.status === "wip" ? " wip" : ""}`}>
          <span className="proj-status-dot" />
          {project.status === "live" ? "Live" : "In progress"}
        </span>
        <h1 className="detail-title">{project.name}</h1>
        <p className="detail-desc">{project.desc}</p>
        <div className="proj-tags">
          {project.tags.map(t => <span key={t} className="proj-tag">{t}</span>)}
        </div>
        <div className="detail-links">
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="bento-cta">
              View project <ExtIcon />
            </a>
          )}
          <a href={project.gh} target="_blank" rel="noopener noreferrer" className="btn-ghost detail-gh">
            <GhIcon /> Source
          </a>
        </div>
      </div>

      {project.screenshots && project.screenshots.length > 0 && (
        <DetailSection>
          <h2>Screenshots</h2>
          <ScreenshotStack screenshots={project.screenshots} />
        </DetailSection>
      )}

      {project.features && (
        <DetailSection>
          <h2>Features</h2>
          <ul
            className="detail-features"
            style={{ "--feature-cols": Math.min(project.features.length, project.features.length === 4 ? 2 : 3) }}
          >
            {project.features.map(f => (
              <li key={f.title}>
                <strong>{f.title}</strong>
                <span>{f.body}</span>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {project.stack && (
        <DetailSection>
          <h2>Stack</h2>
          <div className="detail-stack">
            {project.stack.map(row => (
              <div className="detail-stack-row" key={row.layer}>
                <span className="detail-stack-layer">{row.layer}</span>
                <span className="detail-stack-tech">{row.tech}</span>
              </div>
            ))}
          </div>
        </DetailSection>
      )}

      {project.getStarted && (
        <DetailSection>
          <h2>Getting started</h2>
          <ol className="detail-steps">
            {project.getStarted.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </DetailSection>
      )}
    </div>
  )
}
