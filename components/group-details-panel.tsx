"use client"

import type { SmallGroup } from "@/lib/types"
import { X, Phone, Mail, Clock, Calendar, MapPin, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface GroupDetailsPanelProps {
  group: SmallGroup
  onClose: () => void
  onManage: () => void
  canManage: boolean
}

export function GroupDetailsPanel({ group, onClose, onManage, canManage }: GroupDetailsPanelProps) {
  const attendanceRate =
    group.attendance && group.attendance.length > 0 && group.members && group.members.length > 0
      ? Math.round(
          (group.attendance.reduce((acc, a) => acc + (a.records?.length || 0), 0) /
            (group.attendance.length * group.members.length)) *
            100,
        )
      : 0

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-card-foreground truncate">{group.name}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="secondary">{group.category}</Badge>
              <Badge variant="outline" className="capitalize">
                {group.gender}
              </Badge>
              <Badge variant="outline">{group.age_range}</Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
              <p className="text-sm text-muted-foreground">{group.address}</p>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">{group.day_of_week}</p>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">{group.time}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Leader</h3>
            <div className="p-3 bg-secondary/50 rounded-lg space-y-2">
              <p className="font-medium text-card-foreground">{group.leader}</p>
              {group.leader_phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span>{group.leader_phone}</span>
                </div>
              )}
              {group.leader_email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{group.leader_email}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-secondary/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">{group.members?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Members</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">{attendanceRate}%</p>
                <p className="text-xs text-muted-foreground">Avg Attendance</p>
              </div>
            </div>
          </div>

          <Separator />

          {group.current_lesson && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-card-foreground mb-3">Current Lesson</h3>
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-card-foreground">{group.current_lesson}</p>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {group.roles && group.roles.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-card-foreground mb-3">Team Roles</h3>
                <div className="space-y-2">
                  {group.roles.map((role) => (
                    <div key={role.id} className="flex justify-between items-center p-2 bg-secondary/30 rounded">
                      <span className="text-sm text-muted-foreground">{role.role_name}</span>
                      <span className="text-sm font-medium text-card-foreground">{role.member_name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-card-foreground">Members</h3>
              <span className="text-xs text-muted-foreground">{group.members?.length || 0} total</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.members?.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary"
                  title={member.name}
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              ))}
              {group.members && group.members.length > 5 && (
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-xs text-muted-foreground">
                  +{group.members.length - 5}
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        {canManage ? (
          <Button className="w-full" onClick={onManage}>
            Manage Group
          </Button>
        ) : (
          <Button className="w-full bg-transparent" variant="outline" asChild>
            <a href="/auth/login">Login to Manage</a>
          </Button>
        )}
      </div>
    </div>
  )
}
