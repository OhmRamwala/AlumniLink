
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

import type { AppEvent, User as UserProfile } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, MapPin, PlusCircle, Loader2, Pencil, Trash2 } from 'lucide-react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { cn, getSafeImageUrl } from '@/lib/utils';

const allowedImageHosts = ['i.ibb.co', 'ibb.co', 'placehold.co', 'firebasestorage.googleapis.com'];

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  time: z.string().min(1, 'Time is required.'),
  location: z.string().min(1, 'Location is required.'),
  summary: z.string().min(1, 'Summary is required.').max(160, 'Summary must be 160 characters or less.'),
  description: z.string().min(1, 'Description is required.').max(700, 'Description must be 700 characters or less.'),
  url: z.string().url('Must be a valid URL.'),
  imageUrl: z.string().url('Must be a valid URL.').optional().or(z.literal('')).refine(url => {
    if (!url) return true;
    try {
      const { hostname } = new URL(url);
      return allowedImageHosts.some(allowedHost => hostname.endsWith(allowedHost));
    } catch {
      return false;
    }
  }, { message: 'Invalid image host. Please use a valid host like imgbb.co.' }),
  date: z.date({ required_error: 'A date is required.' }),
});
type EventFormValues = z.infer<typeof eventSchema>;

function EventFormDialog({ event, onFormSubmit }: { event?: AppEvent, onFormSubmit: () => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!event;

  const getInitialDate = () => {
    if (isEditMode && event.date) {
      if (event.date instanceof Timestamp) return event.date.toDate();
      if (typeof event.date === 'string') return new Date(event.date);
      return event.date;
    }
    return undefined;
  };
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: isEditMode
      ? { ...event, date: getInitialDate(), imageUrl: event.imageUrl || '' }
      : { title: '', time: '', location: '', summary: '', description: '', url: '', imageUrl: '' },
  });

  useEffect(() => {
    if (isEditMode) {
      form.reset({ ...event, date: getInitialDate(), imageUrl: event.imageUrl || '' });
    }
  }, [event, form, isEditMode]);

  async function onSubmit(values: EventFormValues) {
    if (!db) return;
    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...values,
        date: Timestamp.fromDate(values.date),
      };

      if (isEditMode) {
        const eventRef = doc(db, 'events', event.id);
        await updateDoc(eventRef, dataToSave);
        toast({ title: 'Success', description: 'Event updated.' });
      } else {
        await addDoc(collection(db, 'events'), dataToSave);
        toast({ title: 'Success', description: 'Event created.' });
      }
      
      onFormSubmit();
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error saving event:', error);
      let description = 'Failed to save event.';
       if (error instanceof Error && 'code' in error && (error as any).code === 'permission-denied') {
         description = 'Permission denied. Ensure you are an admin and Firestore rules are set correctly.';
       }
      toast({
        variant: 'destructive',
        title: 'Error',
        description,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const triggerButton = isEditMode ? (
    <Button variant="ghost" size="icon">
      <Pencil className="h-4 w-4" />
    </Button>
  ) : (
    <Button>
      <PlusCircle className="mr-2 h-4 w-4" />
      Create Event
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit' : 'Create'} Event</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update event details below.' : 'Share a new event with the community.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover><PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn("w-full justify-start pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarPicker mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date("1900-01-01")} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
              )} />
              <FormField control={form.control} name="time" render={({ field }) => (
                  <FormItem><FormLabel>Time</FormLabel><FormControl><Input placeholder="e.g. 6:00 PM" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
             <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g. Grand Ballroom or Online" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="summary" render={({ field }) => (
                <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <div className="flex justify-between">
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">{form.watch('summary')?.length || 0} / 160</p>
                    </div>
                </FormItem>
            )} />
             <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea rows={5} {...field} /></FormControl>
                    <div className="flex justify-between">
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">{form.watch('description')?.length || 0} / 700</p>
                    </div>
                </FormItem>
            )} />
             <FormField control={form.control} name="url" render={({ field }) => (
                <FormItem><FormLabel>RSVP/Event URL</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem><FormLabel>Image URL (Optional)</FormLabel><FormControl><Input placeholder="https://placehold.co/600x400.png" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Save Changes' : 'Create Event'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function EventDetailsDialog({ event }: { event: AppEvent }) {
  const formatDate = (date: Timestamp | Date | string) => {
    if (date instanceof Timestamp) return format(date.toDate(), 'MMMM d, yyyy');
    if (date instanceof Date) return format(date, 'MMMM d, yyyy');
    return date;
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
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
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <p className="text-sm whitespace-pre-wrap">{event.description}</p>
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
    const [events, setEvents] = useState<AppEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (!auth) return;
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user && db) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setUserProfile(userDoc.data() as UserProfile);
                }
            } else {
                setUserProfile(null);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!db) {
            setIsLoading(false);
            return;
        }
        const q = query(collection(db, 'events'), orderBy('date', 'desc'));
        const unsubscribeEvents = onSnapshot(q, (querySnapshot) => {
            const eventsData: AppEvent[] = [];
            querySnapshot.forEach((doc) => {
              eventsData.push({ id: doc.id, ...doc.data() } as AppEvent);
            });
            setEvents(eventsData);
            setIsLoading(false);
          },
          (error) => {
            console.error('Error fetching events:', error);
            setIsLoading(false);
          }
        );

        return () => unsubscribeEvents();
    }, []);

    const handleDeleteEvent = async (eventId: string) => {
        if (!db) return;
        const isConfirmed = window.confirm("Are you sure you want to delete this event?");
        if (!isConfirmed) return;

        try {
            await deleteDoc(doc(db, "events", eventId));
            toast({ title: 'Success', description: 'Event has been deleted.' });
        } catch (error) {
            console.error("Error deleting event: ", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete event.' });
        }
    };

  const formatDate = (date: Timestamp | Date | string) => {
    if (date instanceof Timestamp) return format(date.toDate(), 'MMMM d, yyyy');
    if (date instanceof Date) return format(date, 'MMMM d, yyyy');
    return date;
  };
  
  if (isLoading) {
    return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardHeader><Skeleton className="h-6 w-full" /><Skeleton className="h-4 w-1/2" /></CardHeader>
                <CardContent><Skeleton className="h-12 w-full" /></CardContent>
                <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
              </Card>
            ))}
          </div>
        </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
            <p className="text-muted-foreground">
            Join us for our upcoming events and connect with the community.
            </p>
        </div>
        {userProfile?.role === 'admin' && <EventFormDialog onFormSubmit={() => {}}/>}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="flex flex-col overflow-hidden">
            <div className="relative h-48 w-full bg-muted">
              <Image
                src={getSafeImageUrl(event.imageUrl)}
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
                  <span>{formatDate(event.date)}</span>
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
              <p className="text-sm text-muted-foreground line-clamp-3">{event.summary}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-6 pt-0">
              <EventDetailsDialog event={event} />
              {userProfile?.role === 'admin' && (
                <div className="flex items-center ml-2">
                  <EventFormDialog event={event} onFormSubmit={() => {}} />
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(event.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

    