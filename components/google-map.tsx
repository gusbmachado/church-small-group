"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { SmallGroup } from "@/lib/types"
import { setOptions, importLibrary } from "@googlemaps/js-api-loader"

interface GoogleMapProps {
  groups: SmallGroup[]
  selectedGroup: SmallGroup | null
  onSelectGroup: (group: SmallGroup) => void
  apiKey: string
}

export function GoogleMap({ groups, selectedGroup, onSelectGroup, apiKey }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize Google Maps
  useEffect(() => {
    if (!apiKey || isLoaded || error) return

    const initMap = async () => {
      try {
        // Configure the loader
        setOptions({
          apiKey,
          version: "weekly",
        })

        // Import required libraries
        await Promise.all([importLibrary("maps"), importLibrary("marker")])

        setIsLoaded(true)
      } catch (err) {
        console.error("Error loading Google Maps:", err)
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load Google Maps. Please check your API configuration."
        setError(errorMessage)
      }
    }

    initMap()
  }, [apiKey, isLoaded, error])

  // Create map instance
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return

    // Find center from groups or default to NYC
    const church = groups.find((g) => g.is_church)
    const center = church ? { lat: church.latitude, lng: church.longitude } : { lat: 40.7128, lng: -74.006 }

    const mapInstance = new google.maps.Map(mapRef.current, {
      center,
      zoom: 14,
      mapId: "church_groups_map",
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    })

    setMap(mapInstance)
  }, [isLoaded, groups, map])

  // Create markers
  const createMarker = useCallback(
    (group: SmallGroup, mapInstance: google.maps.Map) => {
      const isChurch = group.is_church
      const isSelected = selectedGroup?.id === group.id

      // Create custom marker element
      const markerElement = document.createElement("div")
      markerElement.className = "marker-container"
      markerElement.innerHTML = `
        <div class="relative cursor-pointer transition-transform hover:scale-110 ${isSelected ? "scale-110" : ""}">
          <div class="${
            isChurch
              ? "w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg"
              : isSelected
                ? "w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg"
                : "w-8 h-8 bg-white border-2 border-amber-500 rounded-full flex items-center justify-center shadow-md"
          }">
            ${
              isChurch
                ? '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18 12.22V21h-3v-5h-2v5H7v-8.78L12 8l6 4.22z"/><path d="M12 2L4 8v14h16V8l-8-6z"/></svg>'
                : `<svg class="w-4 h-4 ${isSelected ? "text-white" : "text-amber-500"}" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`
            }
          </div>
          ${
            !isChurch && group.members && group.members.length > 0
              ? `<span class="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">${group.members.length}</span>`
              : ""
          }
        </div>
      `

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapInstance,
        position: { lat: group.latitude, lng: group.longitude },
        content: markerElement,
        title: group.name,
      })

      // Add click listener
      marker.addListener("click", () => {
        if (!group.is_church) {
          onSelectGroup(group)
        }
      })

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-3 min-w-[200px]">
            <h3 class="font-semibold text-gray-900">${group.name}</h3>
            <p class="text-sm text-gray-600 mt-1">${group.address}</p>
            <div class="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span>${group.day_of_week}</span>
              <span>•</span>
              <span>${group.time}</span>
            </div>
            <span class="inline-block mt-2 px-2 py-1 bg-gray-100 rounded text-xs">${group.category}</span>
          </div>
        `,
      })

      markerElement.addEventListener("mouseenter", () => {
        infoWindow.open(mapInstance, marker)
      })

      markerElement.addEventListener("mouseleave", () => {
        infoWindow.close()
      })

      return marker
    },
    [selectedGroup, onSelectGroup],
  )

  // Update markers when groups or selection changes
  useEffect(() => {
    if (!map || !isLoaded) return

    // Clear existing markers
    markers.forEach((marker) => {
      marker.map = null
    })

    // Create new markers
    const newMarkers = groups.map((group) => createMarker(group, map))
    setMarkers(newMarkers)

    // Pan to selected group
    if (selectedGroup) {
      map.panTo({ lat: selectedGroup.latitude, lng: selectedGroup.longitude })
    }

    // Cleanup function
    return () => {
      newMarkers.forEach((marker) => {
        marker.map = null
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, groups, selectedGroup, isLoaded, createMarker])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-secondary/30 rounded-lg">
        <div className="text-center p-6 max-w-md">
          <p className="text-destructive font-semibold mb-2">Google Maps Error</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <div className="text-xs text-left text-muted-foreground bg-card p-3 rounded border">
            <p className="font-medium mb-2">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to Google Cloud Console</li>
              <li>Enable "Maps JavaScript API"</li>
              <li>Add your API key to .env.local</li>
              <li>Restart the dev server</li>
            </ol>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Or remove NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to use fallback map
          </p>
        </div>
      </div>
    )
  }

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-secondary/30 rounded-lg">
        <div className="text-center p-4">
          <p className="text-muted-foreground font-medium">Google Maps API Key Not Configured</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local to enable the map
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Loading map...</span>
          </div>
        </div>
      )}

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

      {/* Legend */}
      <div className="absolute bottom-4 left-4 p-3 bg-card/90 backdrop-blur-sm border border-border rounded-lg">
        <p className="text-xs font-semibold text-card-foreground mb-2">Legend</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <div className="w-4 h-4 bg-primary rounded-full" />
          <span>Church</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-4 h-4 bg-card border-2 border-primary rounded-full" />
          <span>Small Group</span>
        </div>
      </div>
    </div>
  )
}
