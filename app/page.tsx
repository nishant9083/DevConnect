import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapIcon, Users2Icon, MessageSquareIcon, CalendarIcon, CodeIcon, RocketIcon, BrainIcon, HeartIcon } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Connect with Local Developers
            </h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Find developers in your area for collaboration, mentorship, and building amazing projects together.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/developers">
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
        <div className="container px-4 md:px-6">
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

      {/* Alternating Sections */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 p-2">
                <CodeIcon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Skill-Based Matching
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Our advanced matching algorithm connects you with developers who share your technical interests and skill level. Whether you're a beginner looking for mentorship or an expert seeking collaboration, find the perfect match for your next project.
              </p>
              <Button asChild>
                <Link href="/developers">
                  Browse Developers
                </Link>
              </Button>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-xl lg:order-last">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
                alt="Developers collaborating"
                className="object-cover w-full h-full"
                loading='lazy'
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-gradient-to-l from-secondary/5 via-secondary/10 to-secondary/5">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="relative aspect-video overflow-hidden rounded-xl lg:order-first">
              <img
                src="https://images.unsplash.com/photo-1515187029135-18ee286d815b"
                alt="Local tech events"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary/10 p-2">
                <RocketIcon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Local Tech Events
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Stay connected with your local tech community through meetups, hackathons, and workshops. Network with fellow developers, learn new skills, and showcase your projects in a supportive environment.
              </p>
              <Button asChild>
                <Link href="/events">
                  Discover Events
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 p-2">
                <BrainIcon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Knowledge Sharing
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Join our thriving community of developers sharing insights, best practices, and solutions. Participate in discussions, get help with coding challenges, and contribute your expertise to help others grow.
              </p>
              <Button asChild>
                <Link href="/discussions">
                  Join Discussions
                </Link>
              </Button>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-xl lg:order-last">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998"
                alt="Knowledge sharing"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-gradient-to-l from-secondary/5 via-secondary/10 to-secondary/5">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="relative aspect-video overflow-hidden rounded-xl lg:order-first">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
                alt="Mentorship"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary/10 p-2">
                <HeartIcon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Mentorship Program
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Connect with experienced developers who are passionate about helping others grow. Our mentorship program facilitates meaningful relationships that accelerate your learning and career development.
              </p>
              <Button asChild>
                <Link href="/mentorship">
                  Find a Mentor
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}