"use client"
import { CATS, TECH } from "./stack-data"
import "../styles/SkillTree.css"

export default function SkillTree() {
  return (
    <div className="skill-tree">
      {CATS.map(cat => (
        <div key={cat.id} className="skill-cat">
          <h3 className="skill-cat-label">{cat.label}</h3>
          <div className="skill-chips">
            {TECH.filter(t => t.cat === cat.id).map(t => (
              <span key={t.id} className="skill-chip">
                <img src={t.src} alt="" loading="lazy" />
                {t.label}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
