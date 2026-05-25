"use client"
import { useState, useEffect, useCallback } from "react"

const BOOT_KEY = '__bwn_v2_boot_seen'

const LOG_LINES = [
    'initiating personnel file handshake...',
    'verifying clearance tier // PUBLIC',
    'decrypting dossier shard 0x4E.67',
    'mounting neural log archive',
    'compiling braindance index',
    'patching cyberware registry',
]

const ACCENT = 'var(--accent)'
const ACCENT_GLOW = '0 0 12px rgba(255,17,17,.55)'
const DIM = 'var(--text-dim)'
const MUTE = 'var(--text-mute)'
const BORDER = 'var(--border)'

export default function BootScreen() {
    const [visible, setVisible] = useState(() => {
        try { return !sessionStorage.getItem(BOOT_KEY) } catch { return false }
    })
    const [preDone, setPreDone] = useState(true)
    const [progress, setProgress] = useState(0)
    const [visibleRows, setVisibleRows] = useState(new Set())
    const [done, setDone] = useState(false)
    const [hiding, setHiding] = useState(false)

    const dismiss = useCallback(() => {
        try { sessionStorage.setItem(BOOT_KEY, '1') } catch { }
        setHiding(true)
        setTimeout(() => setVisible(false), 380)
    }, [])
    // useEffect(() => {
    //     document.body.style.overflow = 'hidden'
    //     return () => { document.body.style.overflow = '' }
    // }, [])
    useEffect(() => {
        if (!visible) return

        const TOTAL_MS = 3400
        const STEP_MS = 40
        let elapsed = 0

        const id = setInterval(() => {
            elapsed += STEP_MS
            const pct = Math.min(100, Math.round((elapsed / TOTAL_MS) * 100))
            setProgress(pct)

            const rowsToShow = Math.floor((pct / 100) * LOG_LINES.length)
            setVisibleRows(prev => {
                const next = new Set(prev)
                for (let i = 0; i < rowsToShow; i++) next.add(i)
                return next
            })

            if (pct >= 100) {
                clearInterval(id)
                setTimeout(() => {
                    setPreDone(false)
                    setTimeout(() => setDone(true), 400)
                }, 200)
            }
        }, STEP_MS)

        return () => clearInterval(id)
    }, [visible])

    useEffect(() => {
        if (!done) return
        const onKey = (e) => { if (e.key === 'Enter') dismiss() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [done, dismiss])

    if (!visible) return null

    // Elements that fade in after 100% load
    const fade = {
        transition: 'opacity .5s ease',
        opacity: preDone ? 0 : 1,
        pointerEvents: preDone ? 'none' : 'auto',
    }

    const META = {
        position: 'absolute',
        fontSize: 11,
        letterSpacing: '.15em',
        lineHeight: 1.7,
        ...fade,
    }

    const cornerBorder = `1px solid ${ACCENT}`
    const CORNER_BASE = { position: 'absolute', width: 28, height: 28 }

    return (
        <div style={{
            position: 'fixed',
            top: 0, right: 0, bottom: 0, left: 0,
            background: '#000',
            zIndex: 10000,
            display: 'grid',
            placeItems: 'center',
            transition: 'opacity .35s ease, transform .35s ease',
            opacity: hiding ? 0 : 1,
            transform: hiding ? 'scale(1.02)' : 'none',
            pointerEvents: hiding ? 'none' : undefined,
        }}>

            {/* Corner accents */}
            <div style={{ position: 'absolute', inset: 0, ...fade }}>
                <span style={{ ...CORNER_BASE, top: 24, left: 24, borderTop: cornerBorder, borderLeft: cornerBorder }} />
                <span style={{ ...CORNER_BASE, top: 24, right: 24, borderTop: cornerBorder, borderRight: cornerBorder }} />
                <span style={{ ...CORNER_BASE, bottom: 24, left: 24, borderBottom: cornerBorder, borderLeft: cornerBorder }} />
                <span style={{ ...CORNER_BASE, bottom: 24, right: 24, borderBottom: cornerBorder, borderRight: cornerBorder }} />
            </div>

            {/* Meta TL */}
            <div style={{ ...META, top: 36, left: 64, color: DIM }}>
                <div style={{ whiteSpace: 'nowrap' }}>SCANN_OPT 0.02</div>
                <div style={{ whiteSpace: 'nowrap' }}>NODE 67-IN</div>
                <div style={{ whiteSpace: 'nowrap' }}>{'LAT 28.6139 // LON 77.2090'}</div>
            </div>

            {/* Meta TR */}
            <div style={{ ...META, top: 36, right: 64, color: ACCENT, textAlign: 'right' }}>
                <div style={{ whiteSpace: 'nowrap' }}>{'BLACKWALL//NET'}</div>
                <div style={{ whiteSpace: 'nowrap' }}>SECURE CHANNEL</div>
                <div style={{ whiteSpace: 'nowrap', animation: 'boot-blink 1.4s ease-in-out infinite' }}>[ ACTIVE ]</div>
            </div>

            {/* Meta BL */}
            <div style={{ ...META, bottom: 36, left: 64, color: DIM }}>
                <div style={{ whiteSpace: 'nowrap' }}>UPLINK 500NM</div>
                <div style={{ whiteSpace: 'nowrap' }}>EST. ENCRYPTION</div>
                <div style={{ whiteSpace: 'nowrap' }}>v2.0.0</div>
            </div>

            {/* Meta BR */}
            <div style={{ ...META, bottom: 36, right: 64, color: DIM, textAlign: 'right' }}>
                <div style={{ whiteSpace: 'nowrap' }}>CLEARANCE: PUBLIC</div>
                <div style={{ whiteSpace: 'nowrap' }}>SUBJECT: S.S.NEGI</div>
                <div style={{ whiteSpace: 'nowrap' }}>REF: BWN-0067</div>
            </div>

            {/* Stage */}
            <div style={{ width: 'min(720px, 86vw)', display: 'grid', gap: 22, textAlign: 'center' }}>

                {/* Spinner */}
                <div style={{ display: 'grid', placeItems: 'center', height: 200, position: 'relative', color: ACCENT, paddingTop:40}}>
                     <div style={{ position: 'relative', marginTop: 40 }}>

                    <svg viewBox="0 0 120 120" style={{ width: 96, height: 96, filter: `drop-shadow(${ACCENT_GLOW})`, animation: 'boot-spin 4.5s linear infinite' }}>
                        <polygon points="60,8 112,100 8,100" fill="none" stroke="currentColor" strokeWidth="1.2" />
                        <polygon points="60,22 100,92 20,92" fill="none" stroke="currentColor" strokeOpacity=".55" strokeWidth="1" />
                        <circle cx="60" cy="68" r="3" fill="currentColor" />
                    </svg>
                    <svg viewBox="0 0 120 120" style={{ position: 'absolute', inset: 0, margin: 'auto', width: 96, height: 96, opacity: 0, animation: 'boot-ghost 4.5s linear infinite', animationDelay: '0.75s' }}>
                        <polygon points="60,8 112,100 8,100" fill="none" stroke="currentColor" strokeWidth="1" />
                    </svg>
                    <svg viewBox="0 0 120 120" style={{ position: 'absolute', inset: 0, margin: 'auto', width: 96, height: 96, opacity: 0, animation: 'boot-ghost 4.5s linear infinite', animationDelay: '1.5s' }}>
                        <polygon points="60,8 112,100 8,100" fill="none" stroke="currentColor" strokeOpacity=".55" strokeWidth="1" />
                    </svg>
                     </div>
                </div>

                {/* Log */}
                <div style={{  textAlign: 'left', fontSize: 12.5, color: DIM, padding: '8px 14px', minHeight: 150 }}>
                    {LOG_LINES.map((line, i) => (
                        <div key={i} style={{
                            opacity: visibleRows.has(i) ? 1 : 0,
                            transform: visibleRows.has(i) ? 'none' : 'translateX(-6px)',
                            transition: 'opacity .25s, transform .25s',
                        }}>
                            <span style={{ color: ACCENT, marginRight: 6 }}>&gt;</span> {line}
                        </div>
                    ))}
                </div>

                {/* Progress bar */}
                <div style={{ display: 'grid', gap: 8, textAlign: 'left' }}>
                    <div style={{ ...fade, fontSize: 12, color: ACCENT, letterSpacing: '.25em', textShadow: '0 0 6px rgba(255,17,17,.5)' }}>
                        <span style={{ animation: 'boot-blink 1s infinite', display: 'inline-block' }}>▲</span>
                        {' ATTENTION — DO NOT DISCONNECT'}
                    </div>
                    <div style={{ height: 10, background: '#0d0d0d', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: 'repeating-linear-gradient(90deg, var(--accent) 0 8px, #000 8px 10px)',
                            boxShadow: '0 0 14px rgba(255,17,17,.55)',
                            transition: 'width .15s linear',
                        }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTE, letterSpacing: '.2em' }}>
                        <span>UPLOADING BLACKWALL-CLASS UI</span>
                        <span>{progress}%</span>
                    </div>
                </div>

                {/* Done */}
                {done && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 4, animation: 'boot-fadein .4s ease' }}>
                        <button className="boot-enter-btn" onClick={dismiss}>
                            &gt; ACCESS PERSONNEL FILE_
                        </button>
                        <div style={{ fontSize: 10.5, color: MUTE, letterSpacing: '.25em' }}>[ press ENTER or click to continue ]</div>
                    </div>
                )}

            </div>
        </div>
    )
}
