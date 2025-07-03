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
import { mockEvents } from '@/lib/mock-data';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
        <p className="text-muted-foreground">
          Join us for our upcoming events and connect with the community.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockEvents.map((event) => (
          <Card key={event.id} className="flex flex-col overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={event.imageUrl}
                alt={event.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint="networking professional"
              />
            </div>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm">{event.description}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-accent hover:bg-accent/90">
                Register Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
