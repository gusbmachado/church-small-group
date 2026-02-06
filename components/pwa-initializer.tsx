"use client"

import { useEffect } from "react"
import { initPWA } from "@/lib/pwa-utils"

export function PWAInitializer() {
  useEffect(() => {
    const cleanup = initPWA()
    return cleanup
  }, [])

  return null
}
