import Lanyard from "./Lanyard"

const STACK = [
  { label: "AWS",            cat: "cloud"   },
  { label: "Azure",          cat: "cloud"   },
  { label: "Python",         cat: "lang"    },
  { label: "JavaScript",     cat: "lang"    },
  { label: "Next.js",        cat: "web"     },
  { label: "React",          cat: "web"     },
  { label: "GitHub Actions", cat: "devops"  },
  { label: "Terraform",      cat: "devops"  },
  { label: "Docker",         cat: "devops"  },
  { label: "Linux",          cat: "devops"  },
  { label: "Cosmos DB",      cat: "data"    },
  { label: "DynamoDB",       cat: "data"    },
]

export default function About({ onNavigate }) {
  return (
    <div className="about-section stage-el">

      {/* ── Left column ── */}
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

        <div className="about-stack-block">
          <div className="stack-eyebrow">Stack</div>
          <div className="stack-tags">
            {STACK.map(s => (
              <span key={s.label} className={`stack-tag stack-tag--${s.cat}`}>
                {s.label}
              </span>
            ))}
          </div>
        </div>

        <div className="about-status">
          <span className="status-dot" />
          <span>Available for work — remote · contract · full-time</span>
        </div>

      </div>

      {/* ── Right column: lanyard ── */}
      <div className="about-right">
        <Lanyard cardW={280} cardH={406} />
      </div>

    </div>
  )
}
