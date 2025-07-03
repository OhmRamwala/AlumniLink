import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockNews } from '@/lib/mock-data';
import { ArrowRight } from 'lucide-react';

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">News Feed</h1>
        <p className="text-muted-foreground">
          The latest news and stories from the alumni community.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockNews.map((article) => (
          <Card key={article.id} className="flex flex-col overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={article.imageUrl}
                alt={article.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint="community event"
              />
            </div>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
              <CardDescription>
                {article.source} - {article.date}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm">{article.summary}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="secondary" className="w-full">
                <Link href={article.url}>
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
