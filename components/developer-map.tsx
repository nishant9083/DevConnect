"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getGitHubUserData } from "@/lib/github";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, GitFork, Star, Users } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface Developer {
  id: string;
  full_name: string;
  experience_level: string;
  bio: string;
  skills: string[];
  github_username: string;
  github_data?: any;
}

export function DeveloperMap() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastDeveloperElementRef = useCallback(
    (node: any) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    []
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);

          const query = `${position.coords.latitude},${position.coords.longitude}`;
          const request_url =
            'https://api.opencagedata.com/geocode/v1/json' +
            "?" +
            "key=" +
            process.env.NEXT_PUBLIC_OPENCAGE_API_KEY +
            "&q=" +
            encodeURIComponent(query) +
            "&pretty=1" +
            "&no_annotations=1";

          const res = await fetch(request_url);
          const loc = await res.json();
          const dev_city = loc.results[0].components.city;

          const fetchDevelopers = async () => {
            try {
              const res = await fetch(
                `https://api.github.com/search/users?q=location:${dev_city}&per_page=10&page=${page}`
              );
              const data = await res.json();
              const developersWithGitHub = await Promise.all(
                data.items.map(async (dev: any) => {
                  const githubData = await getGitHubUserData(dev.login);
                  return {
                    id: dev.id,
                    full_name: githubData?.name,
                    bio: githubData?.bio,
                    github_username: dev.login,
                    github_data: githubData,
                  };
                })
              );
              setDevelopers((prevDevelopers) => [
                ...prevDevelopers,
                ...developersWithGitHub,
              ]);
            } catch (error) {
              console.error("Error fetching developers:", error);
            } finally {
              setIsLoading(false);
            }
          };

          fetchDevelopers();
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserLocation({ lat: 51.505, lng: -0.09 });
          setIsLoading(false);
        }
      );
    }
  }, [page]);

  if (!userLocation) {
    return (
      <div className="space-y-4">
        <DeveloperSkeleton />
        <DeveloperSkeleton />
        <DeveloperSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {developers.map((developer, index) => (
        <Card
          key={index}
          ref={developers.length === index + 1 ? lastDeveloperElementRef : null}
          className="group transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          <CardHeader className="flex flex-row items-center gap-4">
            {developer.github_data && (
              <img
                src={developer.github_data.avatar_url}
                alt={developer.github_data.name}
                className="h-16 w-16 rounded-full ring-2 ring-primary/10"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-ellipsis line-clamp-1">
                  {developer.full_name || developer.github_username}
                </h3>
                <a
                  href={`https://github.com/${developer.github_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              {developer.bio && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {developer.bio}
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {developer.github_data && (
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <GitFork className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {developer.github_data.public_repos} repositories
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {developer.github_data.followers} followers
                    </span>
                  </div>
                </div>

                {developer.github_data.recent_repos && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recent Projects</h4>
                    <div className="grid gap-3">
                      {developer.github_data.recent_repos
                        .slice(0, 3)
                        .map((repo: any) => (
                          <a
                            key={repo.name}
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/repo flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-ellipsis line-clamp-2">{repo.name}</span>
                                {repo.language && (
                                  <Badge variant="secondary" className="text-xs">
                                    {repo.language}
                                  </Badge>
                                )}
                              </div>
                              {repo.description && (
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {repo.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                              {repo.stargazers_count > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4" />
                                  <span className="text-sm">
                                    {repo.stargazers_count}
                                  </span>
                                </div>
                              )}
                              <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover/repo:opacity-100" />
                            </div>
                          </a>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {isLoading && (
        <div className="space-y-4">
          <DeveloperSkeleton />
          <DeveloperSkeleton />
        </div>
      )}
    </div>
  );
}

function DeveloperSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}