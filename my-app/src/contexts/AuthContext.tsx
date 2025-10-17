'use client'

/**
 * Provides authenticated user session and sign-out functionality via Supabase.
 * Wrap your app with `AuthProvider` and consume with `useAuth()`.
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { DEFAULT_ROLE, isAdminRole, type UserRole } from '@/lib/roles'

type AuthContextType = {
  session: Session | null
  user: User | null
  role: UserRole
  isAdmin: boolean
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole>(DEFAULT_ROLE)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        const currentUser = session?.user ?? null
        setUser(currentUser)
        const userRole = (currentUser?.user_metadata?.role as UserRole) || DEFAULT_ROLE
        setRole(userRole)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, user, role, isAdmin: isAdminRole(role), signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
