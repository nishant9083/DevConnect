import { Metadata } from 'next'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, MapPinIcon, UsersIcon, ExternalLinkIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Events - DevConnect',
  description: 'Tech events and meetups in your area',
}

// Mock data - In production, this would come from your database
const events = [
  {
    id: 1,
    title: 'React Meetup',
    description: 'Monthly meetup for React developers to share knowledge and network',
    date: '2025-03-15T18:00:00',
    location: 'Tech Hub Downtown',
    attendees: 45,
    tags: ['React', 'JavaScript', 'Web Development'],
    url: '#',
  },
  {
    id: 2,
    title: 'Full Stack Workshop',
    description: 'Hands-on workshop covering modern full-stack development',
    date: '2025-03-20T09:00:00',
    location: 'Innovation Center',
    attendees: 30,
    tags: ['Node.js', 'React', 'PostgreSQL'],
    url: '#',
  },
  {
    id: 3,
    title: 'Tech Career Fair',
    description: 'Connect with top tech companies and explore job opportunities',
    date: '2025-03-25T10:00:00',
    location: 'Convention Center',
    attendees: 200,
    tags: ['Career', 'Networking', 'Jobs'],
    url: '#',
  },
]

export default function EventsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tech Events</h1>
        <p className="text-muted-foreground">
          Discover tech events and meetups in your area
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPinIcon className="h-4 w-4" />
                <span>{event.location}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <UsersIcon className="h-4 w-4" />
                <span>{event.attendees} attending</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <a href={event.url} target="_blank" rel="noopener noreferrer">
                  Register
                  <ExternalLinkIcon className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}