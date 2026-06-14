"use client"
import { useRef, useEffect, useMemo } from "react"
import "../styles/StackGraph.css"

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons"
const logo = (s, f) => `${DEVICON}/${s}/${f}.svg`

// fixed category headings (fx/fy are fractions of the container)
const CATS = [
  { id: "cloud",    label: "Cloud",       fx: 0.30, fy: 0.32 },
  { id: "frontend", label: "Frontend",    fx: 0.70, fy: 0.30 },
  { id: "backend",  label: "Backend",     fx: 0.31, fy: 0.70 },
  { id: "devops",   label: "DevOps / CI", fx: 0.69, fy: 0.70 },
]

// movable tech nodes, each linked to a category
const TECH = [
  { id: "aws",    cat: "cloud",    label: "AWS",        src: logo("amazonwebservices", "amazonwebservices-original-wordmark") },
  { id: "azure",  cat: "cloud",    label: "Azure",      src: logo("azure", "azure-original") },
  { id: "react",  cat: "frontend", label: "React",      src: logo("react", "react-original") },
  { id: "next",   cat: "frontend", label: "Next.js",    src: logo("nextjs", "nextjs-original") },
  { id: "js",     cat: "frontend", label: "JavaScript", src: logo("javascript", "javascript-original") },
  { id: "python", cat: "backend",  label: "Python",     src: logo("python", "python-original") },
  { id: "node",   cat: "backend",  label: "Node.js",    src: logo("nodejs", "nodejs-original") },
  { id: "mongo",  cat: "backend",  label: "MongoDB",    src: logo("mongodb", "mongodb-original") },
  { id: "cosmos", cat: "backend",  label: "Cosmos DB",  src: logo("cosmosdb", "cosmosdb-original") },
  { id: "dynamo", cat: "backend",  label: "DynamoDB",   src: logo("dynamodb", "dynamodb-original") },
  { id: "docker", cat: "devops",   label: "Docker",     src: logo("docker", "docker-original") },
  { id: "terra",  cat: "devops",   label: "Terraform",  src: logo("terraform", "terraform-original") },
  { id: "gha",    cat: "devops",   label: "GitHub Actions", src: logo("githubactions", "githubactions-original") },
  { id: "linux",  cat: "devops",   label: "Linux",      src: logo("linux", "linux-original") },
]

function buildGraph() {
  const nodes = [{ id: "root", type: "root", label: "Stack", r: 34, fixed: true, fx: 0.5, fy: 0.5 }]
  for (const c of CATS) nodes.push({ id: c.id, type: "cat", label: c.label, r: 38, fixed: true, fx: c.fx, fy: c.fy })
  for (const t of TECH) nodes.push({ id: t.id, type: "tech", label: t.label, src: t.src, cat: t.cat, r: 30, fixed: false })

  const links = []
  for (const c of CATS) links.push(["root", c.id])
  for (const t of TECH) links.push([t.cat, t.id])
  return { nodes, links }
}

