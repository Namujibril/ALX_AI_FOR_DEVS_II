'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import withAuth from "@/components/withAuth"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Poll {
  id: string
  title: string
  creator_id: string
}

function DashboardPage() {
  const auth = useAuth()
  const [polls, setPolls] = useState<Poll[]>([])

  useEffect(() => {
    if (auth?.user) {
      const fetchPolls = async () => {
        if (!auth.user) return
        const { data, error } = await supabase
          .from('polls')
          .select('*')
          .eq('creator_id', auth.user.id)
        
        if (error) {
          console.error('Error fetching polls:', error)
        } else {
          setPolls(data)
        }
      }

      fetchPolls()
    }
  }, [auth])

  if (!auth) {
    return <div>Loading...</div>
  }

  const { user } = auth

  const handleDelete = async (pollId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this poll?')
    if (!confirmed) {
      return
    }

    // first delete poll options
    const { error: optionsError } = await supabase
      .from('poll_options')
      .delete()
      .eq('poll_id', pollId)

    if (optionsError) {
      console.error('Error deleting poll options:', optionsError)
      return
    }

    // then delete the poll
    const { error: pollError } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId)

    if (pollError) {
      console.error('Error deleting poll:', pollError)
    } else {
      setPolls(polls.filter((poll) => poll.id !== pollId))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.user_metadata.full_name}!</CardTitle>
            <CardDescription>What would you like to do today?</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/polls/new">
              <Button>Create a New Poll</Button>
            </Link>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">My Polls</h2>
          {polls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {polls.map((poll) => (
                <Card key={poll.id}>
                  <CardHeader>
                    <CardTitle>{poll.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end space-x-2">
                      <Link href={`/polls/${poll.id}/edit`}>
                        <Button variant="outline">Edit</Button>
                      </Link>
                      <Button variant="destructive" onClick={() => handleDelete(poll.id)}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>You haven&apos;t created any polls yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default withAuth(DashboardPage)
