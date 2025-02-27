"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import React from "react";

import { TiptapEditor } from "@/components/tiptap-editor";

export default function EditBlogPost({ params }: any) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState("");

  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();
  // @ts-ignore
  const { slug } = React.use(params);



  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      const { data: post, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch blog post",
          variant: "destructive",
        });
        router.push("/blog/dashboard");
        return;
      }

      setTitle(post.title);
      setContent(post.content);
      setExcerpt(post.excerpt);
      setTags(post.tags || []);
      setIsLoading(false);
    };

    fetchPost();
  }, [slug]);

  const handleAddTag = (e: React.MouseEvent) => {
    e.preventDefault();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string, e: React.MouseEvent) => {
    e.preventDefault();
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("blog_posts")
        .update({
          title,
          content: content,
          excerpt,          
          updated_at: new Date().toISOString(),
        })
        .eq("slug", slug);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });

      router.push("/blog/dashboard");
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="m-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="m-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        <p className="text-muted-foreground">Update your blog post</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="title">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="excerpt">
            Excerpt
          </label>
          <Input
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="content">
            Content
          </label>
          <div className="rounded-lg border bg-card">

          <TiptapEditor onChange={setContent} content={content || ""} />
        </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="tags">
            Tags
          </label>
          <div className="flex gap-2">
            <Input
              id="tags"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Add a tag"
            />
            <Button type="button" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
                <button
                  type="button"
                  onClick={(e) => handleRemoveTag(tag, e)}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Post"}
        </Button>
      </form>
    </div>
  );
}
