import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, UsersIcon, Share2Icon } from "lucide-react";
import { format } from "date-fns";
import { EventMap } from "@/components/event-map";

export async function generateMetadata({ params}:{params: any}): Promise<Metadata> {
  const { id } = await params;

  if (!id) {
    return {
      title: "Event Not Found - DevConnect",
      description: "The requested event could not be found.",
    };
  }
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("title, description")
    .eq("id", id)
    .single();

  if (!event) {
    return {
      title: "Event Not Found - DevConnect",
      description: "The requested event could not be found.",
    };
  }

  return {
    title: `${event.title} - DevConnect Events`,
    description: event.description,
  };
}

export default async function EventPage({ params }:{params: any}) {
  const { id } = await params;
  if (!id) {
    notFound();
  }
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select(
      `
      *,
      organizer:organizer_id(
        id,
        username,
        full_name,
        bio
      )
    `
    )
    .eq("id", id)
    .single();

  if (!event) {
    notFound();
  }

  return (
    <div className="m-8 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {event.cover_image_url && (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={event.cover_image_url}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold">{event.title}</h1>
              <div className="mt-2 flex items-center gap-2">
                <Badge>{event.category}</Badge>
                <Badge variant="outline">
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="prose max-w-none dark:prose-invert">
              <p className="text-muted-foreground">{event.description}</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <EventMap
                  marker={{
                    position: { lat: event.latitude, lng: event.longitude },
                    popup: event.location_name,
                  }}
                  height="300px"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date and Time</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.event_date), "PPP p")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {event.location_name}
                    </p>
                  </div>
                </div>

                {event.capacity && (
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-sm text-muted-foreground">
                        {event.capacity} attendees
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <Button className="w-full">Register for Event</Button>
                <Button variant="outline" className="w-full">
                  <Share2Icon className="mr-2 h-4 w-4" />
                  Share Event
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <img
                  src={`https://avatar.vercel.sh/${event.organizer.username}`}
                  alt={event.organizer.full_name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="font-medium">{event.organizer.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    @{event.organizer.username}
                  </p>
                  {event.organizer.bio && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {event.organizer.bio}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
