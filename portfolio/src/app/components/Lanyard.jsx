"use client"
import { useRef, useEffect, useState } from "react"

export default function Lanyard({ cardW: CARD_W = 232, cardH: CARD_H = 336 }) {
  const rootRef   = useRef(null)
  const svgRef    = useRef(null)
  const bandRef   = useRef(null)
  const coreRef   = useRef(null)
  const strapLRef = useRef(null)
  const strapRRef = useRef(null)
  const clipRef   = useRef(null)
  const cardRef   = useRef(null)
  const [hint, setHint] = useState(true)

  useEffect(() => {
    const root   = rootRef.current
    const cardEl = cardRef.current
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const SEG      = 8
    const GRAVITY  = reduce ? 0.14 : 0.55
    const FRICTION = 0.985
    const ITER     = 20
    const CLIP_LEN = 12
    const MAX_SPEED = 50, MIN_SPEED = 0

    let W = 0, H = 0, anchor = { x: 0, y: 14 }
    let ropeLen = 0, segLen = 0
    let pts = []
    let corners = []
    let tc = null
    let edgeRests = []
    let tcToTL = 0, tcToTR = 0
    let lastT = performance.now()

    function mk(x, y) { return { x, y, ox: x, oy: y, pinned: false } }
    function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y) }

    function measure() {
      const r = root.getBoundingClientRect()
      W = r.width; H = r.height
      anchor.x = W * 0.5
      anchor.y = 14
      ropeLen = Math.max(60, H * 0.15)
      segLen  = ropeLen / SEG
      svgRef.current.setAttribute("width",  W)
      svgRef.current.setAttribute("height", H)
    }

    function build() {
      measure()
      pts = []
      for (let i = 0; i <= SEG; i++) {
        const y = anchor.y + i * segLen
        pts.push({ x: anchor.x, y, ox: anchor.x, oy: y, pinned: i === 0,
          lerp: { x: anchor.x, y } })
      }
      const end = pts[SEG]
      const cx  = end.x
      const cy  = end.y + CLIP_LEN + CARD_H / 2
      corners = [
        mk(cx - CARD_W / 2, cy - CARD_H / 2),
        mk(cx + CARD_W / 2, cy - CARD_H / 2),
        mk(cx + CARD_W / 2, cy + CARD_H / 2),
        mk(cx - CARD_W / 2, cy + CARD_H / 2),
      ]
      tc = mk(cx, cy - CARD_H / 2)
      tc.lerp = { x: tc.x, y: tc.y }
      edgeRests = [
        { a: 0, b: 1, rest: dist(corners[0], corners[1]) },
        { a: 1, b: 2, rest: dist(corners[1], corners[2]) },
        { a: 2, b: 3, rest: dist(corners[2], corners[3]) },
        { a: 3, b: 0, rest: dist(corners[3], corners[0]) },
        { a: 0, b: 2, rest: dist(corners[0], corners[2]) },
        { a: 1, b: 3, rest: dist(corners[1], corners[3]) },
      ]
      tcToTL = dist(tc, corners[0])
      tcToTR = dist(tc, corners[1])
      if (!reduce) {
        tc.ox = tc.x + 1.4
        for (let i = SEG - 3; i <= SEG; i++) pts[i].ox = pts[i].x + 0.7
      }
    }

    function constrain(a, b, rest) {
      const dx = b.x - a.x, dy = b.y - a.y
      const d  = Math.hypot(dx, dy) || 1e-4
      const pct = (d - rest) / d
      const wa = a.pinned ? 0 : 1, wb = b.pinned ? 0 : 1, tw = wa + wb
      if (!tw) return
      a.x += dx * pct * (wa / tw); a.y += dy * pct * (wa / tw)
      b.x -= dx * pct * (wb / tw); b.y -= dy * pct * (wb / tw)
    }

    function integrate(p) {
      if (p.pinned) return
      const vx = (p.x - p.ox) * FRICTION
      const vy = (p.y - p.oy) * FRICTION
      p.ox = p.x; p.oy = p.y
      p.x += vx; p.y += vy + GRAVITY
    }

    let dragging = false, activeId = -1
    let grabOffset = { x: 0, y: 0 }, pointer = { x: 0, y: 0 }

    function cardCenter() {
      return {
        x: (corners[0].x + corners[1].x + corners[2].x + corners[3].x) / 4,
        y: (corners[0].y + corners[1].y + corners[2].y + corners[3].y) / 4,
      }
    }
    function toLocal(e) {
      const r = root.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    function onDown(e) {
      if (dragging) return
      e.preventDefault()
      dragging = true; activeId = e.pointerId
      cardEl.setPointerCapture(e.pointerId)
      pointer = toLocal(e)
      const c = cardCenter()
      grabOffset = { x: pointer.x - c.x, y: pointer.y - c.y }
      setHint(false)
    }
    function onMove(e) {
      if (!dragging || e.pointerId !== activeId) return
      pointer = toLocal(e)
    }
    function onUp(e) {
      if (e.pointerId !== activeId) return
      dragging = false; activeId = -1
    }

    cardEl.addEventListener("pointerdown",   onDown)
    cardEl.addEventListener("pointermove",   onMove)
    cardEl.addEventListener("pointerup",     onUp)
    cardEl.addEventListener("pointercancel", onUp)

    function step(dt) {
      for (const p of pts)     integrate(p)
      for (const c of corners) integrate(c)
      integrate(tc)

      if (dragging) {
        const target = { x: pointer.x - grabOffset.x, y: pointer.y - grabOffset.y }
        const c = cardCenter()
        const dx = target.x - c.x, dy = target.y - c.y
        for (const k of corners) { k.x += dx; k.y += dy }
        tc.x += dx; tc.y += dy
      }

      for (let it = 0; it < ITER; it++) {
        pts[0].x = anchor.x; pts[0].y = anchor.y
        for (let i = 0; i < SEG; i++) constrain(pts[i], pts[i + 1], segLen)
        for (const e of edgeRests) constrain(corners[e.a], corners[e.b], e.rest)
        constrain(pts[SEG], tc, CLIP_LEN)
        constrain(tc, corners[0], tcToTL)
        constrain(tc, corners[1], tcToTR)
      }

      for (let i = 1; i <= SEG; i++) {
        const p = pts[i], L = p.lerp
        const clamped = Math.max(0.1, Math.min(1, dist(L, p) / 40))
        const f = Math.min(1, dt * (MIN_SPEED + clamped * (MAX_SPEED - MIN_SPEED)))
        L.x += (p.x - L.x) * f
        L.y += (p.y - L.y) * f
      }
    }

    function smoothPath(nodes) {
      if (nodes.length < 2) return ""
      let d = `M ${nodes[0].x.toFixed(1)} ${nodes[0].y.toFixed(1)}`
      for (let i = 0; i < nodes.length - 1; i++) {
        const p0 = nodes[i - 1] || nodes[i]
        const p1 = nodes[i]
        const p2 = nodes[i + 1]
        const p3 = nodes[i + 2] || p2
        const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6
        const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6
        d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
      }
      return d
    }

    function render() {
      const nodes = [pts[0]]
      for (let i = 1; i <= SEG; i++) nodes.push(pts[i].lerp)
      nodes.push(tc)
      const d = smoothPath(nodes)
      bandRef.current.setAttribute("d", d)
      coreRef.current.setAttribute("d", d)

      strapLRef.current.setAttribute("d",
        `M ${pts[SEG].lerp.x.toFixed(1)} ${pts[SEG].lerp.y.toFixed(1)} L ${tc.x.toFixed(1)} ${tc.y.toFixed(1)}`)

      strapRRef.current.setAttribute("d",
        `M ${corners[0].x.toFixed(1)} ${corners[0].y.toFixed(1)} L ${corners[1].x.toFixed(1)} ${corners[1].y.toFixed(1)}`)

      const cx  = (corners[0].x + corners[1].x + corners[2].x + corners[3].x) / 4
      const cy  = (corners[0].y + corners[1].y + corners[2].y + corners[3].y) / 4
      const ang = Math.atan2(corners[1].y - corners[0].y, corners[1].x - corners[0].x) * 180 / Math.PI

      cardEl.style.transform =
        `translate(${(cx - CARD_W / 2).toFixed(1)}px, ${(cy - CARD_H / 2).toFixed(1)}px) rotate(${ang.toFixed(2)}deg)`
      clipRef.current.style.transform =
        `translate(${tc.x.toFixed(1)}px, ${tc.y.toFixed(1)}px) rotate(${ang.toFixed(2)}deg)`
    }

    let raf
    function loop(t) {
      const dt = Math.min(0.05, (t - lastT) / 1000) || 1 / 60
      lastT = t
      step(dt)
      render()
      raf = requestAnimationFrame(loop)
    }

    build()
    render()
    lastT = performance.now()
    raf = requestAnimationFrame(loop)

    let ro
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => build())
      ro.observe(root)
    }

    return () => {
      cancelAnimationFrame(raf)
      cardEl.removeEventListener("pointerdown",   onDown)
      cardEl.removeEventListener("pointermove",   onMove)
      cardEl.removeEventListener("pointerup",     onUp)
      cardEl.removeEventListener("pointercancel", onUp)
      if (ro) ro.disconnect()
    }
  }, [CARD_W, CARD_H])

  return (
    <div className="lanyard" ref={rootRef}>
      <span className="pin" />
      <svg ref={svgRef} className="lanyard-svg" style={{ width: "100%", height: "100%" }}>
        <path ref={bandRef}   className="band" />
        <path ref={coreRef}   className="band-core" />
        <path ref={strapLRef} className="strap" />
        <path ref={strapRRef} className="bar" />
      </svg>
      <div className="clip" ref={clipRef} />
      <div className="badge" ref={cardRef}>
        <div className="badge-top">
          <span>ACCESS / ENGINEERING</span>
          <span className="id">ID·001</span>
        </div>
        <div className="photo">
          <div className="ph-label">PHOTO<span>drop headshot</span></div>
        </div>
        <div className="badge-id">
          <div className="name">Shyam Singh Negi</div>
          <div className="role">Cloud · DevOps · Fullstack</div>
        </div>
        <div className="badge-foot">
          <span className="bc" />
          <span className="yr">CLR · 2026</span>
        </div>
      </div>
      <div className={`drag-hint${hint ? "" : " hide"}`}>
        <span className="d" /> drag the card
      </div>
    </div>
  )
}
