"use client"
import { onAuthStateChanged, User } from "firebase/auth"
import { useEffect, useState } from "react"

import { auth } from "@/services/firebase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  return { user }
}
