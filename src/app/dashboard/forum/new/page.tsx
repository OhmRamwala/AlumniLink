'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Image as ImageIcon, Video, Link as LinkIcon } from 'lucide-react';

export default function NewThreadPage() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd handle form submission to your backend here.
        // For now, we'll just navigate back to the forum page.
        router.push('/dashboard/forum');
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

      <form onSubmit={handleSubmit}>
        <Card>
            <CardHeader>
                <CardTitle>Start a New Discussion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="What's on your mind?" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" placeholder="Share more details here..." rows={10} required />
                </div>
                 <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Attachments (Optional)</h3>
                  <div className="space-y-2">
                    <Label htmlFor="image-url">Image URL</Label>
                     <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="image-url" placeholder="https://example.com/image.png" className="pl-10" />
                    </div>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="video-url">Video URL (e.g., YouTube, Vimeo)</Label>
                     <div className="relative">
                        <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="video-url" placeholder="https://youtube.com/watch?v=..." className="pl-10" />
                    </div>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="external-link">External Link</Label>
                     <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="external-link" placeholder="https://example.com/article" className="pl-10" />
                    </div>
                  </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit">Post Thread</Button>
            </CardFooter>
        </Card>
      </form>
    </div>
  );
}
