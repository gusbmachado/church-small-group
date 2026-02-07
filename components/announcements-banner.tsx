"use client"

import { useState } from "react"
import { X, Megaphone, Calendar, AlertTriangle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Announcement } from "@/lib/types"

interface AnnouncementsBannerProps {
  announcements: Announcement[]
}

const priorityConfig = {
  urgent: { color: "destructive" as const, icon: AlertTriangle },
  high: { color: "destructive" as const, icon: AlertTriangle },
  medium: { color: "default" as const, icon: Info },
  low: { color: "secondary" as const, icon: Info },
}

const typeIcon = {
  event: Calendar,
  alert: AlertTriangle,
  news: Megaphone,
}

export function AnnouncementsBanner({ announcements }: AnnouncementsBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const visible = announcements.filter((a) => !dismissed.has(a.id))
  if (visible.length === 0) return null

  return (
    <div className="border-b border-border bg-card/50 px-4 py-2 space-y-1 max-h-32 overflow-y-auto">
      {visible.slice(0, 3).map((ann) => {
        const Icon = typeIcon[ann.type] || Megaphone
        const prio = priorityConfig[ann.priority] || priorityConfig.low

        return (
          <div key={ann.id} className="flex items-center gap-3 text-sm">
            <Icon className="w-4 h-4 text-primary shrink-0" />
            <Badge variant={prio.color} className="text-xs shrink-0">
              {ann.type === "event" ? "Evento" : ann.type === "alert" ? "Alerta" : "Notícia"}
            </Badge>
            <span className="font-medium truncate">{ann.title}</span>
            {ann.event_date && (
              <span className="text-xs text-muted-foreground shrink-0">
                {new Date(ann.event_date).toLocaleDateString("pt-BR")}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 ml-auto shrink-0"
              onClick={() => setDismissed((prev) => new Set(prev).add(ann.id))}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )
      })}
    </div>
  )
}
