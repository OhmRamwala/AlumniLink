
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { format } from 'date-fns';
import { mockLinkedInPosts } from '@/lib/mock-data';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowRight,
  Newspaper,
  CalendarDays,
  HeartHandshake,
  MessagesSquare,
  Briefcase,
  Users,
  Share2,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { User as UserProfile, NewsArticle, AppEvent, ForumThread, Job, DonationCampaign } from '@/lib/types';
import { AutoScrollList } from '@/components/layout/auto-scroll-list';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

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
            const userDocRef = doc(db!, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setUserProfile({ id: user.uid, ...userDoc.data() } as UserProfile);
                
                const collectionsToFetch = [
                    { name: 'news', setter: setNews, limit: 4, orderByField: 'date' },
                    { name: 'events', setter: setEvents, limit: 3, orderByField: 'date' },
                    { name: 'threads', setter: setThreads, limit: 2, orderByField: 'lastActivity' },
                    { name: 'jobs', setter: setJobs, limit: 2, orderByField: 'postedAt' },
                    { name: 'donations', setter: setDonationCampaigns, limit: 3, orderByField: 'createdAt' },
                ];

                collectionsToFetch.forEach(({ name, setter, limit: l, orderByField }) => {
                    const colRef = collection(db!, name);
                    const q = query(colRef, orderBy(orderByField, 'desc'), limit(l));
                    const unsubscribe = onSnapshot(q, (snapshot) => {
                        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        setter(data as any);
                    }, async (serverError) => {
                        const permissionError = new FirestorePermissionError({
                            path: colRef.path,
                            operation: 'list',
                        });
                        errorEmitter.emit('permission-error', permissionError);
                    });
                    unsubscribers.push(unsubscribe);
                });
            }
        } else {
            setUserProfile(null);
        }
        setIsLoading(false);
    });
    unsubscribers.push(authUnsubscribe);
    
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
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-7 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to your dashboard!</h1>
        <Button asChild className="mt-4">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  const newsItems = news.map((article) => ({
    id: article.id,
    href: `/dashboard/news/${article.id}`,
    title: article.title,
    date: formatDate(article.date),
  }));

  const eventItems = events.map((event) => ({
    id: event.id,
    href: `/dashboard/events`,
    title: event.title,
    date: `${formatDate(event.date)} at ${event.time}`,
  }));

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
        {/* Support/Jobs Section */}
        <Card className="flex flex-col h-full border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-start gap-3">
              {(userProfile.role === 'alumni' || userProfile.role === 'admin') ? (
                <>
                  <HeartHandshake className="h-7 w-7 mt-1 text-primary" />
                  <CardTitle>Support the University</CardTitle>
                </>
              ) : (
                <>
                  <Briefcase className="h-7 w-7 mt-1 text-primary" />
                  <CardTitle>Recent Job Postings</CardTitle>
                </>
              )}
            </div>
            <CardDescription>
              {(userProfile.role === 'alumni' || userProfile.role === 'admin') 
                ? "Help fund the next generation of innovators."
                : "Find your next career move from opportunities in the network."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
             {(userProfile.role === 'alumni' || userProfile.role === 'admin') ? (
                <div className="space-y-4">
                  {donationCampaigns.slice(0,2).map((campaign) => (
                    <div key={campaign.id} className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="truncate">{campaign.title}</span>
                        <span className="text-muted-foreground whitespace-nowrap ml-2">
                          {formatCurrency(campaign.currentAmount)} / {formatCurrency(campaign.goalAmount)}
                        </span>
                      </div>
                      <Progress value={(campaign.currentAmount / campaign.goalAmount) * 100} className="h-1.5" />
                    </div>
                  ))}
                </div>
             ) : (
                <div className="space-y-3">
                  {jobs.slice(0,3).map((job) => (
                    <div key={job.id} className="text-sm">
                      <p className="font-semibold truncate">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.company}</p>
                    </div>
                  ))}
                </div>
             )}
          </CardContent>
          <CardFooter>
             <Button asChild className="w-full">
                <Link href={(userProfile.role === 'alumni' || userProfile.role === 'admin') ? "/dashboard/donations" : "/dashboard/jobs"}>
                  {(userProfile.role === 'alumni' || userProfile.role === 'admin') ? "Donate Now" : "View All Jobs"}
                </Link>
             </Button>
          </CardFooter>
        </Card>

        {/* News Section */}
        <Card className="flex flex-col h-full">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Newspaper className="h-7 w-7 mt-1 text-primary" />
              <CardTitle>Latest News</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-[150px]">
            {newsItems.length > 0 ? (
                <AutoScrollList items={newsItems} />
            ) : (
                <p className="text-sm text-muted-foreground">No recent news to display.</p>
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

        {/* Events Section */}
        <Card className="flex flex-col h-full">
          <CardHeader>
            <div className="flex items-start gap-3">
              <CalendarDays className="h-7 w-7 mt-1 text-primary" />
              <CardTitle>Upcoming Events</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-[150px]">
            {eventItems.length > 0 ? (
                <AutoScrollList items={eventItems} />
            ) : (
                <p className="text-sm text-muted-foreground">No upcoming events to display.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/events">
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Posts Highlights */}
        <Card className="lg:col-span-1 flex flex-col h-full">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Share2 className="h-7 w-7 mt-1 text-primary" />
              <CardTitle>Posts</CardTitle>
            </div>
            <CardDescription>Social highlights from our alumni.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {mockLinkedInPosts.slice(0, 2).map((post) => (
              <div key={post.id} className="space-y-2 border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">{post.author.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{post.author.headline}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{post.content}</p>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/posts">
                See All Posts <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Forum Discussions */}
        <Card className="lg:col-span-2 flex flex-col h-full">
          <CardHeader>
            <div className="flex items-start gap-3">
              <MessagesSquare className="h-7 w-7 mt-1 text-primary" />
              <CardTitle>Recent Forum Discussions</CardTitle>
            </div>
            <CardDescription>Engage with the latest topics and share your insights.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <ScrollArea className="h-full pr-3">
              <div className="space-y-4">
                {threads.map((thread) => (
                  <div key={thread.id} className="group">
                    <Link href={`/dashboard/forum/${thread.id}`} className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">
                      {thread.title}
                    </Link>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                      <span>by {thread.postedBy.firstName} {thread.postedBy.lastName}</span>
                      <Separator orientation="vertical" className="h-2" />
                      <span>{thread.replyCount} replies</span>
                      <Separator orientation="vertical" className="h-2" />
                      <span>{formatDate(thread.lastActivity, 'MMM d')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
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
