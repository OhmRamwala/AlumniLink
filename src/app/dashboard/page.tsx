import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Newspaper, CalendarDays } from 'lucide-react';
import { mockNews, mockEvents } from '@/lib/mock-data';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, Emily!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s a quick look at what&apos;s happening in your network.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Latest News */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Newspaper className="h-6 w-6" />
              <CardTitle>Latest News</CardTitle>
            </div>
            <CardDescription>
              Stay updated with the latest from the community.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {mockNews.slice(0, 2).map((article) => (
              <div key={article.id} className="flex items-start gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-sm leading-snug">
                    {article.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {article.date}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-6 pt-0">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/news">
                View All News <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-6 w-6" />
              <CardTitle>Upcoming Events</CardTitle>
            </div>
            <CardDescription>
              Don&apos;t miss out on these upcoming events.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {mockEvents.slice(0, 2).map((event) => (
              <div key={event.id} className="flex items-start gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-sm leading-snug">
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {event.date} at {event.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-6 pt-0">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/events">
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
