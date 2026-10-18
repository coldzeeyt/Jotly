import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"Jotly — All your notes. One place.",appleWebApp:{capable:true,title:"Jotly",statusBarStyle:"default"},description:"A little space for your biggest ideas. Capture text, photos, videos, voice notes, and checklists with Jotly."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}

