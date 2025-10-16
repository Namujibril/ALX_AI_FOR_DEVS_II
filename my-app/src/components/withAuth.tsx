'use client'

/** HOC that redirects unauthenticated users to the login page. */

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const auth = useAuth()
    const session = auth?.session
    const router = useRouter()

    useEffect(() => {
      if (!session) {
        router.replace('/auth/login')
      }
    }, [session, router])

    if (!session) {
      return null // or a loading spinner
    }

    return <Component {...props} />
  }
}
