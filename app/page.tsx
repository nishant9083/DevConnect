import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapIcon, Users2Icon, MessageSquareIcon, CalendarIcon } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center m-8">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6 m-auto">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Connect with Local Developers
            </h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Find developers in your area for collaboration, mentorship, and building amazing projects together.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/map">
                  Find Developers
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/signin">
                  Join DevConnect
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 m-auto">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                <MapIcon className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Find Local Talent</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Discover developers in your area based on skills and interests
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                <Users2Icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Collaborate</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Team up with others on exciting projects and learn together
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                <MessageSquareIcon className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Connect</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Message other developers and build your professional network
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                <CalendarIcon className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Events</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Join local coding meetups and tech community events
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}