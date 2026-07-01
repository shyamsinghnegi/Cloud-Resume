"use client"

export function useTiltGlow(maxTilt = 3) {
  function onPointerMove(e) {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = x / rect.width
    const py = y / rect.height
    const tiltX = (py - 0.5) * -maxTilt
    const tiltY = (px - 0.5) * maxTilt
    card.style.setProperty("--mx", `${x}px`)
    card.style.setProperty("--my", `${y}px`)
    card.style.setProperty("--tilt-x", `${tiltX}deg`)
    card.style.setProperty("--tilt-y", `${tiltY}deg`)
  }

  function onPointerLeave(e) {
    const card = e.currentTarget
    card.style.setProperty("--tilt-x", "0deg")
    card.style.setProperty("--tilt-y", "0deg")
  }

  return { onPointerMove, onPointerLeave }
}
