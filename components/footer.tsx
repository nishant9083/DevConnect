import { Github, Heart, Twitter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" >
      <div className="flex flex-col mx-8">
        <div className="grid gap-8 py-8 lg:grid-cols-2 lg:py-12">
          <div className="flex flex-col justify-center lg:justify-start">
            <Link
              href="/"
              className="mb-4 flex items-center gap-2 text-lg font-bold"
            >
              DevConnect
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Connecting developers locally for collaboration, mentorship, and
              building amazing projects together.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/developers"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Find Developers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/messages"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Messages
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Events
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Community</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/blog"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/discussions"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Discussions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guidelines"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Community Guidelines
                  </Link>
                </li>
                <li>
                  <Link
                    href="/feedback"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col items-center justify-between gap-4 py-8 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2 lg:gap-4">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with{" "}
              <Heart className="mx-1 inline-block h-4 w-4 text-red-500" /> by the
              developer community.
            </p>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://twitter.com/devconnect"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://github.com/devconnect"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} DevConnect
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}