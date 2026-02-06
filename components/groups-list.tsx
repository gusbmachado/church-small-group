"use client"

import type { SmallGroup } from "@/lib/types"
import { Users, Clock, Calendar, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface GroupsListProps {
  groups: SmallGroup[]
  selectedGroup: SmallGroup | null
  onSelectGroup: (group: SmallGroup) => void
}

export function GroupsList({ groups, selectedGroup, onSelectGroup }: GroupsListProps) {
  const filteredGroups = groups.filter((g) => !g.is_church)

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-card-foreground">Groups</h3>
          <Badge variant="secondary">{filteredGroups.length}</Badge>
        </div>
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            onClick={() => onSelectGroup(group)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedGroup?.id === group.id
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-card-foreground text-sm">{group.name}</h4>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{group.members?.length || 0}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{group.address}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{group.day_of_week}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{group.time}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Badge variant="outline" className="text-xs">
                {group.category}
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {group.gender}
              </Badge>
            </div>
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">No groups match your filters</div>
        )}
      </div>
    </ScrollArea>
  )
}
