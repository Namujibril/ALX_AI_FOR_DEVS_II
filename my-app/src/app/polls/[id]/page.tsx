import { supabase } from "@/lib/supabase"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Poll from "@/components/polls/Poll"

interface PollPageProps {
  params: {
    id: string
  }
}

async function PollPage({ params }: PollPageProps) {
  const { data: { user } } = await supabase.auth.getUser()

  const { data: poll, error } = await supabase
    .from('polls')
    .select(`
      id,
      title,
      description,
      created_at,
      user_id,
      author_email:users(email),
      options:poll_options(id, option_text)
    `)
    .eq('id', params.id)
    .single()

  if (error) {
    console.error('Error fetching poll:', error)
    return <div>Error loading poll.</div>
  }

  const { data: userVote } = await supabase
    .from('poll_votes')
    .select('option_id')
    .eq('poll_id', poll.id)
    .eq('user_id', user?.id)
    .single()

  const { data: votes } = await supabase.rpc('get_poll_vote_counts', {
    poll_id_param: poll.id,
  })

  const totalVotes = votes?.reduce((acc: number, vote: { vote_count: number }) => acc + vote.vote_count, 0) || 0

  const pollWithOptions = {
    ...poll,
    options: poll.options.map(option => {
      const vote = votes?.find((v: { option_id: number; }) => v.option_id === option.id)
      const voteCount = vote?.vote_count || 0
      return {
        ...option,
        votes: voteCount,
        percentage: totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0
      }
    }),
    totalVotes,
    hasVoted: !!userVote
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Poll poll={pollWithOptions} />

        {/* Related Polls Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Related Polls</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base">Best framework for 2024?</CardTitle>
                <CardDescription className="text-sm">
                  156 votes • 2 days ago
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base">Remote vs Office work?</CardTitle>
                <CardDescription className="text-sm">
                  89 votes • 3 days ago
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PollPage
