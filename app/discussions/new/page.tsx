'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import MarkdownEditor from '@/components/markdown-editor'

const discussionSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  content: z.string().min(30, 'Content must be at least 30 characters'),
  tags: z.array(z.string()).min(1, 'Add at least one tag'),
})

type DiscussionFormValues = z.infer<typeof discussionSchema>

export default function NewDiscussionPage() {
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const form = useForm<DiscussionFormValues>({
    resolver: zodResolver(discussionSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
    },
  })

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        const newTags = [...tags, tagInput.trim()]
        setTags(newTags)
        form.setValue('tags', newTags)
      }
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    setTags(newTags)
    form.setValue('tags', newTags)
  }

  async function onSubmit(data: DiscussionFormValues) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('discussions')
        .insert({
          title: data.title,
          content: data.content,
          tags: data.tags,
          author_id: user.id,
        })

      if (error) throw error

      toast({
        title: 'Discussion created',
        description: 'Your discussion has been posted successfully.',
      })

      router.back()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="m-8 max-w-2xl py-8">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Start a Discussion</CardTitle>
              <CardDescription>
                Create a new discussion to get help or share knowledge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What's your question or topic?"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific and imagine you're asking a question to another person
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      {/* <Textarea
                        placeholder="Provide details and context..."
                        className="min-h-[200px]"
                        {...field}
                      /> */}
                      <MarkdownEditor value={field.value} setValue={field.onChange}placeholder="Provide details and context..." />
                    </FormControl>
                    <FormDescription>
                      Include all the information someone would need to help you
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          placeholder="Add tags (press Enter)"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={addTag}
                        />
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Add up to 5 tags to help others find your discussion
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Post Discussion
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}