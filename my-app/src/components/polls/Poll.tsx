'use client'

import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface PollWithOptions {
  id: string;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
  author_email: { email: string }[];
  options: {
    id: number;
    option_text: string;
    votes: number;
    percentage: number;
  }[];
  totalVotes: number;
  hasVoted: boolean;
}

export default function Poll({ poll: initialPoll }: { poll: PollWithOptions }) {
  const [poll, setPoll] = useState(initialPoll)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleVote = async () => {
    if (!selectedOption) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error('User not logged in')
      return
    }

    // Optimistic update
    const newOptions = poll.options.map(option => {
      if (option.id === Number(selectedOption)) {
        return { ...option, votes: option.votes + 1 }
      }
      return option
    })
    const newTotalVotes = poll.totalVotes + 1
    const newPoll = {
      ...poll,
      options: newOptions.map(option => ({
        ...option,
        percentage: newTotalVotes > 0 ? (option.votes / newTotalVotes) * 100 : 0
      })),
      totalVotes: newTotalVotes,
      hasVoted: true
    }
    setPoll(newPoll)

    const { error } = await supabase.from('poll_votes').insert({
      poll_id: poll.id,
      option_id: selectedOption,
      user_id: user.id,
    })

    if (error) {
      console.error('Error voting:', error)
      // Revert optimistic update
      setPoll(initialPoll)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{poll.title}</CardTitle>
        <CardDescription className="text-base">
          {poll.description}
        </CardDescription>
        <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
          <span>By {poll.author_email[0]?.email}</span>
          <span>Created {new Date(poll.created_at).toLocaleDateString()}</span>
        </div>
      </CardHeader>
      <CardContent>
        {poll.hasVoted ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Poll Results</h3>
              <span className="text-sm text-gray-500">
                {poll.totalVotes} total votes
              </span>
            </div>
            
            <div className="space-y-4">
              {poll.options.map((option) => (
                <div key={option.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{option.option_text}</span>
                    <span className="font-medium">
                      {option.votes} votes ({option.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${option.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1">
                Share Poll
              </Button>
              <Button variant="outline" className="flex-1">
                Create Similar Poll
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cast Your Vote</h3>
            <div className="space-y-3">
              {poll.options.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedOption === String(option.id) ? "default" : "outline"}
                  className="w-full justify-start h-auto p-4"
                  onClick={() => setSelectedOption(String(option.id))}
                >
                  <span className="text-left">{option.option_text}</span>
                </Button>
              ))}
            </div>
            <Button className="w-full mt-6" onClick={handleVote} disabled={!selectedOption}>
              Submit Vote
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}