import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockNews } from '@/lib/mock-data';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export default function NewsArticlePage({ params }: { params: { id: string } }) {
  const article = mockNews.find((a) => a.id === params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild>
          <Link href="/dashboard/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News Feed
          </Link>
        </Button>
      </div>

      <article>
        <div className="relative h-64 md:h-96 w-full mb-6 rounded-lg overflow-hidden">
           <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            data-ai-hint="article header"
          />
        </div>

        <header className="space-y-2 mb-6">
          <h1 className="text-4xl font-bold tracking-tight">{article.title}</h1>
           <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
             <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{article.source}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{article.date}</span>
            </div>
          </div>
        </header>

        <div className="prose max-w-none dark:prose-invert">
          <p>{article.content}</p>
        </div>
      </article>

       <div className="pt-6 border-t">
        <Button variant="outline" asChild>
          <Link href="/dashboard/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to News Feed
          </Link>
        </Button>
       </div>
    </div>
  );
}
