
export default function Home() {
  return (
    <main className="pt-30 min-h-screen">
      <section className="site-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 items-start">

          {/* LEFT — info panel */}
          <div className="panel-cut border border-border bg-surface p-10">
            <p className="text-accent font-mono text-xs tracking-[.2em] mb-5 flex items-center gap-2">
              <span className="text-accent animate-pulse text-[.7rem]">▲</span>
              PERSONNEL FILE — UNREDACTED
            </p>
            <h1 className="glitch font-display font-bold text-[5.5rem] mt-4 leading-none" data-text="SHYAM SINGH NEGI">SHYAM SINGH NEGI</h1>
            <div className="flex gap-3 mt-4 text-xs tracking-[.3em] text-dim">
              <span>CLOUD ENGINEER</span>
              <span className="text-accent">/</span>
              <span>DEVOPS</span>
              <span className="text-accent">/</span>
              <span>FULLSTACK</span>
            </div>
            <div className="mt-8 border-t border-b border-border pt-6 pb-6 flex flex-col gap-3">
              {[
                { label: "CLOUD", value: 72 },
                { label: "DEVOPS", value: 65 },
                { label: "FRONTEND", value: 58 },
                { label: "BACKEND", value: 52 },
              ].map((stat) => (
                <div key={stat.label} className="grid grid-cols-[100px_1fr_36px] items-center gap-3">
                  <span className="text-xs tracking-[.2em] text-dim">{stat.label}</span>
                  <div className="h-2 bg-black border border-border">
                    <div
                      className="h-full bg-accent stat-bar-fill"
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                  <span className="text-xs text-accent text-right">{stat.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 border-l-2 border-accent pl-4">
              <p className="text-accent text-xs tracking-[.2em] mb-1">&gt; CURRENT OBJECTIVE_</p>
              <p className="text-sm text-dim">Secure first industry role — DevOps / Cloud Engineering.</p>
            </div>

            <div className="mt-8">
              <a href="/channel" className="btn-open-channel inline-block px-6 py-3 text-xs tracking-[.2em]">
                OPEN CHANNEL
              </a>
            </div>
          </div>

          {/* RIGHT — portrait panel */}

          <div className="panel-cut border border-border bg-surface pt-8 pb-43 flex flex-col items-center gap-3">

            <div className="relative w-80 h-80 mx-auto my-2">
              <div className="absolute inset-0 bg-accent" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                <div className="absolute inset-[1.5] bg-background flex flex-col items-center justify-center text-center" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                  <span className="text-mute text-xs tracking-[.2em]">[ PHOTO ]</span>
                  <span className="text-mute text-[10px] tracking-[.2em] mt-1">drop subject portrait</span>
                </div>
              </div>
              {/* Corner accent squares at each point of the diamond */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border border-accent rotate-45 bg-background" />
              <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 border border-accent rotate-45 bg-background" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 border border-accent rotate-45 bg-background" />
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border border-accent rotate-45 bg-background" />
            </div>
            <p className="text-xs tracking-[.2em] text-dim my-4 ">ID: <b className="text-white">BWN-0067-IN</b></p>
            <p className="text-xs tracking-[.2em] text-mute border-t border-border pt-4 w-full text-center">
              VISITOR <b className="text-accent">001</b> / 200 ◆
            </p>
          </div>

        </div>
        <div className="mt-30">
          <p className="text-accent text-xs tracking-[.2em] mb-4">{'// PERSONNEL FILE'}</p>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">

            {/* LEFT — ident */}
            <div className="border border-border bg-surface p-7">
              <dl className="flex flex-col gap-4">
                {[
                  { label: "CLASSIFICATION", lines: ["CLOUD ENGINEER", "DEVOPS // FULLSTACK"] },
                  { label: "LOCATION", lines: ["NEW DELHI, IN", "NODE 67-IN"] },
                  { label: "STATUS", value: "ACTIVE — SEEKING ASSIGNMENT", accent: true },
                  { label: "CLEARANCE", value: "ENTRY LEVEL // T-01" },
                  { label: "LANGUAGES", value: "EN · HI" },
                  { label: "DURATION", value: "FULL-TIME / REMOTE / HYBRID" },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="text-mute text-xs tracking-[.2em]">{item.label}</dt>
                    {item.lines
                      ? item.lines.map((l) => <dd key={l} className="text-sm mt-0.5 text-foreground">{l}</dd>)
                      : <dd className={`text-sm mt-0.5 ${item.accent ? "text-accent" : "text-foreground"}`}>{item.value}</dd>
                    }
                  </div>
                ))}
              </dl>
            </div>

            {/* RIGHT — briefing */}
            <div className="border border-border bg-surface p-7 relative">
              <div className="absolute top-5 right-5 border-2 border-accent px-4 py-1 rotate-[-8deg] text-center opacity-90" style={{background: 'rgba(255,17,17,0.04)'}}>
                <span className="block font-display font-bold text-accent text-xl tracking-wider">TOP SECRET</span>
                <span className="block text-accent text-[9px] tracking-[.2em]">— EYES ONLY —</span>
              </div>
              <p className="text-sm text-dim leading-relaxed pr-40">
                Subject is a final-year student operating out of node 67-IN, currently weaponising a stack of Azure, AWS, containers and CI/CD pipelines.
              </p>
              <p className="text-sm text-dim leading-relaxed mt-4 pr-40">
                Background runs deep on full-stack development; recent trajectory aimed squarely at Cloud + DevOps. Builds clean, ships quietly, learns fast.
              </p>
              <div className="mt-6 pt-5 border-t border-dashed border-border grid gap-2">
                <div className="r-line" />
                <div className="r-line-short" />
                <p className="text-accent text-xs tracking-[.2em] mt-1">&gt; FILE CONTINUES IN SECURE CHANNEL_</p>
              </div>
            </div>

          </div>
        </div>
      </section>
      <footer className="border-t border-border mt-16 py-7 font-mono">
        <div className="site-container flex justify-between items-center flex-wrap gap-4 text-xs tracking-[.2em]">
          <span>SHYAM SINGH NEGI <span className="text-mute">{'// BLACKWALL//NET // 2026'}</span></span>
          <span className="text-mute">&gt; END OF FILE_ <span className="inline-block w-2 h-3 bg-accent align-middle animate-pulse" /></span>
        </div>
      </footer>
    </main>
  );
}
