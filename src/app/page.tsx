import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/layout/public-header';
import { HeroCarousel } from '@/components/layout/hero-carousel';
import { AuthRedirect } from '@/components/auth/auth-redirect';
import { ArrowRight, Users, BookUser, MapPin, User, Facebook, Twitter, Instagram, Linkedin, Link2 } from 'lucide-react';
import type { AppEvent, NewsArticle, Job } from '@/lib/types';
import { collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { format } from 'date-fns';
import { mockEvents, mockNews, mockJobs } from '@/lib/mock-data';

export default async function HomePage() {

  let events: AppEvent[] = [];
  let news: NewsArticle[] = [];
  let jobs: Job[] = [];

  if (isFirebaseConfigured && db) {
    try {
      const eventsQuery = query(collection(db, 'events'), orderBy('date', 'desc'), limit(3));
      const newsQuery = query(collection(db, 'news'), orderBy('date', 'desc'), limit(3));
      const jobsQuery = query(collection(db, 'jobs'), orderBy('postedAt', 'desc'), limit(3));

      const [eventsSnapshot, newsSnapshot, jobsSnapshot] = await Promise.all([
        getDocs(eventsQuery),
        getDocs(newsQuery),
        getDocs(jobsQuery),
      ]);

      events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as AppEvent);
      news = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as NewsArticle);
      jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Job);
    } catch (error) {
      console.error("Error fetching data from Firestore, falling back to mock data:", error);
      // Fallback to mock data if Firestore fails
      events = mockEvents.slice(0, 3);
      news = mockNews.slice(0, 3);
      jobs = mockJobs.slice(0, 3);
    }
  } else {
    // Use mock data if Firebase is not configured
    events = mockEvents.slice(0, 3);
    news = mockNews.slice(0, 3);
    jobs = mockJobs.slice(0, 3);
  }

  const formatDate = (date: Timestamp | Date | string, f: string = 'MMMM d, yyyy') => {
    if (!date) return ''; // Handle cases where date might be undefined
    if (date instanceof Timestamp) return format(date.toDate(), f);
    if (date instanceof Date) return format(date, f);
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return format(parsedDate, f);
      }
    }
    return String(date); // Fallback for unparseable dates
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <HeroCarousel />
        
        {/* Events Section */}
        <section id="events" className="w-full py-12 md:py-16 lg:py-20 bg-secondary/50">
          <div className="container px-4 md:px-6">
             <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                 <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Upcoming Events</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Connect and Network</h2>
                <p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join us for webinars, networking nights, and special events to connect with the community.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3">
              {events.length > 0 ? events.map((event) => (
                 <Card key={event.id} className="flex flex-col">
                   <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                    <Image
                      src={event.imageUrl || 'https://ckpcet.ac.in/img/home-page/video-section/01Entry_03.jpg'}
                      alt={event.title}
                      fill
                      className="object-cover"
                      data-ai-hint="networking professional"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{formatDate(event.date)} - {event.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">{event.summary}</p>
                  </CardContent>
                  <CardFooter>
                     <Button variant="outline" className="w-full" asChild>
                        <AuthRedirect redirectUrl={`/dashboard/events`}>Learn More</AuthRedirect>
                     </Button>
                  </CardFooter>
                </Card>
              )) : (
                <p className="col-span-full text-center text-muted-foreground">No upcoming events found.</p>
              )}
            </div>
             <div className="text-center">
                <Button asChild>
                  <AuthRedirect redirectUrl="/dashboard/events">View All Events <ArrowRight className="ml-2"/></AuthRedirect>
                </Button>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section id="news" className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                 <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Community News</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Stay Informed</h2>
                <p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Read the latest news and success stories from our vibrant alumni community.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3">
              {news.length > 0 ? news.map((article) => (
                <Card key={article.id} className="flex flex-col">
                   <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                      <Image
                        src={article.imageUrl || 'https://ckpcet.ac.in/img/home-page/video-section/01Entry_03.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover"
                        data-ai-hint="community news"
                      />
                  </div>
                  <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                    <CardDescription>{article.source} - {formatDate(article.date)}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">{article.summary}</p>

                  </CardContent>
                   <CardFooter>
                     <Button variant="outline" className="w-full" asChild>
                      <AuthRedirect redirectUrl={`/dashboard/news/${article.id}`}>Read More</AuthRedirect>
                    </Button>
                  </CardFooter>
                </Card>
              )) : (
                <p className="col-span-full text-center text-muted-foreground">No recent news found.</p>
              )}
            </div>
             <div className="text-center">
                <Button asChild>
                    <AuthRedirect redirectUrl="/dashboard/news">View All News <ArrowRight className="ml-2"/></AuthRedirect>
                </Button>
            </div>
          </div>
        </section>

        {/* Jobs Section */}
        <section id="jobs" className="w-full py-12 md:py-16 lg:py-20 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                 <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Latest Job Postings</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Find Your Next Opportunity</h2>
                <p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore exclusive job openings from companies within the alumni network.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3">
              {jobs.length > 0 ? jobs.map((job) => (
                <Card key={job.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>{job.company} - {job.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">{job.shortDescription}</p>
                  </CardContent>
                  <CardFooter>
                     <Button variant="outline" className="w-full" asChild>
                      <AuthRedirect redirectUrl={`/dashboard/jobs`}>Apply Now</AuthRedirect>
                    </Button>
                  </CardFooter>
                </Card>
              )) : (
                 <p className="col-span-full text-center text-muted-foreground">No job postings found.</p>
              )}
            </div>
             <div className="text-center">
                <Button asChild>
                  <AuthRedirect redirectUrl="/dashboard/jobs">View All Jobs <ArrowRight className="ml-2"/></AuthRedirect>
                </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">About Us</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">CKPCET Alumni Association</h2>
                <p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The CKPCET Alumni Association is dedicated to fostering a lifelong community among alumni. Our mission is to strengthen the bond between alumni and the institution, support current students, and provide valuable networking and career opportunities. We envision a vibrant, global network where every member feels connected, supported, and proud to be a part of the CKPCET family.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 border-t">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Reconnect?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join AlumniConnect today and unlock a world of opportunities. Your network is waiting.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-x-2">
               <Button asChild size="lg">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-secondary/50 border-t">
        <div className="container py-12 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="space-y-4">
                <Link href="/" className="flex items-center gap-2">
                  <Link2 className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold">AlumniConnect</span>
                </Link>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Fostering a lifelong community for CKPCET students and alumni.
                </p>
                <div className="flex gap-4">
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <Facebook className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <Instagram className="h-5 w-5" />
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
                <div className="space-y-2">
                  <h4 className="font-semibold">Quick Links</h4>
                  <ul className="space-y-1">
                    <li><Link href="/#events" className="text-sm text-muted-foreground hover:text-foreground">Events</Link></li>
                    <li><Link href="/#news" className="text-sm text-muted-foreground hover:text-foreground">News</Link></li>
                    <li><Link href="/#jobs" className="text-sm text-muted-foreground hover:text-foreground">Jobs</Link></li>
                    <li><Link href="/#about" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Resources</h4>
                  <ul className="space-y-1">
                    <li><AuthRedirect redirectUrl="/dashboard/directory" className="text-sm text-muted-foreground hover:text-foreground">Alumni Directory</AuthRedirect></li>
                    <li><AuthRedirect redirectUrl="/dashboard/forum" className="text-sm text-muted-foreground hover:text-foreground">Forum</AuthRedirect></li>
                    <li><AuthRedirect redirectUrl="/dashboard/donations" className="text-sm text-muted-foreground hover:text-foreground">Give Back</AuthRedirect></li>
                    <li><Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">Login/Register</Link></li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Contact Us</h4>
                  <address className="not-italic text-sm text-muted-foreground space-y-1">
                    <p>CK Pithawalla College of Engg. & Tech.</p>
                    <p>Surat, Gujarat, India</p>
                    <p>Email: <a href="mailto:info@ckpcet.ac.in" className="hover:text-foreground">info@ckpcet.ac.in</a></p>
                  </address>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-xs text-muted-foreground">&copy; 2025 AlumniConnect. All rights reserved.</p>
                <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
                  <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
                    Terms of Service
                  </Link>
                  <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
                    Privacy
                  </Link>
                </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
