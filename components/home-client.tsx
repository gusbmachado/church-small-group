"use client"

import { useState, useMemo } from "react"
import type { SmallGroup } from "@/lib/types"
import type { User } from "firebase/auth"
import { Header } from "@/components/header"
import { FilterBar } from "@/components/filter-bar"
import { GoogleMap } from "@/components/google-map"
import { MapFallback } from "@/components/map-fallback"
import { GroupsList } from "@/components/groups-list"
import { GroupDetailsPanel } from "@/components/group-details-panel"
import { ManagementDashboard } from "@/components/management-dashboard"
import { MobileNav } from "@/components/mobile-nav"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface HomeClientProps {
  initialGroups: SmallGroup[]
  user: User | null
  googleMapsApiKey: string
}

export function HomeClient({ initialGroups, user, googleMapsApiKey }: HomeClientProps) {
  const [groups, setGroups] = useState<SmallGroup[]>(initialGroups)
  const [selectedGroup, setSelectedGroup] = useState<SmallGroup | null>(null)
  const [managingGroup, setManagingGroup] = useState<SmallGroup | null>(null)
  const [mobileView, setMobileView] = useState<"map" | "list">("map")

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedGender, setSelectedGender] = useState("all")
  const [selectedAgeRange, setSelectedAgeRange] = useState("All Ages")

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

      if (selectedCategory !== "All Categories" && group.category !== selectedCategory && !group.is_church) {
        return false
      }

      if (selectedGender !== "all" && group.gender !== selectedGender && !group.is_church) {
        return false
      }

      if (selectedAgeRange !== "All Ages" && group.age_range !== selectedAgeRange && !group.is_church) {
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

  // Management view
  if (managingGroup) {
    return (
      <ManagementDashboard
        group={managingGroup}
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
      <Header user={user} />

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
        {/* Left Sidebar - Groups List (Desktop) */}
        <div className="w-80 border-r border-border bg-card hidden lg:block">
          <GroupsList groups={filteredGroups} selectedGroup={selectedGroup} onSelectGroup={handleSelectGroup} />
        </div>

        {/* Mobile List View */}
        <div className={`${mobileView === "list" ? "block" : "hidden"} lg:hidden w-full overflow-y-auto`}>
          <GroupsList groups={filteredGroups} selectedGroup={selectedGroup} onSelectGroup={handleSelectGroup} />
        </div>

        {/* Main Content - Map */}
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

        {/* Right Sidebar - Details Panel (Desktop) */}
        {selectedGroup && (
          <div className="w-96 hidden md:block">
            <GroupDetailsPanel
              group={selectedGroup}
              onClose={() => setSelectedGroup(null)}
              onManage={() => setManagingGroup(selectedGroup)}
              canManage={!!user}
            />
          </div>
        )}

        {/* Mobile Details Sheet */}
        {selectedGroup && (
          <Sheet open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
            <SheetContent side="bottom" className="h-[85vh] md:hidden">
              <GroupDetailsPanel
                group={selectedGroup}
                onClose={() => setSelectedGroup(null)}
                onManage={() => setManagingGroup(selectedGroup)}
                canManage={!!user}
              />
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav activeView={mobileView} onViewChange={setMobileView} hasUser={!!user} />
    </div>
  )
}
