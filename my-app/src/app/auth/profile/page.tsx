'use client'

/** Profile page showing basic account fields and sign-out action. */

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import withAuth from "@/components/withAuth"
import { useAuth } from "@/contexts/AuthContext"

function ProfilePage() {
  const auth = useAuth()

  if (!auth) {
    return <div>Loading...</div>
  }

  const { user, signOut } = auth

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Manage your account information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  defaultValue={user?.user_metadata.full_name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  defaultValue={user?.email}
                  disabled
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={signOut}>Sign Out</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default withAuth(ProfilePage)

