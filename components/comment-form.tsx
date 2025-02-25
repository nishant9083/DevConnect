'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import MarkdownEditor from "@/components/markdown-editor";

interface CommentFormProps {
  discussionId: string
}

export function CommentForm({ discussionId }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('discussion_comments')
        .insert({
          discussion_id: discussionId,
          content,
          author_id: user.id,
        })

      if (error) throw error

      setContent('')
      toast({
        title: 'Comment added',
        description: 'Your answer has been posted successfully.',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* <Textarea
        placeholder="Write your answer..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[150px]"
      /> */}
        <MarkdownEditor value={content} setValue={setContent} />
      <Button type="submit" disabled={isSubmitting || !content.trim()}>
        {isSubmitting ? 'Posting...' : 'Post Answer'}
      </Button>
    </form>
  )
}