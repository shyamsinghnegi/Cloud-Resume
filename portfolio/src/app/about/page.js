"use client"
import Lanyard from "./Lanyard"
import StackGraph from "./StackGraph"
import ScrollCue from "../components/ScrollCue"
import { useInView } from "../components/use-in-view"
import "../styles/about.css"

export default function AboutPage() {
  const [headRef, headIn] = useInView()
  const [gridRef, gridIn] = useInView({ rootMargin: "0px 0px -12% 0px" })

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
          <StackGraph />
        </div>
      </section>
    </>
  )
}
