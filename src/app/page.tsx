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
import { AuthRedirect } from '@/components/auth/auth-redirect';
import { mockJobs, mockEvents, mockNews } from '@/lib/mock-data';
import { ArrowRight } from 'lucide-react';
import type { AppEvent, NewsArticle } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

export default function HomePage() {
  const events = mockEvents;
  const news = mockNews;

  const formatDate = (date: Timestamp | Date | string, f: string = 'MMMM d, yyyy') => {
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
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Connect, Grow, and Succeed with AlumniLink
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Your exclusive platform to network with fellow alumni, discover career opportunities, and stay connected with the university community.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">Join Now</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://old.ckpcet.ac.in/images/site/bg.jpg"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="diverse professionals networking"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        
        {/* Events Section */}
        <section id="events" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
             <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                 <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Upcoming Events</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Connect and Network</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join us for webinars, networking nights, and special events to connect with the community.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3">
              {events.slice(0, 3).map((event) => (
                 <Card key={event.id}>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{formatDate(event.date)} - {event.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{event.summary}</p>
                  </CardContent>
                  <CardFooter>
                     <Button variant="outline" className="w-full" asChild>
                        <AuthRedirect redirectUrl={`/dashboard/events`}>Learn More</AuthRedirect>
                     </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
             <div className="text-center">
                <Button asChild>
                  <AuthRedirect redirectUrl="/dashboard/events">View All Events <ArrowRight className="ml-2"/></AuthRedirect>
                </Button>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section id="news" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                 <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Community News</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Stay Informed</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Read the latest news and success stories from our vibrant alumni community.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3">
              {news.slice(0, 3).map((article) => (
                <Card key={article.id}>
                  <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                    <CardDescription>{article.source} - {formatDate(article.date)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{article.summary}</p>

                  </CardContent>
                   <CardFooter>
                     <Button variant="outline" className="w-full" asChild>
                      <AuthRedirect redirectUrl={`/dashboard/news/${article.id}`}>Read More</AuthRedirect>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
             <div className="text-center">
                <Button asChild>
                    <AuthRedirect redirectUrl="/dashboard/news">View All News <ArrowRight className="ml-2"/></AuthRedirect>
                </Button>
            </div>
          </div>
        </section>

        {/* Jobs Section */}
        <section id="jobs" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                 <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Latest Job Postings</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Find Your Next Opportunity</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore exclusive job openings from companies within the alumni network.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3">
              {mockJobs.slice(0, 3).map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>{job.company} - {job.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{job.shortDescription}</p>
                  </CardContent>
                  <CardFooter>
                     <Button variant="outline" className="w-full" asChild>
                      <AuthRedirect redirectUrl={`/dashboard/jobs`}>Apply Now</AuthRedirect>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
             <div className="text-center">
                <Button asChild>
                  <AuthRedirect redirectUrl="/dashboard/jobs">View All Jobs <ArrowRight className="ml-2"/></AuthRedirect>
                </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Reconnect?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join AlumniLink today and unlock a world of opportunities. Your network is waiting.
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
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 AlumniLink. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
