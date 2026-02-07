"use client"

import type React from "react"
import { useAuth } from "@/lib/firebase/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Shield } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!profile || profile.role !== "admin")) {
      router.push("/")
    }
  }, [profile, loading, router])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Verificando permissões...</p>
      </div>
    )
  }

  if (!profile || profile.role !== "admin") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Shield className="w-12 h-12 text-destructive" />
        <h1 className="text-xl font-semibold">Acesso Negado</h1>
        <p className="text-muted-foreground">Apenas administradores podem acessar esta área.</p>
      </div>
    )
  }

  return <>{children}</>
}