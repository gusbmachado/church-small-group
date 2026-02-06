import { getCurrentUser } from "@/lib/firebase/server"
import { HomeClient } from "@/components/home-client"
import { mockGroups } from "@/lib/data"

export default async function HomePage() {
  // Get current user from Firebase
  const user = await getCurrentUser()

  // Use mock data for groups
  const groups = mockGroups

  const googleMapsApiKey = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""

  return <HomeClient initialGroups={groups || []} user={user} googleMapsApiKey={googleMapsApiKey} />
}
