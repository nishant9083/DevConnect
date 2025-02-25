import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MessageSquareIcon, ThumbsUpIcon, CheckCircleIcon } from "lucide-react";
import { format } from "date-fns";
import { DiscussionComment } from "@/components/discussion-comment";
import { CommentForm } from "@/components/comment-form";
import { notFound } from "next/navigation";
import MarkdownPreview from "@/components/markdown-preview";
import { se } from "date-fns/locale";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: discussion } = await supabase
    .from("discussions")
    .select("title, content")
    .eq("id", id)
    .single();

  if (!discussion) {
    return {
      title: "Discussion Not Found",
      description: "The requested discussion could not be found.",
    };
  }

  return {
    title: `${discussion.title} - DevConnect Discussions`,
    description: discussion.content.slice(0, 160),
  };
}

export default async function DiscussionPage({ params }: any) {
  const supabase = await createClient();
  const {id} = await params;

  const { data: discussion } = await supabase
    .from("discussions")
    .select(
      `
      *,
      author:author_id(
        id,
        username,
        full_name,
        experience_level
      )
    `
    )
    .eq("id", id)
    .single();

  if (!discussion) {
    notFound();
  }

  const { data: comments } = await supabase
    .from("discussion_comments")
    .select(
      `
      *,
      author:author_id(
        id,
        username,
        full_name,
        experience_level
      )
    `
    )
    .eq("discussion_id", id)
    .order("created_at", { ascending: true });



  return (
    <div className="m-8 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{discussion.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar className="h-6 w-6">
                  <img
                    src={`https://avatar.vercel.sh/${discussion.author.username}`}
                    alt={discussion.author.full_name}
                  />
                </Avatar>
                <span>{discussion.author.full_name}</span>
                <span>•</span>
                <span>{format(new Date(discussion.created_at), "PPp")}</span>
                <Badge variant="outline">
                  {discussion.author.experience_level}
                </Badge>
              </div>
            </div>
            <Badge
              variant={discussion.status === "solved" ? "default" : "secondary"}
            >
              {discussion.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <MarkdownPreview value={discussion.content} />
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Button variant="outline" size="sm">
              <ThumbsUpIcon className="mr-2 h-4 w-4" />
              Upvote ({discussion.upvotes})
            </Button>
            <div className="flex flex-wrap gap-2">
              {discussion.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="my-8" />

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {comments?.length || 0} Answers
              </h3>
              <Button variant="outline" size="sm">
                <MessageSquareIcon className="mr-2 h-4 w-4" />
                Add Answer
              </Button>
            </div>

            {comments?.map((comment) => (
              <DiscussionComment
                key={comment.id}
                comment={comment}
                isSolution={comment.is_solution}                
              />
            ))}

            <CommentForm discussionId={discussion.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
