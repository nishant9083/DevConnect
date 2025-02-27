import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, MapPinIcon, UsersIcon, PlusIcon, SearchIcon, FilterIcon } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { EventMap } from '@/components/event-map'
import { CategoryFilter } from '@/components/filter'
import { SearchFilter } from '@/components/search-filter'

export const metadata: Metadata = {
  title: 'Events - DevConnect',
  description: 'Tech events and meetups in your area'
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: any
}) {
  const supabase = await createClient()
  const {category, search} = await searchParams;

  let query = supabase
    .from('events')
    .select(`
      *,
      organizer:organizer_id(
        username,
        full_name
      )
    `)
    .eq('status', 'active')
    .order('event_date', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data: events } = await query

  const filteredEvents = events?.filter(event => {
    if (!search) return true
    return (
      event.title.toLowerCase().includes(search) ||
      event.description.toLowerCase().includes(search) ||
      event.location_name.toLowerCase().includes(search)
    )
  })

  const { data: categories } = await supabase
    .from('events')
    .select('category')
    .not('category', 'is', null)
    .order('category')

  const uniqueCategories = Array.from(
    new Set(categories?.map(item => item.category))
  )

  return (
    <div className="m-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tech Events</h1>
            <p className="text-muted-foreground">
              Discover tech events and meetups in your area
            </p>
          </div>
          <Button asChild>
            <Link href="/events/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
        <SearchFilter defaultValue={search} />
          <CategoryFilter 
            categories={uniqueCategories} 
            defaultValue={category || "All"} 
          />
        </div>
      </div>

      {/* <div className="mb-8">
        <EventMap
          center={{ lat: 51.505, lng: -0.09 }}
          markers={filteredEvents?.map(event => ({
            position: { lat: event.latitude, lng: event.longitude },
            popup: event.title,
          }))}
          height="400px"
        />
      </div> */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents?.map((event) => (
          <Card key={event.id} className="group overflow-hidden">
            {event.cover_image_url && (
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={event.cover_image_url}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="line-clamp-2 overflow-ellipsis">{event.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    by {event.organizer.full_name}
                  </p>
                </div>
                <Badge>{event.category}</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {event.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(event.event_date), 'PPP')}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location_name}</span>
                </div>
                
                {event.capacity && (
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    <span>Capacity: {event.capacity}</span>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/events/${event.id}`}>
                  View Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}