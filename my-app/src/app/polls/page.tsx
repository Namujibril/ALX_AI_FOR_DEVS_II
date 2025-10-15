import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function PollsPage() {
  const { data: polls, error } = await supabase
    .from('polls')
    .select(`
      id,
      title,
      description,
      created_at,
      creator_id
    `)

  if (error) {
    console.error('Error fetching polls:', error)
    return <div>Error loading polls.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Polls</h1>
            <p className="text-gray-600 mt-2">
              Discover and participate in community polls
            </p>
          </div>
          <Link href="/polls/new">
            <Button>Create New Poll</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <Card key={poll.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{poll.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {poll.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-xs text-gray-400">
                    Created {new Date(poll.created_at).toLocaleDateString()}
                  </div>
                  <Link href={`/polls/${poll.id}`}>
                    <Button className="w-full" variant="outline">
                      View Poll
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {polls.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No polls found
            </h3>
            <p className="text-gray-600 mb-4">
              Be the first to create a poll and start the conversation!
            </p>
            <Link href="/polls/new">
              <Button>Create Your First Poll</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

