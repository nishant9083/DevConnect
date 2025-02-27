import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { BlogPost } from "@/components/blogs/blog-post";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: any): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .single();

  if (!post) {
    return {
      title: "Post Not Found - DevConnect",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} - DevConnect Blog`,
    description: post.excerpt || "Read this developer story on DevConnect",
  };
}

export default async function BlogPostPage({ params }: any) {
  const supabase = await createClient();
  const { slug } = await params;

const { data: post, error } = await supabase
    .from("blog_posts")
    .select(
      `
      *,
      profiles:author_id (
        username,
        full_name       
      )
    `
    )
    .eq("slug", slug)
    .single();
  if (error) {
    console.error("Error fetching post:", error);   
  }
  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}
