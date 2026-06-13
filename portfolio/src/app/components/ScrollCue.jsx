"use client"
import { useEffect, useRef, useState } from "react"

/* Bottom-of-hero "scroll down" hint. Fades out once the user starts
   scrolling the surrounding .stage container. */
export default function ScrollCue({ label = "Scroll" }) {
  const ref = useRef(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const scroller = ref.current?.closest(".stage")
    if (!scroller) return
    const onScroll = () => setHidden(scroller.scrollTop > 40)
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
