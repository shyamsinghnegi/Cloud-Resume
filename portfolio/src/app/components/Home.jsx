"use client"
import Nav from "./Nav"

export default function Home({ onNavigate }) {
    return (
        <div className="home">
            <div className="hero-left">

                <div className="eyebrow stage-el" style={{ '--index': 0 }}>
                    <div className="dash" />
                    <span className="num">01</span>
                    <span>— INDEX / HOME</span>
                </div>

                <h1 className="hero-name stage-el" style={{ '--index': 1 }}>
                    <span className="ln">Shyam</span>
                    <span className="ln">Singh Negi<span className="accent-dot">.</span></span>
                </h1>

                <p className="hero-desc stage-el" style={{ '--index': 2 }}>
                    Cloud &amp; DevOps engineer who builds full-stack systems and actually deploys them.
                </p>

                <div className="hero-meta stage-el" style={{ '--index': 3 }}>
                    <span><strong>CLOUD</strong> + DEVOPS</span>
                    <span className="sep">/</span>
                    <span>28°36′N 77°12′E</span>
                </div>

            </div>

            <div className="hero-right stage-el" style={{ '--index': 1 }}>
                <Nav onNavigate={onNavigate} />
            </div>
        </div>
    )
}
