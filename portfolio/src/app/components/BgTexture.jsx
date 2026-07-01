"use client"
import { useEffect, useRef } from "react"
import { CONSTELLATIONS } from "./constellations"

const NUM_BG_STARS = 140
const NUM_GIANT_STARS = 12
const MAX_LIVE = 3

function rand(min, max) { return min + Math.random() * (max - min) }

export default function BgTexture() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let raf = null
    let width = 0, height = 0, dpr = 1

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + "px"
      canvas.style.height = height + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const bgStars = Array.from({ length: NUM_BG_STARS }, () => ({
      x: rand(-0.5, 1.5),
      y: Math.random(),
      r: rand(0.5, 1.6),
      phase: rand(0, Math.PI * 2),
      speed: rand(0.4, 1.1),
      base: rand(0.18, 0.55),
    }))

    const GIANT_COLORS = ["255,120,110", "130,170,255", "255,210,110"]
    const giantStars = Array.from({ length: NUM_GIANT_STARS }, () => {
      const color = GIANT_COLORS[Math.floor(Math.random() * GIANT_COLORS.length)]
      return {
        x: rand(-0.5, 1.5),
        y: Math.random(),
        r: rand(2, 3.4),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.25, 0.5),
        base: rand(0.5, 0.85),
        color,
        _glow: null,
      }
    })
    let frameCount = 0

    const DRIFT_PX_PER_SEC = 6
    const DRIFT_SPAN = 2

    let live = []
    let nextSpawn = 0

    let comets = []
    let nextComet = rand(8, 14)

    function spawnComet(t) {
      const fromLeft = Math.random() < 0.5
      const y0 = rand(0.05, 0.5) * height
      const descentAngle = rand(0.08, 0.18) * Math.PI
      const speed = rand(350, 550)
      const dirX = fromLeft ? 1 : -1
      const travel = Math.hypot(width, height * 0.5)
      comets.push({
        start: t,
        duration: travel / speed + 0.6,
        x0: fromLeft ? -60 : width + 60,
        y0,
        vx: Math.cos(descentAngle) * speed * dirX,
        vy: Math.sin(descentAngle) * speed,
        len: rand(70, 110),
      })
    }

    function boundingRadius(def, size) {
      let maxD = 0
      def.stars.forEach(([nx, ny]) => {
        const dx = (nx - 0.5) * size
        const dy = (ny - 0.5) * size
        const d = Math.hypot(dx, dy)
        if (d > maxD) maxD = d
      })
      return maxD
    }

    function spawnConstellation(t) {
      const usedNames = new Set(live.map(c => c.def.name))
      const choices = CONSTELLATIONS.filter(c => !usedNames.has(c.name))
      if (choices.length === 0) return
      const def = choices[Math.floor(Math.random() * choices.length)]
      const size = rand(260, 460)
      const radius = boundingRadius(def, size)

      let best = null
      for (let attempt = 0; attempt < 12; attempt++) {
        const originX = rand(0.12, 0.84) * width
        const originY = rand(0.12, 0.78) * height
        const collides = live.some(c => {
          const dx = c.originX - originX
          const dy = c.originY - originY
          return Math.hypot(dx, dy) < (c.radius + radius + 60)
        })
        if (!collides) { best = { originX, originY }; break }
        if (!best) best = { originX, originY }
      }

      live.push({
        def,
        size,
        radius,
        originX: best.originX,
        originY: best.originY,
        start: t,
        fadeIn: 2.6,
        hold: rand(5, 8),
        fadeOut: 3,
      })
    }

    const start = performance.now()
    let animating = false

    function draw(now) {
      frameCount++
      const t = (now - start) / 1000
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = "#05050b"
      ctx.fillRect(0, 0, width, height)

      const driftFrac = (t * DRIFT_PX_PER_SEC / width) % DRIFT_SPAN

      bgStars.forEach(s => {
        const tw = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase)
        const alpha = s.base * (0.6 + 0.4 * tw)
        let x = ((s.x + driftFrac + 0.5) % DRIFT_SPAN) - 0.5
        ctx.beginPath()
        ctx.fillStyle = `rgba(230,230,255,${alpha.toFixed(3)})`
        ctx.arc(x * width, s.y * height, s.r, 0, Math.PI * 2)
        ctx.fill()
      })

      const refreshGlow = frameCount % 3 === 0
      giantStars.forEach(s => {
        const tw = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase)
        const alpha = s.base * (0.7 + 0.3 * tw)
        let x = ((s.x + driftFrac + 0.5) % DRIFT_SPAN) - 0.5
        x = x * width
        const y = s.y * height
        const glowR = s.r * 5
        if (refreshGlow || !s._glow) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, glowR)
          glow.addColorStop(0, `rgba(${s.color},${(alpha * 0.55).toFixed(3)})`)
          glow.addColorStop(1, `rgba(${s.color},0)`)
          s._glow = glow
        }
        ctx.fillStyle = s._glow
        ctx.fillRect(x - glowR, y - glowR, glowR * 2, glowR * 2)

        ctx.beginPath()
        ctx.fillStyle = `rgba(${s.color},${alpha.toFixed(3)})`
        ctx.arc(x, y, s.r, 0, Math.PI * 2)
        ctx.fill()
      })

      if (t >= nextComet) {
        spawnComet(t)
        nextComet = t + rand(8, 14)
      }
      comets = comets.filter(c => (t - c.start) <= c.duration)
      comets.forEach(c => {
        const age = t - c.start
        const p = age / c.duration
        const fade = p < 0.15 ? p / 0.15 : p > 0.75 ? Math.max(0, 1 - (p - 0.75) / 0.25) : 1
        const x = c.x0 + c.vx * age
        const y = c.y0 + c.vy * age
        const speedMag = Math.hypot(c.vx, c.vy) || 1
        const tx = x - (c.vx / speedMag) * c.len
        const ty = y - (c.vy / speedMag) * c.len

        const grad = ctx.createLinearGradient(x, y, tx, ty)
        grad.addColorStop(0, `rgba(255,255,255,${(0.85 * fade).toFixed(3)})`)
        grad.addColorStop(0.4, `rgba(200,210,255,${(0.4 * fade).toFixed(3)})`)
        grad.addColorStop(1, "rgba(200,210,255,0)")
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.4
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(tx, ty)
        ctx.stroke()

        const headGlow = ctx.createRadialGradient(x, y, 0, x, y, 5)
        headGlow.addColorStop(0, `rgba(255,255,255,${fade.toFixed(3)})`)
        headGlow.addColorStop(1, "rgba(255,255,255,0)")
        ctx.fillStyle = headGlow
        ctx.fillRect(x - 5, y - 5, 10, 10)

        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${fade.toFixed(3)})`
        ctx.arc(x, y, 1.3, 0, Math.PI * 2)
        ctx.fill()
      })

      if (t >= nextSpawn && live.length < MAX_LIVE) {
        spawnConstellation(t)
        nextSpawn = t + rand(4, 8)
      }

      live = live.filter(c => {
        const age = t - c.start
        const total = c.fadeIn + c.hold + c.fadeOut
        return age <= total
      })

      live.forEach(c => {
        const age = t - c.start
        let alpha
        if (age < c.fadeIn) alpha = age / c.fadeIn
        else if (age < c.fadeIn + c.hold) alpha = 1
        else alpha = Math.max(0, 1 - (age - c.fadeIn - c.hold) / c.fadeOut)

        const pts = c.def.stars.map(([nx, ny]) => [
          c.originX + (nx - 0.5) * c.size,
          c.originY + (ny - 0.5) * c.size,
        ])

        ctx.strokeStyle = `rgba(185,166,255,${(alpha * 0.5).toFixed(3)})`
        ctx.lineWidth = 1
        c.def.lines.forEach(([a, b], i) => {
          const lineProgress = Math.min(1, Math.max(0, (age - c.fadeIn * (i / c.def.lines.length)) / (c.fadeIn * 0.6)))
          if (age >= c.fadeIn) {
            ctx.beginPath()
            ctx.moveTo(pts[a][0], pts[a][1])
            ctx.lineTo(pts[b][0], pts[b][1])
            ctx.stroke()
          } else if (lineProgress > 0) {
            const [x1, y1] = pts[a]
            const [x2, y2] = pts[b]
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x1 + (x2 - x1) * lineProgress, y1 + (y2 - y1) * lineProgress)
            ctx.strokeStyle = `rgba(185,166,255,${(alpha * 0.5 * lineProgress).toFixed(3)})`
            ctx.stroke()
          }
        })

        pts.forEach(([x, y], i) => {
          const tw = 0.7 + 0.3 * Math.sin(t * 2.2 + i * 1.3)
          const a = alpha * tw
          const glow = ctx.createRadialGradient(x, y, 0, x, y, 9)
          glow.addColorStop(0, `rgba(255,255,255,${(a * 0.9).toFixed(3)})`)
          glow.addColorStop(1, "rgba(255,255,255,0)")
          ctx.fillStyle = glow
          ctx.fillRect(x - 9, y - 9, 18, 18)

          ctx.beginPath()
          ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`
          ctx.arc(x, y, 2.4, 0, Math.PI * 2)
          ctx.fill()
        })
      })

      if (animating && !reduceMotion) raf = requestAnimationFrame(draw)
    }

    draw(performance.now()) // paint one static frame immediately, no blank flash

    let startTimeout = null
    if (!reduceMotion) {
      startTimeout = setTimeout(() => {
        animating = true
        raf = requestAnimationFrame(draw)
      }, 200)
    }

    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (startTimeout) clearTimeout(startTimeout)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  )
}
