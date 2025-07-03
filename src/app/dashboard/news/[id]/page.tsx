
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { NewsArticle } from '@/lib/types';
import { format } from 'date-fns';

function NewsArticlePageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-48" />
      </div>
      <article>
        <Skeleton className="h-64 md:h-96 w-full mb-6 rounded-lg" />
        <header className="space-y-2 mb-6">
          <Skeleton className="h-10 w-3/4" />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
          </div>
        </header>
        <div className="space-y-4 prose max-w-none">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-full" />
        </div>
      </article>
    </div>
  );
}


export default function NewsArticlePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!db || !id) {
        setIsLoading(false);
        setError(true);
        return;
    };

    const fetchArticle = async () => {
      try {
        const articleDocRef = doc(db, 'news', id);
        const articleDoc = await getDoc(articleDocRef);
        
        if (articleDoc.exists()) {
          setArticle({ id, ...articleDoc.data() } as NewsArticle);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Firestore error fetching news article:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (error) {
    notFound();
  }

  if (isLoading) {
    return <NewsArticlePageSkeleton />;
  }

  if (!article) {
    notFound();
  }

  const formatDate = (date: Timestamp | Date | string) => {
    if (date instanceof Timestamp) {
      return format(date.toDate(), 'MMMM d, yyyy');
    }
    if (date instanceof Date) {
        return format(date, 'MMMM d, yyyy')
    }
    return date;
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
            src={article.imageUrl || 'https://placehold.co/600x400.png'}
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
              <span>{formatDate(article.date)}</span>
            </div>
          </div>
        </header>

        <div className="prose max-w-none dark:prose-invert whitespace-pre-wrap">
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
