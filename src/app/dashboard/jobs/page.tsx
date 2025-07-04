
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  serverTimestamp,
  doc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, PlusCircle, Loader2, Pencil, Trash2 } from 'lucide-react';
import { JobSummary } from '@/components/jobs/job-summary';
import type { Job, User as UserProfile } from '@/lib/types';

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  company: z.string().min(1, 'Company is required.'),
  location: z.string().min(1, 'Location is required.'),
  type: z.enum(['Full-time', 'Part-time', 'Internship']),
  shortDescription: z.string().min(1, 'Short description is required.'),
  fullDescription: z.string().min(1, 'Full description is required.'),
  url: z.string().url('Must be a valid URL.'),
});
type JobFormValues = z.infer<typeof jobSchema>;

function JobFormDialog({ job, userProfile, onSave }: { job?: Job, userProfile: UserProfile | null, onSave: () => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!job;

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: isEditMode ? job : {
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      shortDescription: '',
      fullDescription: '',
      url: ''
    },
  });
  
  useEffect(() => {
    if (isEditMode) {
      form.reset(job);
    }
  }, [job, form, isEditMode]);

  async function onSubmit(values: JobFormValues) {
    if (!db || !userProfile) return;
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        const jobRef = doc(db, 'jobs', job.id);
        await updateDoc(jobRef, values);
        toast({ title: 'Success', description: 'Job updated.' });
      } else {
        await addDoc(collection(db, 'jobs'), {
          ...values,
          postedAt: serverTimestamp(),
          postedBy: {
            id: userProfile.id,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
          },
        });
        toast({ title: 'Success', description: 'Job posted.' });
      }
      setOpen(false);
      form.reset();
      onSave();
    } catch (error) {
      console.error('Error saving job:', error);
      let description = 'Failed to save job.';
      if (error instanceof Error && 'code' in error && (error as any).code === 'permission-denied') {
          description = 'Permission denied. Ensure you are an admin and Firestore rules are set correctly.';
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: description,
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
      Post a Job
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit' : 'Post a New'} Job Opening</DialogTitle>
          <DialogDescription>
            Share an opportunity with the network. Fill out the details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="company" render={({ field }) => (
                <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="e.g., Acme Inc." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., New York, NY or Remote" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem><FormLabel>Job Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="shortDescription" render={({ field }) => (
                <FormItem><FormLabel>Short Description</FormLabel><FormControl><Textarea placeholder="A brief summary of the role." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="fullDescription" render={({ field }) => (
                <FormItem><FormLabel>Full Job Description</FormLabel><FormControl><Textarea rows={8} placeholder="Provide a detailed description of the role, responsibilities, and qualifications." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="url" render={({ field }) => (
                <FormItem><FormLabel>Application URL</FormLabel><FormControl><Input type="url" placeholder="https://example.com/apply" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Save Changes' : 'Post Job'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const { toast } = useToast();

  const jobTypes: Job['type'][] = ['Full-time', 'Part-time', 'Internship'];

  const fetchJobs = () => {
    if (!db) return;
    const q = query(collection(db, 'jobs'), orderBy('postedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const jobsData: Job[] = [];
      querySnapshot.forEach((doc) => {
        jobsData.push({ id: doc.id, ...doc.data() } as Job);
      });
      setJobs(jobsData);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching jobs:', error);
      setIsLoading(false);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (!auth || !db) {
      setIsLoading(false);
      return;
    }
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserProfile({ id: user.uid, ...userDoc.data() } as UserProfile);
        }
      }
      const unsubscribeFirestore = fetchJobs();
      return () => {
        if (unsubscribeFirestore) unsubscribeFirestore();
      };
    });

    return () => unsubscribeAuth();
  }, []);

  const handleDeleteJob = async (jobId: string) => {
    if (!db) return;
    const isConfirmed = window.confirm("Are you sure you want to delete this job posting?");
    if (!isConfirmed) return;

    try {
        await deleteDoc(doc(db, "jobs", jobId));
        toast({ title: 'Success', description: 'Job posting has been deleted.' });
    } catch (error) {
        console.error("Error deleting job posting: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete job posting.' });
    }
  };

  const handleFilterChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const filteredJobs = jobs.filter((job) => {
    if (selectedTypes.length === 0) {
      return true;
    }
    return selectedTypes.includes(job.type);
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2 mt-2" /></CardHeader>
              <CardContent><Skeleton className="h-16 w-full" /></CardContent>
              <CardFooter><Skeleton className="h-10 w-32" /></CardFooter>
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
          <h1 className="text-3xl font-bold tracking-tight">Job Board</h1>
          <p className="text-muted-foreground">
            Find your next opportunity from companies in our network.
          </p>
        </div>
        {(userProfile?.role === 'admin' || userProfile?.role === 'alumni') && <JobFormDialog userProfile={userProfile} onSave={fetchJobs} />}
      </div>
      <div className="grid md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] gap-8 items-start">
        <aside className="sticky top-20">
          <Card>
            <CardHeader>
              <CardTitle>Filter by Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {jobTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => handleFilterChange(type)}
                  />
                  <label
                    htmlFor={type}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>

        <main>
          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id}>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-start gap-4 p-6">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <CardTitle>{job.title}</CardTitle>
                        <Badge
                          variant={
                            job.type === 'Internship'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {job.type}
                        </Badge>
                      </div>
                      <CardDescription className="flex flex-wrap items-center gap-x-2">
                        <span>{job.company}</span>
                        <span className="text-muted-foreground/50">|</span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                      </CardDescription>
                      <p className="text-sm text-muted-foreground pt-2 line-clamp-2">
                        {job.shortDescription}
                      </p>
                      {job.postedBy && (
                        <div className="text-xs text-muted-foreground pt-2">
                          Posted by{' '}
                          <Link
                            href={`/dashboard/directory/${job.postedBy.id}`}
                            className="font-semibold text-primary hover:underline"
                          >
                            {job.postedBy.firstName} {job.postedBy.lastName}
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row md:flex-col gap-2 items-stretch shrink-0 w-full md:w-auto">
                      <JobSummary job={job} />
                      {userProfile &&
                        (userProfile.role === 'admin' ||
                          (job.postedBy &&
                            userProfile.id === job.postedBy.id)) && (
                          <div className="flex items-center justify-end gap-1">
                            <JobFormDialog
                              job={job}
                              userProfile={userProfile}
                              onSave={fetchJobs}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteJob(job.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center py-20 text-center">
              <CardContent>
                  <h3 className="text-xl font-semibold">No Jobs Found</h3>
                  <p className="text-muted-foreground mt-2">
                    There are no job postings matching your current filters.
                  </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
