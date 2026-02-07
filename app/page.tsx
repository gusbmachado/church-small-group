"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/firebase/auth-context"
import { HomeClient } from "@/components/home-client"
import { getAllGroups, getActiveAnnouncements } from "@/lib/firebase/firestore"
import type { SmallGroup, Announcement } from "@/lib/types"
import { Spinner } from "@/components/ui/spinner"

export default function HomePage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [groups, setGroups] = useState<SmallGroup[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [g, a] = await Promise.all([getAllGroups(), getActiveAnnouncements()])
        setGroups(g)
        setAnnouncements(a)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading || authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Spinner className="mx-auto" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

  return (
    <HomeClient
      initialGroups={groups}
      user={user}
      profile={profile}
      announcements={announcements}
      googleMapsApiKey={googleMapsApiKey}
    />
  )
}