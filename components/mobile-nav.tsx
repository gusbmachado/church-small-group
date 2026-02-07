"use client"

import { List, Map as MapIcon, User, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { UserProfile } from "@/lib/types"

interface MobileNavProps {
  activeView: "map" | "list"
  onViewChange: (view: "map" | "list") => void
  profile: UserProfile | null
}

export function MobileNav({ activeView, onViewChange, profile }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t border-border shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around px-4 py-2">
        <Button
          variant={activeView === "map" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("map")}
          className="flex-1 mx-1 gap-2"
        >
          <MapIcon className="h-4 w-4" />
          <span className="text-xs">Mapa</span>
        </Button>

        <Button
          variant={activeView === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("list")}
          className="flex-1 mx-1 gap-2"
        >
          <List className="h-4 w-4" />
          <span className="text-xs">Lista</span>
        </Button>

        {profile && (
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 mx-1 gap-2"
            asChild
          >
            <a href="#management">
              <User className="h-4 w-4" />
              <span className="text-xs">Gerenciar</span>
            </a>
          </Button>
        )}

        {profile?.role === "admin" && (
          <Button variant="ghost" size="sm" className="flex-1 mx-1 gap-2" asChild>
            <Link href="/admin">
              <Shield className="h-4 w-4" />
              <span className="text-xs">Admin</span>
            </Link>
          </Button>
        )}
      </div>
    </nav>
  )
}
