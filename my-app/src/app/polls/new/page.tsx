'use client'

/** Create Poll page: builds a new poll with at least two options. */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import withAuth from "@/components/withAuth"
import { supabase } from '@/lib/supabase'

function NewPollPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState(['', ''])

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addOption = () => {
    setOptions([...options, ''])
  }

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('User not logged in')
      return
    }

    // Insert the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title,
        description,
        creator_id: user.id,
      })
      .select('id')
      .single()

    if (pollError) {
      console.error('Error creating poll:', JSON.stringify(pollError, null, 2))
      return
    }

    // Insert the poll options
    const pollOptions = options.map(option => ({
      poll_id: poll.id,
      option_text: option,
    }))

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(pollOptions)

    if (optionsError) {
      console.error('Error creating poll options:', optionsError)
      return
    }

    alert('Poll created successfully!')
    router.push('/polls')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Create New Poll</CardTitle>
            <CardDescription>
              Share your question with the community and gather opinions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="title">Poll Question</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="What would you like to ask?"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Provide more context about your question"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>Poll Options</Label>
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        required
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => removeOption(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button type="button" variant="outline" className="w-full" onClick={addOption}>
                  Add Another Option
                </Button>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Create Poll
                </Button>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default withAuth(NewPollPage)

