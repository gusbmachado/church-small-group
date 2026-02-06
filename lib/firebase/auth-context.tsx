"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { User, onAuthStateChanged } from "firebase/auth"
import { getFirebaseAuth } from "./client"

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getFirebaseAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)

      // Store auth token in cookie for server-side access
      if (user) {
        user.getIdToken().then((token) => {
          document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; SameSite=Lax`
        })
      } else {
        document.cookie = "firebase-auth-token=; path=/; max-age=0"
      }
    })

    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
