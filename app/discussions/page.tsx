"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquareIcon,
  TagIcon,
  TrendingUpIcon,
  ClockIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    username: string;
    full_name: string;
  };
  created_at: string;
  tags: string[];
  upvotes: number;
  status: "open" | "closed" | "solved";
  comment_count: number;
}

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const router = useRouter();
  const supabase = createClient();

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => discussion.tags.includes(tag));

    return matchesSearch && matchesTags;
  });


  function parsedData(data: any[]) {
    const parsedDiscussions: Discussion[] = (data as any[]).map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        author: {
          username: item.author?.username || "Unknown",
          full_name: item.author?.full_name || "Unknown",
        },
        created_at: item.created_at,
        tags: item.tags,
        upvotes: item.upvotes,
        status: item.status,
        comment_count: item.discussion_comments[0].count,
      }));
      return parsedDiscussions;
    }

  const fetchDiscussions = async () => {
    const { data, error } = await supabase
      .from("discussions")
      .select(`
            id,
            title,
            content,
            author:author_id(username, full_name),
            created_at,
            tags,
            upvotes,
            status,
            discussion_comments (count)
      `);

    if (error) {
      console.error("Error fetching discussions:", error);
    } else {
      const parsedDiscussions: Discussion[] = parsedData(data);
      setDiscussions(parsedDiscussions);
    }
  };


  const fetchUnansweredDiscussions = async () => {
    const { data, error } = await supabase
        .from("discussions")
        .select(`
            id,
            title,
            content,
            author:author_id(username, full_name),
            created_at,
            tags,
            upvotes,
            status,
            discussion_comments (count)
            `)
        .eq("status", "open");

    if (error) {
        console.error("Error fetching discussions:", error);
        }
    else {
        
    }};

  useEffect(() => {
    fetchDiscussions();
  }, []);

  return (
    <div className="m-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Discussions</h1>
            <p className="text-muted-foreground">
              Ask questions, share knowledge, and connect with other developers
            </p>
          </div>
          <Button asChild>
            <Link href="/discussions/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Start Discussion
            </Link>
          </Button>
        </div>

        <div className="mt-4 flex gap-4">
          <div className="relative flex-1">
            <MessageSquareIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <TagIcon className="mr-2 h-4 w-4" />
            Filter Tags
          </Button>
        </div>
      </div>

      <Tabs defaultValue="latest" className="space-y-4">
        <TabsList>
          <TabsTrigger value="latest">
            <ClockIcon className="mr-2 h-4 w-4" />
            Latest
          </TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUpIcon className="mr-2 h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="solved">Solved</TabsTrigger>
          <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
        </TabsList>

        <TabsContent value="latest" className="space-y-4">
          {filteredDiscussions.map((discussion) => (
            <Card key={discussion.id} className="group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="hover:text-primary">
                      <Link href={`/discussions/${discussion.id}`}>
                        {discussion.title}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Posted by {discussion.author.username}</span>
                      <span>•</span>
                      <span>
                        {format(new Date(discussion.created_at), "PPp")}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      discussion.status === "solved" ? "default" : "secondary"
                    }
                  >
                    {discussion.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-muted-foreground">
                  {discussion.content}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {discussion.comment_count} comments
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {discussion.upvotes} upvotes
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {discussion.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Other tab contents would be similar */}
      </Tabs>
    </div>
  );
}
// }`}></TabsTrigger>
//                         {discussion.title}
//                       </Link>
//                     </CardTitle>
//                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                       <span>Posted by {discussion.author.username}</span>
//                       <span>•</span>
//                       <span>{format(new Date(discussion.created_at), 'PPp')}</span>
//                     </div>
//                   </div>
//                   <Badge variant={discussion.status === 'solved' ? 'default' : 'secondary'}>
//                     {discussion.status}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <p className="line-clamp-2 text-muted-foreground">
//                   {discussion.content}
//                 </p>
//                 <div className="mt-4 flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-sm text-muted-foreground">
//                       {discussion.comment_count} comments
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-sm text-muted-foreground">
//                       {discussion.upvotes} upvotes
//                     </span>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {discussion.tags.map((tag) => (
//                       <Badge key={tag} variant="outline">
//                         {tag}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </TabsContent>

//         {/* Other tab contents would be similar */}
//       </Tabs>
//     </div>
//   )
// }
