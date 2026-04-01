'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThumbsUp, MessageSquare, Share2, ExternalLink } from 'lucide-react';
import { mockLinkedInPosts } from '@/lib/mock-data';
import Image from 'next/image';
import { getSafeImageUrl } from '@/lib/utils';

export default function PostsPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        <p className="text-muted-foreground">
          See what our alumni community is sharing on professional networks.
        </p>
      </div>

      <div className="space-y-6">
        {mockLinkedInPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden border-muted/60">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
              <Avatar className="h-12 w-12 border">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-base truncate">{post.author.name}</p>
                  <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{post.author.headline}</p>
              </div>
            </CardHeader>
            <CardContent className="px-4 py-2">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
              {post.imageUrl && (
                <div className="mt-4 relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={getSafeImageUrl(post.imageUrl)}
                    alt="Post content"
                    fill
                    className="object-cover"
                    data-ai-hint="professional post"
                  />
                </div>
              )}
            </CardContent>
            <Separator className="mx-4 w-auto" />
            <CardFooter className="p-2 flex justify-between">
              <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground hover:text-primary">
                <ThumbsUp className="h-4 w-4" />
                <span>{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground hover:text-primary">
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground hover:text-primary">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground hover:text-primary">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">View on LinkedIn</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}