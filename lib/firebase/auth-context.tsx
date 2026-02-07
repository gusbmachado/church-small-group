"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { User, onAuthStateChanged } from "firebase/auth"
import { getFirebaseAuth } from "./client"
import { getUserProfile, createUserProfile } from "./firestore"
import type { UserProfile, UserRole } from "@/lib/types"

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (firebaseUser: User) => {
    try {
      let userProfile = await getUserProfile(firebaseUser.uid)
      // Se não existe perfil, cria com role padrão "member"
      if (!userProfile) {
        userProfile = await createUserProfile(
          firebaseUser.uid,
          firebaseUser.email || "",
          firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Usuário",
          "member"
        )
      }
      setProfile(userProfile)
    } catch (error) {
      console.error("Error loading user profile:", error)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user)
    }
  }

  useEffect(() => {
    const auth = getFirebaseAuth()
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        firebaseUser.getIdToken().then((token) => {
          document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; SameSite=Lax`
        })
        await loadProfile(firebaseUser)
      } else {
        document.cookie = "firebase-auth-token=; path=/; max-age=0"
        setProfile(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}