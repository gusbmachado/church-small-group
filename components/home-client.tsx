"use client"

import { useState, useMemo } from "react"
import type { SmallGroup, Announcement, UserProfile } from "@/lib/types"
import type { User } from "firebase/auth"
import { Header } from "@/components/header"
import { FilterBar } from "@/components/filter-bar"
import { GoogleMap } from "@/components/google-map"
import { MapFallback } from "@/components/map-fallback"
import { GroupsList } from "@/components/groups-list"
import { GroupDetailsPanel } from "@/components/group-details-panel"
import { ManagementDashboard } from "@/components/management-dashboard"
import { MobileNav } from "@/components/mobile-nav"
import { AnnouncementsBanner } from "@/components/announcements-banner"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface HomeClientProps {
  initialGroups: SmallGroup[]
  user: User | null
  profile: UserProfile | null
  announcements: Announcement[]
  googleMapsApiKey: string
}

export function HomeClient({ initialGroups, user, profile, announcements, googleMapsApiKey }: HomeClientProps) {
  const [groups, setGroups] = useState<SmallGroup[]>(initialGroups)
  const [selectedGroup, setSelectedGroup] = useState<SmallGroup | null>(null)
  const [managingGroup, setManagingGroup] = useState<SmallGroup | null>(null)
  const [mobileView, setMobileView] = useState<"map" | "list">("map")

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas Categorias")
  const [selectedGender, setSelectedGender] = useState("all")
  const [selectedAgeRange, setSelectedAgeRange] = useState("Todas Idades")

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      if (
        searchQuery &&
        !group.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !group.address.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !group.leader.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }
      if (selectedCategory !== "Todas Categorias" && group.category !== selectedCategory && !group.is_church) {
        return false
      }
      if (selectedGender !== "all" && group.gender !== selectedGender && !group.is_church) {
        return false
      }
      if (selectedAgeRange !== "Todas Idades" && group.age_range !== selectedAgeRange && !group.is_church) {
        return false
      }
      return true
    })
  }, [groups, searchQuery, selectedCategory, selectedGender, selectedAgeRange])

  const handleSelectGroup = (group: SmallGroup) => {
    if (group.is_church) return
    setSelectedGroup(group)
  }

  const handleUpdateGroup = (updatedGroup: SmallGroup) => {
    setGroups(groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)))
    setManagingGroup(updatedGroup)
    setSelectedGroup(updatedGroup)
  }

  // Verificar permissão de gerenciamento
  const canManageGroup = (group: SmallGroup) => {
    if (!profile) return false
    if (profile.role === "admin") return true
    if (profile.role === "leader" && profile.group_id === group.id) return true
    return false
  }

  if (managingGroup) {
    return (
      <ManagementDashboard
        group={managingGroup}
        profile={profile}
        onBack={() => {
          setManagingGroup(null)
          setSelectedGroup(managingGroup)
        }}
        onUpdateGroup={handleUpdateGroup}
      />
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <Header user={user} profile={profile} />

      {/* Avisos */}
      {announcements.length > 0 && <AnnouncementsBanner announcements={announcements} />}

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedGender={selectedGender}
        onGenderChange={setSelectedGender}
        selectedAgeRange={selectedAgeRange}
        onAgeRangeChange={setSelectedAgeRange}
      />

      <div className="flex-1 flex overflow-hidden pb-16 lg:pb-0">
        <div className="w-80 border-r border-border bg-card hidden lg:block">
          <GroupsList groups={filteredGroups} selectedGroup={selectedGroup} onSelectGroup={handleSelectGroup} />
        </div>

        <div className={`${mobileView === "list" ? "block" : "hidden"} lg:hidden w-full overflow-y-auto`}>
          <GroupsList groups={filteredGroups} selectedGroup={selectedGroup} onSelectGroup={handleSelectGroup} />
        </div>

        <div className={`${mobileView === "map" ? "flex-1" : "hidden"} lg:flex-1 relative p-2 md:p-4`}>
          {googleMapsApiKey ? (
            <GoogleMap
              groups={filteredGroups}
              onSelectGroup={handleSelectGroup}
              selectedGroup={selectedGroup}
              apiKey={googleMapsApiKey}
            />
          ) : (
            <MapFallback groups={filteredGroups} onSelectGroup={handleSelectGroup} selectedGroup={selectedGroup} />
          )}
        </div>

        {selectedGroup && (
          <div className="w-96 hidden md:block">
            <GroupDetailsPanel
              group={selectedGroup}
              onClose={() => setSelectedGroup(null)}
              onManage={() => setManagingGroup(selectedGroup)}
              canManage={canManageGroup(selectedGroup)}
            />
          </div>
        )}

        {selectedGroup && (
          <Sheet open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
            <SheetContent side="bottom" className="h-[85vh] md:hidden">
              <GroupDetailsPanel
                group={selectedGroup}
                onClose={() => setSelectedGroup(null)}
                onManage={() => setManagingGroup(selectedGroup)}
                canManage={canManageGroup(selectedGroup)}
              />
            </SheetContent>
          </Sheet>
        )}
      </div>

      <MobileNav activeView={mobileView} onViewChange={setMobileView} profile={profile} />
    </div>
  )
}