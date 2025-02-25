"use client";
import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { ModeToggle } from "@/components/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  MapIcon,
  Users2Icon,
  MessageSquareIcon,
  CalendarIcon,
  Box,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Router from "next/router";
import { useEffect, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

export function Header() {
  const supabase = createClient();
  const router = Router;
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/signin");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();
      setProfile(profile);
    };
    checkUser();
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Users2Icon className="h-6 w-6" />
            <span className="font-bold">DevConnect</span>
          </Link>
          <NavigationMenu className="hidden sm:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/developers" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    <MapIcon className="mr-2 h-4 w-4" />
                    Find Developers
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/messages" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    <MessageSquareIcon className="mr-2 h-4 w-4" />
                    Messages
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/events" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Events
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <ModeToggle />

          {profile ? (
            <HoverCard>
              <HoverCardTrigger>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage
                    src={`https://github.com/${
                      profile?.github_username || "unknown"
                    }.png`}
                    alt={profile?.full_name || "Unknown"}
                  />
                  <AvatarFallback>
                    {profile?.full_name
                      ?.split(" ")
                      .map((n: any) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent className="m-2">
                <div className="flex flex-col gap-4">
                  <Link href="/profile">Profile</Link>
                  <form action={signOutAction}>
                    <Button variant="ghost" type="submit">
                      Sign Out
                    </Button>
                  </form>
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <>
              <Button asChild variant="default">
                <Link href="/signin">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
