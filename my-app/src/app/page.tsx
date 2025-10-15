import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

// Mock featured polls data
const featuredPolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Help us understand the community's preferences",
    totalVotes: 234,
    author: "John Doe"
  },
  {
    id: "2", 
    title: "Best framework for web development in 2024?",
    description: "Share your thoughts on the latest frameworks",
    totalVotes: 156,
    author: "Jane Smith"
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Create & Share Polls
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Engage your community with interactive polls. Get instant feedback and insights from your audience.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link href="/polls/new">
              <Button size="lg" className="w-full sm:w-auto">
                Create Your First Poll
              </Button>
            </Link>
            <Link href="/polls">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Browse Polls
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose PollApp?
            </h2>
            <p className="text-lg text-gray-600">
              Simple, powerful, and designed for engagement
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <CardTitle>Real-time Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  See live updates as votes come in with beautiful charts and analytics.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <CardTitle>Easy to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create polls in seconds with our intuitive interface. No technical skills required.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <CardTitle>Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your polls are secure with options for anonymous voting and privacy controls.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Polls Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Polls</h2>
              <p className="text-gray-600 mt-2">Check out what the community is discussing</p>
            </div>
            <Link href="/polls">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {featuredPolls.map((poll) => (
              <Card key={poll.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{poll.title}</CardTitle>
                  <CardDescription>{poll.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      By {poll.author} • {poll.totalVotes} votes
                    </span>
                    <Link href={`/polls/${poll.id}`}>
                      <Button variant="outline" size="sm">
                        Vote Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who are already creating engaging polls
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              Sign Up Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
