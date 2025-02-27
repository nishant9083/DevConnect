"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  MessageSquare,
  Share2,
  ThumbsUp,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";
import { notFound } from "next/navigation";
import { TiptapEditor } from '@/components/tiptap-editor'

interface BlogPostProps {
  post: any;
}

export function BlogPost({ post }: BlogPostProps) {
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user) {
        notFound();
      }
      const { data: likes } = await supabase
        .from("blog_post_likes")
        .select("*")
        .eq("post_id", post.id);
      const { data: comments } = await supabase
        .from("blog_post_comments")
        .select(`*, profiles:profiles(username, full_name)`)
        .eq("post_id", post.id);
      setLikes(likes?.length || 0);
      setComments(comments || []);
    };
    getUser();
  }, [post]);

  const handleLike = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to like this post",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("blog_post_likes").upsert({
        post_id: post.id,
        user_id: user.id,
      });

      if (error) throw error;

      setLikes(likes + 1);
    } catch (error) {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: "Failed to like the post",
        variant: "destructive",
      });
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, full_name, id")
        .eq("id", user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      const { data: comment, error } = await supabase
        .from("blog_post_comments")
        .insert({
          post_id: post.id,
          user_id: profile.id,
          content: newComment,
        })
        .select(`*, profiles:profiles(username, full_name)`)
        .single();

      if (error) throw error;

      setComments([...comments, comment]);
      setNewComment("");
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="m-8 mx-auto max-w-4xl py-8">
      <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
      <div className="mb-8 flex items-center gap-4">
        <Avatar>
          <AvatarImage
            src={`https://github.com/${post.profiles.username}.png`}
            alt={post.profiles.full_name}
          />
          <AvatarFallback>
            {post.profiles.full_name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{post.profiles.full_name}</p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(post.created_at), "MMMM d, yyyy")}
          </p>
        </div>
      </div>

      <article className="prose prose-lg dark:prose-invert mx-auto">
        {post.cover_image && (
          <div className="mb-8 aspect-auto overflow-hidden rounded-lg">
            <img
              src={post.cover_image}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex gap-2">
            {post.tags?.map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <TiptapEditor
          className="mb-8 [&>*]:font-mono [&>pre]:bg-gray-100 [&>pre]:p-4 [&>pre]:rounded-md"          
          content={post.content || ""}
          editable={false}
          showToolbar={false}
        />

        <div className="flex items-center justify-between border-y py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleLike}
            >
              <Heart className="h-4 w-4" />
              <span>{likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => document.getElementById("comments")?.focus()}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{comments.length}</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?url=${shareUrl}`,
                  "_blank"
                )
              }
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
                  "_blank"
                )
              }
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                window.open(
                  `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
                  "_blank"
                )
              }
            >
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </article>

      <Separator className="my-8" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Comments</h2>

        <div className="space-y-4">
          <Textarea
            id="comments"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={handleComment} disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {comments.map((comment: any) => (
            <Card key={comment.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://github.com/${comment.profiles.username}.png`}
                      alt={comment.profiles.full_name}
                    />
                    <AvatarFallback>
                      {comment.profiles.full_name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm">
                      {comment.profiles.full_name}
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(comment.created_at), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{comment.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