export default function StackGraph() {
  const { nodes, links } = useMemo(() => buildGraph(), [])
  const wrapRef = useRef(null)
  const lineRef = useRef([])
  const elRef = useRef({})

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // local physics state (copy of the static descriptors — never mutate `nodes`)
    const sim = nodes.map((n) => ({ ...n, x: 0, y: 0, vx: 0, vy: 0 }))
    const byId = Object.fromEntries(sim.map((n) => [n.id, n]))
    let W = 0, H = 0

    function measure() {
      const r = wrap.getBoundingClientRect()
      W = r.width; H = r.height
      for (const n of sim) if (n.fixed) { n.x = n.fx * W; n.y = n.fy * H }
    }

    // seed each tech node right on its category, so the intro spring flings it
    // outward into its ring — keeps clusters organised while adding movement
    function seed() {
      for (const n of sim) {
        if (n.fixed) continue
        const cat = byId[n.cat]
        const a = Math.random() * Math.PI * 2
        const r = 6 + Math.random() * 22
        n.x = cat.x + Math.cos(a) * r
        n.y = cat.y + Math.sin(a) * r
        n.vx = 0; n.vy = 0
      }
    }
    // half width/height of each node's pill, so clamping keeps the whole
    // label inside the box (radius alone misses wide pills like "GitHub Actions")
    function measureNodes() {
      for (const n of sim) {
        const el = elRef.current[n.id]
        n.hw = el ? el.offsetWidth / 2 : n.r
        n.hh = el ? el.offsetHeight / 2 : n.r
      }
    }
    measure()
    seed()
    measureNodes()
    // re-measure once the web font has loaded (pill widths change with it)
    requestAnimationFrame(measureNodes)
    document.fonts?.ready?.then(measureNodes)

    const SPRING = 0.015, FRICTION = .85
    const REST_ROOT = 150, REST_CAT = 132

    let dragId = null
    function toLocal(e) {
      const r = wrap.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    function onDown(e) {
      const id = e.target.closest("[data-node]")?.dataset.node
      const n = id && byId[id]
      if (!n || n.fixed) return
      dragId = id
      const p = toLocal(e)
      n.x = p.x; n.y = p.y; n.vx = 0; n.vy = 0
      e.preventDefault()
    }
    function onMove(e) {
      if (!dragId) return
      const p = toLocal(e)
      const n = byId[dragId]
      const padX = (n.hw || n.r) + 6, padY = (n.hh || n.r) + 6
      n.x = Math.max(padX, Math.min(W - padX, p.x))
      n.y = Math.max(padY, Math.min(H - padY, p.y))
      n.vx = 0; n.vy = 0
    }
    function onUp() { dragId = null }

    wrap.addEventListener("pointerdown", onDown)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)

    const GAP_X = 16, GAP_Y = 12 // breathing room between pill boxes
    const OUTWARD = 0.28          // steady push that drives tech nodes to the edges

    function physics(springK, friction) {
      // link springs — keep each tech tethered to its category
      for (const [aId, bId] of links) {
        const a = byId[aId], b = byId[bId]
        const rest = a.type === "root" || b.type === "root" ? REST_ROOT : REST_CAT
        const dx = b.x - a.x, dy = b.y - a.y
        const d = Math.hypot(dx, dy) || 1
        const diff = ((d - rest) / d) * springK
        const fx = dx * diff, fy = dy * diff
        if (!a.fixed && a.id !== dragId) { a.vx += fx; a.vy += fy }
        if (!b.fixed && b.id !== dragId) { b.vx -= fx; b.vy -= fy }
      }
      // push tech nodes outward from the centre, toward the canvas edges
      const cx = W / 2, cy = H / 2
      for (const n of sim) {
        if (n.fixed || n.id === dragId) continue
        const ox = n.x - cx, oy = n.y - cy
        const ol = Math.hypot(ox, oy) || 1
        n.vx += (ox / ol) * OUTWARD
        n.vy += (oy / ol) * OUTWARD
      }
      // integrate velocity → position
      for (const n of sim) {
        if (n.fixed || n.id === dragId) continue
        n.vx *= friction; n.vy *= friction
        n.x += n.vx; n.y += n.vy
      }
      // collision + bounds, interleaved so edge-clamping can't re-overlap.
      // Push along the centre-to-centre direction (radial) so nodes slide
      // *around* each other instead of jamming head-on.
      for (let iter = 0; iter < 6; iter++) {
        for (let i = 0; i < sim.length; i++) {
          const a = sim[i]
          for (let j = i + 1; j < sim.length; j++) {
            const b = sim[j]
            let dx = b.x - a.x, dy = b.y - a.y
            const sepX = (a.hw || a.r) + (b.hw || b.r) + GAP_X
            const sepY = (a.hh || a.r) + (b.hh || b.r) + GAP_Y
            // normalise into "box space"; outside the unit ellipse = no overlap
            if (dx === 0 && dy === 0) { dx = (Math.random() - 0.5); dy = (Math.random() - 0.5) }
            const u = dx / sepX, v = dy / sepY
            const nd = Math.hypot(u, v)
            if (nd >= 1 || nd === 0) continue
            const aMov = !a.fixed && a.id !== dragId
            const bMov = !b.fixed && b.id !== dragId
            if (!aMov && !bMov) continue
            const share = aMov && bMov ? 0.5 : 1
            const corr = (1 / nd - 1)          // how far to push back to the boundary
            const pushX = dx * corr, pushY = dy * corr
            if (aMov) { a.x -= pushX * share; a.y -= pushY * share; a.vx = 0; a.vy = 0 }
            if (bMov) { b.x += pushX * share; b.y += pushY * share; b.vx = 0; b.vy = 0 }
          }
        }
        // clamp inside this iteration so the next collision pass corrects any
        // overlap the clamp introduced at the edges
        for (const n of sim) {
          if (n.fixed || n.id === dragId) continue
          const padX = (n.hw || n.r) + 6, padY = (n.hh || n.r) + 6
          if (n.x < padX) n.x = padX
          if (n.x > W - padX) n.x = W - padX
          if (n.y < padY) n.y = padY
          if (n.y > H - padY) n.y = H - padY
        }
      }
    }

    function render() {
      for (const n of sim) {
        const el = elRef.current[n.id]
        if (el) el.style.transform = `translate(${n.x.toFixed(1)}px, ${n.y.toFixed(1)}px) translate(-50%, -50%)`
      }
      links.forEach(([aId, bId], i) => {
        const ln = lineRef.current[i]
        if (!ln) return
        const a = byId[aId], b = byId[bId]
        ln.setAttribute("x1", a.x.toFixed(1)); ln.setAttribute("y1", a.y.toFixed(1))
        ln.setAttribute("x2", b.x.toFixed(1)); ln.setAttribute("y2", b.y.toFixed(1))
      })
    }

    let raf
    const start = performance.now()
    function loop(t) {
      // intro: stronger spring + less damping so nodes burst out and bounce,
      // then settle to the calm steady-state values
      const intro = t - start < 950
      const springK  = intro ? 0.07 : SPRING
      const friction = intro ? 0.90 : FRICTION
      if (!reduce) physics(springK, friction)
      render()
      raf = requestAnimationFrame(loop)
    }
    render()
    raf = requestAnimationFrame(loop)

    let ro
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => { measure(); measureNodes() })
      ro.observe(wrap)
    }
    return () => {
      cancelAnimationFrame(raf)
      wrap.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      ro?.disconnect()
    }
  }, [nodes, links])

  return (
    <div className="graph" ref={wrapRef}>
      <svg className="graph-links">
        {links.map((_, i) => (
          <line key={i} ref={(el) => { lineRef.current[i] = el }} className="graph-link" />
        ))}
      </svg>
      {nodes.map((n) => (
        <div
          key={n.id}
          data-node={n.id}
          ref={(el) => { elRef.current[n.id] = el }}
          className={`gnode gnode--${n.type}`}
        >
          {n.type === "tech" && <img src={n.src} alt="" loading="lazy" draggable={false} />}
          <span>{n.label}</span>
        </div>
      ))}
      <span className="graph-hint">drag the nodes</span>
    </div>
  )
}
