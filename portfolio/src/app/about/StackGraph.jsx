"use client"
import { useRef, useEffect, useMemo } from "react"
import { CATS, TECH } from "./stack-data"
import "../styles/StackGraph.css"

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

    const sim = nodes.map((n) => ({ ...n, x: 0, y: 0, vx: 0, vy: 0 }))
    const byId = Object.fromEntries(sim.map((n) => [n.id, n]))
    let W = 0, H = 0

    function measure() {
      const r = wrap.getBoundingClientRect()
      W = r.width; H = r.height
      for (const n of sim) if (n.fixed) { n.x = n.fx * W; n.y = n.fy * H }
    }

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

    const OUTWARD = 0.28
    const REPEL_GAP = 10
    const REPEL_SOFT = 0.06

    function physics(springK, friction) {
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
      const cx = W / 2, cy = H / 2
      for (const n of sim) {
        if (n.fixed || n.id === dragId) continue
        const ox = n.x - cx, oy = n.y - cy
        const ol = Math.hypot(ox, oy) || 1
        n.vx += (ox / ol) * OUTWARD
        n.vy += (oy / ol) * OUTWARD
      }
      for (let i = 0; i < sim.length; i++) {
        const a = sim[i]
        for (let j = i + 1; j < sim.length; j++) {
          const b = sim[j]
          const dx = b.x - a.x, dy = b.y - a.y
          const sep = (a.hw || a.r) + (b.hw || b.r) + REPEL_GAP
          const d = Math.hypot(dx, dy) || 0.01
          if (d >= sep) continue
          const overlap = sep - d
          const ux = dx / d, uy = dy / d
          const push = overlap * REPEL_SOFT
          const aMov = !a.fixed && a.id !== dragId
          const bMov = !b.fixed && b.id !== dragId
          if (aMov) { a.vx -= ux * push; a.vy -= uy * push }
          if (bMov) { b.vx += ux * push; b.vy += uy * push }
        }
      }
      for (const n of sim) {
        if (n.fixed || n.id === dragId) continue
        n.vx *= friction; n.vy *= friction
        n.x += n.vx; n.y += n.vy
      }
      for (const n of sim) {
        if (n.fixed || n.id === dragId) continue
        const padX = (n.hw || n.r) + 6, padY = (n.hh || n.r) + 6
        if (n.x < padX) n.x = padX
        if (n.x > W - padX) n.x = W - padX
        if (n.y < padY) n.y = padY
        if (n.y > H - padY) n.y = H - padY
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
