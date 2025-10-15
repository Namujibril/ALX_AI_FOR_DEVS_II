'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import withAuth from "@/components/withAuth"
import { supabase } from '@/lib/supabase'
import { EditablePollOption } from '@/lib/types'

function EditPollPage() {
  const router = useRouter()
  const params = useParams()
  const { id: pollId } = params
  const [title, setTitle] = useState('')
  const [options, setOptions] = useState<EditablePollOption[]>([])

  useEffect(() => {
    const fetchPoll = async () => {
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .select('title')
        .eq('id', pollId)
        .single()

      if (pollError) {
        console.error('Error fetching poll:', pollError)
        return
      }

      const { data: optionsData, error: optionsError } = await supabase
        .from('poll_options')
        .select('id, option_text')
        .eq('poll_id', pollId)

      if (optionsError) {
        console.error('Error fetching poll options:', optionsError)
        return
      }

      setTitle(pollData.title)
      setOptions(optionsData)
    }

    if (pollId) {
      fetchPoll()
    }
  }, [pollId])

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index].option_text = value
    setOptions(newOptions)
  }

  const addOption = () => {
    setOptions([...options, { id: '', option_text: '' }])
  }

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const confirmed = window.confirm('Are you sure you want to update this poll?')
    if (!confirmed) {
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('User not logged in')
      return
    }

    // Update the poll title
    const { error: pollError } = await supabase
      .from('polls')
      .update({ title })
      .eq('id', pollId)

    if (pollError) {
      console.error('Error updating poll:', pollError)
      return
    }

    // Upsert the poll options
    const pollOptions = options.map(option => ({
      poll_id: pollId as string,
      option_text: option.option_text,
      ...(option.id && { id: option.id })
    }))

    const { error: optionsError } = await supabase
      .from('poll_options')
      .upsert(pollOptions)

    if (optionsError) {
      console.error('Error updating poll options:', optionsError)
      return
    }

    alert('Poll updated successfully!')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Edit Poll</CardTitle>
            <CardDescription>
              Update your question and options.
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

              <div className="space-y-4">
                <Label>Poll Options</Label>
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        required
                        value={option.option_text}
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
                  Update Poll
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default withAuth(EditPollPage)
