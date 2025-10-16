/**
 * Compact card view for a poll, showing title, meta, and link to detail.
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Poll {
  id: string
  title: string
  description: string
  totalVotes: number
  createdAt: string
  author: string
}

interface PollCardProps {
  poll: Poll
}

export default function PollCard({ poll }: PollCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{poll.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {poll.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-500">
            <span>By {poll.author}</span>
            <span>{poll.totalVotes} votes</span>
          </div>
          <div className="text-xs text-gray-400">
            Created {new Date(poll.createdAt).toLocaleDateString()}
          </div>
          <Link href={`/polls/${poll.id}`}>
            <Button className="w-full" variant="outline">
              View Poll
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

