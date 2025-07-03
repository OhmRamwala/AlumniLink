import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { mockThreads, mockUsers } from '@/lib/mock-data';
import { ArrowLeft, CornerUpLeft } from 'lucide-react';

export default function ForumThreadPage({ params }: { params: { id: string } }) {
  const thread = mockThreads.find((t) => t.id === `thread-${params.id}`);
  const currentUser = mockUsers[2]; // Mock current user

  if (!thread) {
    return <div>Thread not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild>
            <Link href="/dashboard/forum">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forum
            </Link>
        </Button>
      </div>

      {/* Original Post */}
      <Card>
        <CardHeader>
          <CardTitle>{thread.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://placehold.co/100x100.png`} alt={thread.author.firstName} data-ai-hint="person face" />
              <AvatarFallback>
                {thread.author.firstName[0]}
                {thread.author.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <span>
              {thread.author.firstName} {thread.author.lastName}
            </span>
            <span>•</span>
            <span>{thread.timestamp}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed">{thread.content}</p>
        </CardContent>
      </Card>
      
      {/* Replies */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Replies ({thread.replyCount})</h2>
        {thread.replies.map((reply) => (
          <Card key={reply.id}>
            <CardHeader className="flex-row items-start gap-3 space-y-0">
               <Avatar className="h-10 w-10">
                <AvatarImage src={`https://placehold.co/100x100.png`} alt={reply.author.firstName} data-ai-hint="professional headshot" />
                <AvatarFallback>{reply.author.firstName[0]}{reply.author.lastName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                 <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">{reply.author.firstName} {reply.author.lastName}</span>
                    <span className="text-muted-foreground">• {reply.timestamp}</span>
                 </div>
                 <p className="text-base mt-1">{reply.content}</p>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Reply Form */}
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
            <AvatarImage src={`https://placehold.co/100x100.png`} alt={currentUser.firstName} data-ai-hint="person face" />
            <AvatarFallback>{currentUser.firstName[0]}{currentUser.lastName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
            <Textarea placeholder="Write a reply..." rows={4} />
            <Button>
                <CornerUpLeft className="mr-2 h-4 w-4" />
                Post Reply
            </Button>
        </div>
      </div>

    </div>
  );
}
