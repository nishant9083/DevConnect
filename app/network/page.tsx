import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Network - DevConnect',
  description: 'Your professional network of developers',
}

export default async function NetworkPage() {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()

  const { data: connections } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', user?.user?.id)
    .limit(10)

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Network</h1>
        <p className="text-muted-foreground">
          Connect with developers and grow your professional network
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {connections?.map((connection) => (
          <Card key={connection.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <img
                  src={`https://avatar.vercel.sh/${connection.username}`}
                  alt={connection.full_name}
                />
              </Avatar>
              <div>
                <CardTitle className="text-lg">{connection.full_name}</CardTitle>
                <p className="text-sm text-muted-foreground">@{connection.username}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">{connection.bio}</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {connection.skills?.map((skill: string) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{connection.experience_level}</Badge>
                <Button asChild size="sm">
                  <Link href={`/messages?user=${connection.username}`}>
                    Message
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}