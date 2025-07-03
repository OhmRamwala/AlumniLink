'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { mockThreads, mockUsers } from '@/lib/mock-data';
import {
  ArrowLeft,
  CornerUpLeft,
  MessageSquare,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ForumThreadPage() {
  const params = useParams();
  const threadId = Array.isArray(params.id) ? params.id[0] : params.id;
  const thread = mockThreads.find((t) => t.id === threadId);
  const currentUser = mockUsers[2]; // Mock current user (Emily Jones)

  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');

  if (!thread) {
    return <div>Thread not found</div>;
  }

  const handleEditClick = (
    type: 'thread' | 'reply',
    id: string,
    currentContent: string
  ) => {
    setEditingPost(`${type}-${id}`);
    setEditedContent(currentContent);
  };

  const handleSaveEdit = () => {
    // Here you would typically call an API to save the changes.
    // For this mock, we'll just log it and reset the state.
    console.log('Saving content:', editedContent);
    setEditingPost(null);
    setEditedContent('');
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditedContent('');
  };

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
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle>{thread.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://placehold.co/100x100.png`}
                    alt={thread.author.firstName}
                    data-ai-hint="person face"
                  />
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
            </div>
            {currentUser.id === thread.author.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() =>
                      handleEditClick('thread', thread.id, thread.content)
                    }
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editingPost === `thread-${thread.id}` ? (
            <div className="space-y-2">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={5}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveEdit}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-base leading-relaxed">{thread.content}</p>
          )}
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Replies ({thread.replyCount})</h2>
        {thread.replies.map((reply) => (
          <Card key={reply.id}>
            <CardHeader className="flex-row items-start gap-3 space-y-0">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={`https://placehold.co/100x100.png`}
                  alt={reply.author.firstName}
                  data-ai-hint="professional headshot"
                />
                <AvatarFallback>
                  {reply.author.firstName[0]}
                  {reply.author.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">
                      {reply.author.firstName} {reply.author.lastName}
                    </span>
                    <span className="text-muted-foreground">
                      • {reply.timestamp}
                    </span>
                  </div>
                  {currentUser.id === reply.author.id && !editingPost && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            handleEditClick('reply', reply.id, reply.content)
                          }
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                 {editingPost === `reply-${reply.id}` ? (
                   <div className="space-y-2 mt-2">
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-base mt-1">{reply.content}</p>
                 )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Reply Form */}
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={`https://placehold.co/100x100.png`}
            alt={currentUser.firstName}
            data-ai-hint="person face"
          />
          <AvatarFallback>
            {currentUser.firstName[0]}
            {currentUser.lastName[0]}
          </AvatarFallback>
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
