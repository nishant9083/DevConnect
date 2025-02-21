import { Metadata } from 'next'
import { DeveloperMap } from '@/components/developer-map'
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Developer Map - DevConnect',
  description: 'Find developers in your area',
}

export default function MapPage() {
  return (
    <div className="py-8 m-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Developer's Hunt</h1>
        <p className="text-muted-foreground">
        Connect with talented developers in your area
        </p>
        <form className="hidden w-full max-w-sm lg:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search developers..."
                className="w-full bg-background pl-8 md:w-[300px] lg:w-[300px]"
              />
            </div>
          </form>
      </div>
      <DeveloperMap />
    </div>
  )
}