"use client"
import { useEffect, useRef, useState } from "react"

export function useInView(options) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") { setInView(true); return }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px", ...options }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return [ref, inView]
}
