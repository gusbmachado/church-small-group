import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { PWAInitializer } from "@/components/pwa-initializer"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// PWA and SEO metadata
export const metadata: Metadata = {
  title: "Small Groups Manager | Church Community Software",
  description: "Church small groups management software with interactive maps, attendance tracking, carpool coordination, and comprehensive group management features.",
  generator: "Next.js",
  applicationName: "Small Groups Manager",
  keywords: [
    "church",
    "small groups",
    "community",
    "management",
    "attendance",
    "carpool",
    "bible study",
    "prayer groups",
  ],
  authors: [{ name: "Church Small Groups Team" }],
  creator: "Church Small Groups Team",
  publisher: "Church Small Groups Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Small Groups",
  },
  openGraph: {
    type: "website",
    siteName: "Small Groups Manager",
    title: "Small Groups Manager | Church Community Software",
    description: "Comprehensive church small groups management with maps and tracking",
  },
  twitter: {
    card: "summary",
    title: "Small Groups Manager",
    description: "Church small groups management software",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`font-sans antialiased`}>
        <PWAInitializer />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
