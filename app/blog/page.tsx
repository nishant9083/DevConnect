import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { BlogList } from "@/components/blogs/blog-list";

export const metadata: Metadata = {
  title: "Blog - DevConnect",
  description: "Read and share developer stories and insights",
};

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*, profiles:author_id (username, full_name), blog_post_likes (count), blog_post_comments (count)")
    .order("created_at", { ascending: false });

  return (
    <div className="m-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="text-muted-foreground">
          Read and share developer stories and insights
        </p>
      </div>
      <BlogList initialPosts={posts || []} />
    </div>
  );
}