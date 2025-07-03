
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { format } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Newspaper,
  CalendarDays,
  HeartHandshake,
  MessagesSquare,
  Briefcase,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { mockJobs, mockThreads } from '@/lib/mock-data';
import type { User as UserProfile, NewsArticle, AppEvent } from '@/lib/types';

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          }

          // Fetch latest news
          const newsQuery = query(collection(db, 'news'), orderBy('date', 'desc'), limit(3));
          const newsSnapshot = await getDocs(newsQuery);
          setNews(newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsArticle)));

          // Fetch latest events
          const eventsQuery = query(collection(db, 'events'), orderBy('date', 'desc'), limit(3));
          const eventsSnapshot = await getDocs(eventsQuery);
          setEvents(eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppEvent)));

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            // In case of permission errors, we can land here.
            // Set data to empty arrays to prevent crash.
            setNews([]);
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
      } else {
        // No user logged in
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (date: Timestamp | Date | string) => {
    if (date instanceof Timestamp) return format(date.toDate(), 'MMM d, yyyy');
    if (date instanceof Date) return format(date, 'MMM d, yyyy');
    return date;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to your dashboard!
        </h1>
        <p className="text-muted-foreground">
          Could not load user profile. Please try logging in again.
        </p>
        <Button asChild className="mt-4">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {userProfile.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s a quick look at what&apos;s happening in your network.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Conditional Cards for Alumni vs. Student */}
        {userProfile.role === 'alumni' || userProfile.role === 'admin' ? (
          <Card className="flex flex-col lg:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <HeartHandshake className="h-6 w-6" />
                <CardTitle>Support the University</CardTitle>
              </div>
              <CardDescription>
                Help fund the next generation of innovators.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-semibold">
                    New Science Lab Initiative
                  </h3>
                  <span className="text-sm font-medium text-muted-foreground">
                    $7,500 / $10,000
                  </span>
                </div>
                <Progress value={75} />
                <p className="text-xs text-muted-foreground">
                  Your contributions help us build state-of-the-art facilities
                  for our students.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-accent hover:bg-accent/90">
                Donate Now
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="flex flex-col lg:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="h-6 w-6" />
                <CardTitle>Recent Job Postings</CardTitle>
              </div>
              <CardDescription>
                Find your next career move from opportunities in the network.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              {mockJobs.slice(0, 2).map((job) => (
                <div key={job.id}>
                  <p className="font-semibold text-sm leading-snug">
                    {job.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {job.company}
                  </p>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/jobs">
                  View All Jobs <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Latest News */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Newspaper className="h-6 w-6" />
              <CardTitle>Latest News</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {news.map((article) => (
              <div key={article.id} className="flex items-start gap-4">
                <div className="space-y-1">
                  <Link
                    href={`/dashboard/news/${article.id}`}
                    className="font-semibold text-sm leading-snug hover:underline"
                  >
                    {article.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(article.date)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/news">
                View All News <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Upcoming Events */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-6 w-6" />
              <CardTitle>Upcoming Events</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-start gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-sm leading-snug">
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(event.date)} at {event.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/events">
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Forum Activity */}
        <Card className="flex flex-col lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessagesSquare className="h-6 w-6" />
              <CardTitle>Recent Forum Discussions</CardTitle>
            </div>
            <CardDescription>
              Join the conversation and share your insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {mockThreads.slice(0, 2).map((thread) => (
              <div
                key={thread.id}
                className="flex justify-between items-center"
              >
                <div>
                  <Link
                    href={`/dashboard/forum/${thread.id}`}
                    className="font-semibold text-sm hover:underline"
                  >
                    {thread.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Started by {thread.author.firstName}{' '}
                    {thread.author.lastName}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p>{thread.replyCount} replies</p>
                  <p className="text-muted-foreground">{thread.timestamp}</p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/forum">
                Go to Forum <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
