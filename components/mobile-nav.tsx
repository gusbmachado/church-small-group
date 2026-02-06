"use client"

import { List, Map as MapIcon, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileNavProps {
  activeView: "map" | "list"
  onViewChange: (view: "map" | "list") => void
  hasUser: boolean
}

export function MobileNav({ activeView, onViewChange, hasUser }: MobileNavProps) {
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

        {hasUser && (
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
      </div>
    </nav>
  )
}
