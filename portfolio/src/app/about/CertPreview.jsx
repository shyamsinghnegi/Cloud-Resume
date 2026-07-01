"use client"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export default function CertPreview({ open, onClose, img, title, isMobile }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [everOpened, setEverOpened] = useState(false)
  useEffect(() => {
    if (open) setEverOpened(true)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e) { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!mounted) return null

  return createPortal(
    <div
      className={`cert-preview-overlay${open ? " show" : ""}${isMobile ? " interactive" : ""}`}
      aria-hidden={!open}
      onPointerDown={isMobile ? onClose : undefined}
    >
      <div className="cert-preview">
        {everOpened && <img src={img} alt={`${title} certificate`} draggable={false} />}
      </div>
    </div>,
    document.body
  )
}
