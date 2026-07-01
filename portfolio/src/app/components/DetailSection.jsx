"use client"
import { useInView } from "./use-in-view"

export default function DetailSection({ className = "", children }) {
  const [ref, inView] = useInView()
  return (
    <section ref={ref} className={`detail-section reveal${inView ? " visible" : ""} ${className}`}>
      {children}
    </section>
  )
}
