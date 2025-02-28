"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  User2,
  Mail,
  Github,
  MapPin,
  Code2,
  Briefcase,
  Edit2,
  Save,
  X,
  User,
  Users2Icon, HomeIcon, SearchIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link'
import { motion } from 'framer-motion'

const profile_data = {
  id: "1",
  Username: "johndoe",
  full_name: "John Doe",
  experience_level: "beginner",
  bio: "I am a software developer",
  skills: ["JavaScript", "React", "Node.js"],
  github_username: "johndoe",
  location: "Lagos, Nigeria",
  available_for_mentoring: true,
  collaboration_type: "hybrid",
};

export function ProfileView({ userName }: { userName: string | null }) {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(profile_data);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [isUserName, setIsUserName] = useState(false);

  const editProfile = searchParams.get("edit_profile") == "true" ? true : false;

  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("No user found");

        const { data: profile } = !userName
          ? await supabase
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .single()
          : await supabase
              .from("profiles")
              .select("*")
              .eq("username", userName)
              .single();
        const isProfileComplete = profile && profile.username;
        if (editProfile && !isProfileComplete) {
          setIsEditing(true);
          setIsLoading(false);
          setIsUserName(false);
          return;
        }
        setIsUserName(true);
        setProfile(profile);
        setEditedProfile(profile);
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [supabase, toast]);

  const handleSave = async () => {
    try {
      if (!profile) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update(editedProfile)
        .eq("id", profile.id);

      if (error) throw error;

      setProfile(editedProfile);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-8">
      {profile ? (
        <Card>
          <CardHeader className="relative">
            {(!userName || (userName && profile!.username == userName)) && (
              <div className="absolute right-6 top-6 space-x-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedProfile(profile);
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            )}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={`https://github.com/${profile?.github_username}.png`}
                  alt={profile?.full_name}
                />
                <AvatarFallback>
                  {profile?.full_name
                    ?.split(" ")
                    .map((n: any) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {isEditing ? (
                    <Input
                      value={editedProfile?.full_name}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          full_name: e.target.value,
                        })
                      }
                      className="max-w-sm"
                    />
                  ) : (
                    profile?.full_name
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  {editProfile && !isUserName ? (
                    <Input
                      placeholder="username"
                      value={editedProfile?.username}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          username: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <>
                      <User2 className="h-4 w-4" />@{profile?.username}
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="">
            <Tabs defaultValue="about" className="space-y-6">
              <div className="flex justify-end">
                <TabsList className="">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="skills">Skills & Experience</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="about" className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Bio</Label>
                      {isEditing ? (
                        <Textarea
                          value={editedProfile.bio}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              bio: e.target.value,
                            })
                          }
                          className="min-h-[100px]"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {profile?.bio}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Github className="h-4 w-4" />
                          GitHub Username
                        </Label>
                        {isEditing ? (
                          <Input
                            value={editedProfile.github_username}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                github_username: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {profile?.github_username}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </Label>
                        {isEditing ? (
                          <Input
                            value={editedProfile.location}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                location: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {profile?.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Code2 className="h-4 w-4" />
                      Skills
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.skills.join(", ")}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            skills: e.target.value
                              .split(",")
                              .map((s) => s.trim()),
                          })
                        }
                        placeholder="JavaScript, React, Node.js"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile?.skills.map((skill: any) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Experience Level
                    </Label>
                    {isEditing ? (
                      <Select
                        value={editedProfile.experience_level}
                        onValueChange={(value) =>
                          setEditedProfile({
                            ...editedProfile,
                            experience_level: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline" className="capitalize">
                        {profile?.experience_level}
                      </Badge>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Available for Mentoring</Label>
                      <p className="text-sm text-muted-foreground">
                        Let others know you're open to mentoring
                      </p>
                    </div>
                    <Switch
                      checked={
                        isEditing
                          ? editedProfile.available_for_mentoring
                          : profile?.available_for_mentoring
                      }
                      onCheckedChange={(checked) =>
                        isEditing &&
                        setEditedProfile({
                          ...editedProfile,
                          available_for_mentoring: checked,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Collaboration Type</Label>
                    {isEditing ? (
                      <Select
                        value={editedProfile.collaboration_type}
                        onValueChange={(value) =>
                          setEditedProfile({
                            ...editedProfile,
                            collaboration_type: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select collaboration type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-person">In Person</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline" className="capitalize">
                        {profile?.collaboration_type}
                      </Badge>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <ProfileNotFound />
      )}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 animate-pulse rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
          <div className="space-y-4">
            <div className="h-24 w-full animate-pulse rounded bg-muted" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



function ProfileNotFound() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      className="min-h-[80vh] flex flex-col items-center justify-center p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-md mx-auto text-center">
        {/* Animated Icon */}
        <motion.div
          className="mb-8"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="relative inline-block">
            <Users2Icon className="h-24 w-24 text-primary/20" />
            <Users2Icon className="h-24 w-24 text-primary absolute top-0 left-0 opacity-50" />
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Profile Not Found
          </h1>
          
          <p className="text-xl text-muted-foreground">
            We couldn't find the developer you're looking for.
          </p>

          <div className="bg-muted/50 rounded-lg p-6 space-y-2 text-sm text-muted-foreground">
            <p>This could be because:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>The username might be incorrect</li>
              <li>The profile has been deleted</li>
              <li>The developer hasn't created their profile yet</li>
            </ul>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <Button asChild size="lg">
            <Link href="/">
              <HomeIcon className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/developers">
              <SearchIcon className="mr-2 h-4 w-4" />
              Find Developers
            </Link>
          </Button>
        </motion.div>

        {/* Additional Help */}
        <motion.p 
          variants={itemVariants}
          className="mt-8 text-sm text-muted-foreground"
        >
          Need help? <Link href="/contact" className="text-primary hover:underline">Contact Support</Link>
        </motion.p>
      </div>
    </motion.div>
  )
}