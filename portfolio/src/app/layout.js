import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
})

export const metadata = {
  title: "SHYAM SINGH NEGI",
  description: "Cloud Engineer / DevOps / Backend",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  )
}