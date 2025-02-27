"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { setFirebaseToken } from "@/lib/api"

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await setFirebaseToken(() => firebaseUser.getIdToken())
        setUser(firebaseUser)
        localStorage.setItem("user", JSON.stringify(firebaseUser))

        console.log(firebaseUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const refreshToken = setInterval(
      async () => {
        const currentUser = auth.currentUser
        if (currentUser) {
          await setFirebaseToken(() => currentUser.getIdToken(true))
        }
      },
      55 * 60 * 1000,
    ) // Refresh token every 55 minutes

    return () => clearInterval(refreshToken)
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

