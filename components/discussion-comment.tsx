'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ThumbsUpIcon, CheckCircleIcon } from 'lucide-react'
import { format } from 'date-fns'
import MarkdownPreview from './markdown-preview'
import {createClient} from '@/utils/supabase/client'

interface Comment {
  id: string
  content: string
  created_at: string
  upvotes: number
  author: {
    username: string
    full_name: string
    experience_level: string
  }
}

interface DiscussionCommentProps {
  comment: Comment
  isSolution?: boolean
}

export function DiscussionComment({ comment, isSolution}: DiscussionCommentProps) {
    const supabase = createClient()

    const setUpVotes = async (commentId: string) => {
        const { error } = await supabase.from("discussion_comments").upsert({
          id: commentId,
          upvotes: 1,
        });        
      };

  return (
    <Card className={isSolution ? 'border-primary bg-primary/5' : undefined}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <img
              src={`https://avatar.vercel.sh/${comment.author.username}`}
              alt={comment.author.full_name}
            />
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{comment.author.full_name}</span>
              <span className="text-muted-foreground">
                {format(new Date(comment.created_at), 'PPp')}
              </span>
              <Badge variant="outline">
                {comment.author.experience_level}
              </Badge>
              {isSolution && (
                <Badge variant="default" className="ml-auto">
                  <CheckCircleIcon className="mr-1 h-3 w-3" />
                  Solution
                </Badge>
              )}
            </div>

            <div className="mt-2 prose dark:prose-invert">
              <MarkdownPreview value={comment.content} />
            </div>

            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUpVotes(comment.id)}
              >
                <ThumbsUpIcon className="mr-2 h-4 w-4" />
                Upvote ({comment.upvotes})
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}