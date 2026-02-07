"use client"

import { Church, LogIn, LogOut, User, Shield, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getFirebaseAuth } from "@/lib/firebase/client"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { User as FirebaseUser } from "firebase/auth"
import type { UserProfile } from "@/lib/types"

interface HeaderProps {
  user: FirebaseUser | null
  profile?: UserProfile | null
}

const roleLabels = { admin: "Admin", leader: "Líder", member: "Membro" }

export function Header({ user, profile }: HeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const auth = getFirebaseAuth()
    await signOut(auth)
    router.push("/")
    router.refresh()
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Church className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-card-foreground">Pequenos Grupos</h1>
          <p className="text-xs text-muted-foreground">Plataforma da Igreja</p>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        {user && profile ? (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{profile.name || user.email}</span>
              <Badge variant="outline" className="text-xs">
                {roleLabels[profile.role]}
              </Badge>
            </div>
            {profile.role === "admin" && (
              <Button asChild variant="outline" size="sm" className="gap-2 bg-transparent">
                <Link href="/admin">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </>
        ) : (
          <Button asChild variant="default" size="sm" className="gap-2">
            <Link href="/auth/login">
              <LogIn className="w-4 h-4" />
              <span>Entrar</span>
            </Link>
          </Button>
        )}
      </div>
    </header>
  )
}