
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

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
import type { User as UserProfile, NewsArticle, AppEvent, ForumThread, Job, DonationCampaign } from '@/lib/types';

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [donationCampaigns, setDonationCampaigns] = useState<DonationCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    if (!auth || !db) {
        setIsLoading(false);
        return;
    }

    const unsubscribers: (() => void)[] = [];

    const authUnsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setUserProfile({ id: user.uid, ...userDoc.data() } as UserProfile);
            }
        } else {
            setUserProfile(null);
        }
        setIsLoading(false);
    });
    unsubscribers.push(authUnsubscribe);

    const collectionsToFetch = [
        { name: 'news', setter: setNews, limit: 5, orderByField: 'date' },
        { name: 'events', setter: setEvents, limit: 3, orderByField: 'date' },
        { name: 'threads', setter: setThreads, limit: 2, orderByField: 'lastActivity' },
        { name: 'jobs', setter: setJobs, limit: 2, orderByField: 'postedAt' },
        { name: 'donations', setter: setDonationCampaigns, limit: 3, orderByField: 'createdAt' },
    ];

    collectionsToFetch.forEach(({ name, setter, limit: l, orderByField }) => {
        const q = query(collection(db!, name), orderBy(orderByField, 'desc'), limit(l));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setter(data as any);
        }, (error) => {
            console.error(`Error fetching ${name}:`, error);
        });
        unsubscribers.push(unsubscribe);
    });
    
    return () => {
        unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  const formatDate = (date: Timestamp | Date | string | undefined, fmt = 'MMM d, yyyy') => {
    if (!date) return '';
    if (date instanceof Timestamp) return format(date.toDate(), fmt);
    if (date instanceof Date) return format(date, fmt);
    return date;
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  }

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
        {userProfile.role === 'alumni' || userProfile.role === 'admin' ? (
          <Card className="flex flex-col lg:col-span-1">
            <CardHeader>
              <div className="flex items-start gap-3">
                <HeartHandshake className="h-7 w-7 mt-1" />
                <CardTitle>Support the University</CardTitle>
              </div>
              <CardDescription>
                Help fund the next generation of innovators.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                {donationCampaigns.length > 0 ? (
                    <ScrollArea className="h-48 pr-3">
                        <div className="space-y-4">
                            {donationCampaigns.map((campaign) => (
                                <div key={campaign.id} className="space-y-2">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-sm font-semibold truncate" title={campaign.title}>
                                            {campaign.title}
                                        </h3>
                                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                                            {formatCurrency(campaign.currentAmount)} / {formatCurrency(campaign.goalAmount)}
                                        </span>
                                    </div>
                                    <Progress value={(campaign.currentAmount / campaign.goalAmount) * 100} />
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        There are no active campaigns at the moment. Check back soon!
                    </p>
                )}
            </CardContent>
            <CardFooter>
                <Button
                  asChild
                  variant="outline"
                  className="w-full hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground"
                >
                    <Link href="/dashboard/donations">
                      Donate Now
                    </Link>
                </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="flex flex-col lg:col-span-1">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Briefcase className="h-7 w-7 mt-1" />
                <CardTitle>Recent Job Postings</CardTitle>
              </div>
              <CardDescription>
                Find your next career move from opportunities in the network.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              {jobs.map((job) => (
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

        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Newspaper className="h-7 w-7 mt-1" />
              <CardTitle>Latest News</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            {news.length > 0 ? (
                 <Carousel
                    orientation="vertical"
                    opts={{ align: 'start', loop: true }}
                    plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
                    className="w-full h-40"
                 >
                    <CarouselContent className="h-full">
                    {news.map((article) => (
                        <CarouselItem key={article.id} className="pt-2 md:basis-1/2">
                            <div className="flex items-start gap-4">
                                <div className="space-y-1">
                                    <Link href={`/dashboard/news/${article.id}`} className="font-semibold text-sm leading-snug hover:underline">
                                        {article.title}
                                    </Link>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(article.date)}
                                    </p>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                 </Carousel>
            ) : (
                 <p className="text-sm text-muted-foreground">
                    No recent news to display.
                 </p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/news">
                View All News <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-start gap-3">
              <CalendarDays className="h-7 w-7 mt-1" />
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

        <Card className="flex flex-col lg:col-span-3">
          <CardHeader>
            <div className="flex items-start gap-3">
              <MessagesSquare className="h-7 w-7 mt-1" />
              <CardTitle>Recent Forum Discussions</CardTitle>
            </div>
            <CardDescription>
              Join the conversation and share your insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {threads.map((thread) => (
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
                    Started by {thread.postedBy.firstName}{' '}
                    {thread.postedBy.lastName}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p>{thread.replyCount} replies</p>
                  <p className="text-muted-foreground">{formatDate(thread.lastActivity, 'MMM d')}</p>
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

    