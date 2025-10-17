'use client'

/** HOC that restricts access to admin users only. */
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function withAdmin<P extends object>(Component: React.ComponentType<P>) {
  return function WithAdmin(props: P) {
    const auth = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!auth?.session) {
        router.replace('/auth/login')
        return
      }
      if (!auth?.isAdmin) {
        router.replace('/')
      }
    }, [auth?.session, auth?.isAdmin, router])

    if (!auth?.session || !auth?.isAdmin) {
      return null
    }

    return <Component {...props} />
  }
}


