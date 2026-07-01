"use client"
import { useEffect, useRef, useState } from "react"

export default function ScrollCue({ label = "Scroll" }) {
  const ref = useRef(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const el = ref.current
    const scroller = el?.closest(".stage")
    const section = el?.closest("section")
    if (!scroller || !section) return
    const onScroll = () => setHidden(Math.abs(scroller.scrollTop - section.offsetTop) > 80)
    onScroll()
    scroller.addEventListener("scroll", onScroll, { passive: true })
    return () => scroller.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div ref={ref} className={`scroll-cue${hidden ? " is-hidden" : ""}`}>
      <span className="scroll-cue-label">{label}</span>
      <span className="scroll-cue-track" />
    </div>
  )
}
