"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
export default function Hud() {

    const [time, setTime] = useState("--:--:--")
    useEffect(() => {
        const tick = () => {
            const d = new Date()
            const pad = n => String(n).padStart(2, '0')
            setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`)
        }
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, []
    )

    const pathname = usePathname()
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-6 px-7 py-2.5 bg-[#050505]/90 backdrop-blur-sm border-b border-white/10 font-mono text-[11.5px] tracking-[.2em]">

            <Link href="/" className="font-display font-bold text-base tracking-[0.20em] text-white hover:text-[#FF1111] transition-colors">BLACKWALL<span className="text-[#FF1111]">{'//'}NET</span></Link>

            <div className="flex items-center gap-6">
                <nav className="flex gap-1">

                    <Link
                        href="/"
                        className={`px-3 py-2.5 transition-colors ${pathname === "/" ? "text-accent border-b border-accent" : "text-white/70 hover:text-white"
                            }`}
                    >PROFILE</Link>

                    <Link href="/skills"
                        className={`px-3 py-2.5 transition-colors ${pathname === "/skills" ? "text-accent border-b border-accent" : "text-white/70 hover:text-white"
                            }`}>SKILLS</Link>

                    <Link href="/log"
                        className={`px-3 py-2.5 transition-colors ${pathname === "/log" ? "text-accent border-b border-accent" : "text-white/70 hover:text-white"
                            }`}>LOG</Link>

                    <Link href="/braindances"
                        className={`px-3 py-2.5 transition-colors ${pathname === "/braindances" ? "text-accent border-b border-accent" : "text-white/70 hover:text-white"
                            }`}>BRAINDANCES</Link>

                    <Link href="/channel"
                        className={`px-3 py-2.5 transition-colors ${pathname === "/channel" ? "text-accent border-b border-accent" : "text-white/70 hover:text-white"
                            }`}>CHANNEL</Link>
                </nav>

                <div className="flex items-center gap-4 text-white/50">
                    <span>LVL <b className="text-white">01</b></span>
                    <span>STREET CRED <b className="text-white">000</b></span>
                    <span className="text-[#FF1111]">{time}</span>

                </div>
            </div>

        </header>
    )
}
