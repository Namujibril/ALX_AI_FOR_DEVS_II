'use client'

/**
 * Top navigation header shown across the app. Displays primary nav links
 * and authentication actions based on current user state.
 */

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function Header() {
  const pathname = usePathname()
  const auth = useAuth()
  const user = auth?.user
  const signOut = auth?.signOut

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/polls", label: "Polls" },
    { href: "/polls/new", label: "Create Poll" },
  ]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              PollApp
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/auth/profile">
                  <Button variant="ghost" size="sm">
                    Profile
                  </Button>
                </Link>
                <Button onClick={signOut} size="sm">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

