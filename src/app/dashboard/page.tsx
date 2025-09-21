
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { format } from 'date-fns';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

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
  Users,
  Sparkles,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { User as UserProfile, NewsArticle, AppEvent, ForumThread, Job, DonationCampaign } from '@/lib/types';
import { AutoScrollList } from '@/components/layout/auto-scroll-list';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { cn } from '@/lib/utils';

function GlowingEffectDemo() {
  return (
    <Card className="flex flex-col lg:col-span-3">
        <CardHeader>
            <div className="flex items-start gap-3">
              <MessagesSquare className="h-7 w-7 mt-1" />
              <CardTitle>What's Happening?</CardTitle>
            </div>
            <CardDescription>
              Engage with the community and explore opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
             <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2 h-full">
              <GridItem
                area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                icon={<Briefcase className="h-4 w-4" />}
                title="Explore Job Opportunities"
                description="Find your next career move from postings within the alumni network."
              />
              <GridItem
                area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                icon={<Users className="h-4 w-4" />}
                title="Connect with Peers"
                description="Expand your professional network by connecting with fellow alumni."
              />
              <GridItem
                area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                icon={<HeartHandshake className="h-4 w-4" />}
                title="Support the University"
                description="Give back and help fund the next generation of innovators."
              />
              <GridItem
                area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                icon={<Sparkles className="h-4 w-4" />}
                title="Join Forum Discussions"
                description="Share your insights and engage in meaningful conversations."
              />
              <GridItem
                area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                icon={<CalendarDays className="h-4 w-4" />}
                title="Attend Upcoming Events"
                description="Participate in webinars, workshops, and networking nights."
              />
            </ul>
          </CardContent>
    </Card>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

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
        { name: 'news', setter: setNews, limit: 4, orderByField: 'date' },
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

  const newsItems = news.map((article) => ({
    id: article.id,
    href: `/dashboard/news/${article.id}`,
    title: article.title,
    date: formatDate(article.date),
  }));

  const eventItems = events.map((event) => ({
    id: event.id,
    href: `/dashboard/events`, // Or individual event page if available
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
            <CardContent className="flex-1 min-h-0">
              {donationCampaigns.length > 0 ? (
                  <div className="space-y-4">
                      {donationCampaigns.slice(0,3).map((campaign) => (
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
            <CardContent className="flex-1 min-h-0">
              <ScrollArea className="h-full pr-3">
                <div className="space-y-4">
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
                </div>
              </ScrollArea>
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
          <CardContent className="flex-1 min-h-0">
            {newsItems.length > 0 ? (
                <AutoScrollList items={newsItems} />
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
           <CardContent className="flex-1 min-h-0">
            {eventItems.length > 0 ? (
                <AutoScrollList items={eventItems} />
            ) : (
                <div className="p-6 pt-0">
                    <p className="text-sm text-muted-foreground">
                        No upcoming events to display.
                    </p>
                </div>
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
        <GlowingEffectDemo />
      </div>
    </div>
  );
}


    