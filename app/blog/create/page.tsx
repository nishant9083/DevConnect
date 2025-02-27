"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import { TiptapEditor } from "@/components/tiptap-editor";

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [content, setContent] = useState("");
  const handlePublish = async () => {
    if (!title || !content) {
      toast({
        title: "Error",
        description: "Please provide a title and content for your blog post",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, id")
        .eq("id", user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      // Generate a URL-friendly slug from the title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Create an excerpt from the content (first 160 characters)
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const excerpt = tempDiv.textContent?.slice(0, 160).trim() + "..." || "";

      const { error } = await supabase.from("blog_posts").insert({
        title,
        content,
        cover_image: coverImage,
        author_id: profile.id,
        slug,
        excerpt,
        status: "published",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post published successfully",
      });

      router.push("/blog");
    } catch (error) {
      console.error("Error publishing post:", error);
      toast({
        title: "Error",
        description: "Failed to publish blog post",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="m-8 max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Blog Post</h1>
        <p className="text-muted-foreground">
          Share your thoughts and expertise
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog post title"
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image URL</Label>
            <Input
              id="cover"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

          <Label htmlFor="content">Content</Label>
        <div className="rounded-lg border bg-card">          
          <TiptapEditor content={content} onChange={setContent} />
        </div>

        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handlePublish}
            disabled={isPublishing || !title || !content}
          >
            {isPublishing ? "Publishing..." : "Publish Post"}
          </Button>
        </div>
      </div>
    </div>
  );
}
