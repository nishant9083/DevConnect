import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapIcon, Users2Icon, MessageSquareIcon, CalendarIcon, BellIcon, PlusIcon, TrendingUpIcon } from 'lucide-react'
import { format } from 'date-fns'
// import { DashboardChart } from '@/components/dashboard-chart'

export const metadata: Metadata = {
  title: 'Dashboard - DevConnect',
  description: 'Your DevConnect dashboard'
}

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const { data: discussions } = await supabase
    .from('discussions')
    .select(`
      *,
      author:author_id(username, full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })
    .limit(3)

  const isProfileComplete = profile && profile.username && profile.skills

  return (
    <div className="m-8 py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main Content */}
        <div className="space-y-6">
          {!isProfileComplete && (
            <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
              <CardHeader>
                <CardTitle>Complete Your Profile</CardTitle>
                <CardDescription>
                  Complete your profile to get the most out of DevConnect
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/profile?edit_profile=true">Complete Profile</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Connections
                </CardTitle>
                <Users2Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">
                  +5 this week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Messages
                </CardTitle>
                <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  3 unread
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Upcoming Events
                </CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">
                  Next event in 2 days
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Network Growth</CardTitle>
              <CardDescription>
                Your connection growth over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] bg-amber-500">
                {/* <DashboardChart /> */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <Tabs defaultValue="discussions" className="w-full">
                <TabsList>
                  <TabsTrigger value="discussions">Discussions</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="connections">Connections</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Tabs>
              <TabsContent value="discussions" className="space-y-4">
                {discussions?.map((discussion) => (
                  <div key={discussion.id} className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <img
                        src={`https://avatar.vercel.sh/${discussion.author.username}`}
                        alt={discussion.author.full_name}
                      />
                    </Avatar>
                    <div className="space-y-1">
                      <Link
                        href={`/discussions/${discussion.id}`}
                        className="font-medium hover:underline"
                      >
                        {discussion.title}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{discussion.author.username}</span>
                        <span>•</span>
                        <span>{format(new Date(discussion.created_at), 'PP')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="events" className="space-y-4">
                {events?.map((event) => (
                  <div key={event.id} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <Link
                        href={`/events/${event.id}`}
                        className="font-medium hover:underline"
                      >
                        {event.title}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{format(new Date(event.event_date), 'PPp')}</span>
                        <span>•</span>
                        <span>{event.location_name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
                </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Latest Discussions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {discussions?.slice(0, 5).map((discussion) => (
                <div key={discussion.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <img
                      src={`https://avatar.vercel.sh/${discussion.author.username}`}
                      alt={discussion.author.full_name}
                    />
                  </Avatar>
                  <div className="space-y-1">
                    <Link
                      href={`/discussions/${discussion.id}`}
                      className="line-clamp-1 text-sm font-medium hover:underline"
                    >
                      {discussion.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(discussion.created_at), 'PP')}
                    </p>
                  </div>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full">
                <Link href="/discussions">View All Discussions</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/discussions/new">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Discussion
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/events/create">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Create Event
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/developers">
                  <Users2Icon className="mr-2 h-4 w-4" />
                  Find Developers
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trending Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js'].map((topic) => (
                  <Badge key={topic} variant="secondary">
                    <TrendingUpIcon className="mr-1 h-3 w-3" />
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}