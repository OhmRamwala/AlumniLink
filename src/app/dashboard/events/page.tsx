'use client';
import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { mockEvents } from '@/lib/mock-data';
import { Calendar, Clock, MapPin } from 'lucide-react';
import type { AppEvent } from '@/lib/types';

function EventDetailsDialog({ event }: { event: AppEvent }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-accent hover:bg-accent/90">
          Register Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>{event.summary}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <p className="text-sm">{event.description}</p>
        </div>
        <DialogFooter>
          <Button asChild className="w-full">
            <a href={event.url} target="_blank" rel="noopener noreferrer">
              RSVP on Event Page
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
                fill
                className="object-cover"
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
            <div className="p-6 pt-0">
              <EventDetailsDialog event={event} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
