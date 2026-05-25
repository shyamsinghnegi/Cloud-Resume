import {Rajdhani, Share_Tech_Mono } from "next/font/google"
import "./globals.css"
import Hud from './components/Hud'
import BootScreen from './components/ClientBootScreen'

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets : ['latin'],
  weight: ['500','600','700'],
})

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets : ['latin'],
  weight: ['400'],
})

export const metadata = {
  title: "SHYAM SINGH NEGI // BLACKWALL//NET",
  description: "Cloud Engineer / Devops / Fullstack - Personnel file.",
};

export default function RootLayout({ children }) {
  return (
    <html
    lang="en"
    className={`${rajdhani.variable} ${shareTechMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"> 
        <div className="scanlines" aria-hidden="true"/>
        <div className="vignette" aria-hidden="true"/>
        <BootScreen/>
        <Hud/>
        {children}
        </body>
    </html>
  );
}
