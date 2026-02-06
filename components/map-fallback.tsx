"use client"

import { useState, useCallback } from "react"
import type { SmallGroup } from "@/lib/types"
import { Church, Home, Clock, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MapFallbackProps {
  groups: SmallGroup[]
  onSelectGroup: (group: SmallGroup) => void
  selectedGroup: SmallGroup | null
}

export function MapFallback({ groups, onSelectGroup, selectedGroup }: MapFallbackProps) {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)

  const getPosition = useCallback((group: SmallGroup) => {
    const baseX = 50
    const baseY = 50
    const offsetX = (group.longitude + 74.012) * 800
    const offsetY = (40.72 - group.latitude) * 800
    return {
      left: `${Math.max(5, Math.min(85, baseX + offsetX))}%`,
      top: `${Math.max(5, Math.min(85, baseY + offsetY))}%`,
    }
  }, [])

  return (
    <div className="relative w-full h-full bg-secondary/30 rounded-lg overflow-hidden">
      {/* Map Background with grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Decorative streets */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-foreground" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-foreground" />
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-foreground" />
        <div className="absolute top-1/4 left-0 right-0 h-px bg-foreground" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-foreground" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-foreground" />
      </div>

      {/* No API Key Notice */}
      <div className="absolute top-4 left-4 px-3 py-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg">
        <p className="text-xs text-muted-foreground">
          Add <code className="bg-secondary px-1 rounded">NEXT_PUBLIC_FIREBASE_APP_ID</code> for Google Maps
        </p>
      </div>

      {/* Map Pins */}
      {groups.map((group) => {
        const position = getPosition(group)
        const isSelected = selectedGroup?.id === group.id
        const isHovered = hoveredGroup === group.id
        const isChurch = group.is_church

        return (
          <div
            key={group.id}
            className="absolute z-10 transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-200"
            style={position}
            onMouseEnter={() => setHoveredGroup(group.id)}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => !isChurch && onSelectGroup(group)}
          >
            <div
              className={`
                relative flex items-center justify-center rounded-full transition-all duration-200
                ${
                  isChurch
                    ? "w-12 h-12 bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : isSelected
                      ? "w-10 h-10 bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "w-8 h-8 bg-card border-2 border-primary text-primary hover:scale-110"
                }
                ${isHovered && !isSelected ? "scale-110" : ""}
              `}
            >
              {isChurch ? <Church className="w-6 h-6" /> : <Home className={`${isSelected ? "w-5 h-5" : "w-4 h-4"}`} />}

              {!isChurch && group.members && group.members.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {group.members.length}
                </span>
              )}
            </div>

            {(isHovered || isSelected) && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-3 bg-card border border-border rounded-lg shadow-xl z-20">
                <p className="font-semibold text-sm text-card-foreground truncate">{group.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{group.address}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{group.day_of_week}</span>
                  <Clock className="w-3 h-3 ml-1" />
                  <span>{group.time}</span>
                </div>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {group.category}
                </Badge>
              </div>
            )}
          </div>
        )
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 p-3 bg-card/90 backdrop-blur-sm border border-border rounded-lg">
        <p className="text-xs font-semibold text-card-foreground mb-2">Legend</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
            <Church className="w-2.5 h-2.5 text-primary-foreground" />
          </div>
          <span>Church</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-4 h-4 bg-card border border-primary rounded-full flex items-center justify-center">
            <Home className="w-2.5 h-2.5 text-primary" />
          </div>
          <span>Small Group</span>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 flex gap-3">
        <div className="px-3 py-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg">
          <p className="text-2xl font-bold text-primary">{groups.filter((g) => !g.is_church).length}</p>
          <p className="text-xs text-muted-foreground">Groups</p>
        </div>
        <div className="px-3 py-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg">
          <p className="text-2xl font-bold text-primary">
            {groups.reduce((acc, g) => acc + (g.members?.length || 0), 0)}
          </p>
          <p className="text-xs text-muted-foreground">Members</p>
        </div>
      </div>
    </div>
  )
}
