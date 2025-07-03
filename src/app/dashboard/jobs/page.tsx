'use client';
import { useState } from 'react';
import Link from 'next/link';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockJobs } from '@/lib/mock-data';
import { MapPin, PlusCircle } from 'lucide-react';
import { JobSummary } from '@/components/jobs/job-summary';

// MOCK: Simulate logged-in user role. Change to 'alumni' to see the post job button.
const currentUserRole = 'student';

function PostJobDialog() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    setOpen(false); // Close dialog on submit
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Post a Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Post a New Job Opening</DialogTitle>
          <DialogDescription>
            Share an opportunity with the alumni network. Fill out the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label htmlFor="job-title">Job Title</Label>
            <Input id="job-title" placeholder="e.g., Software Engineer" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-name">Company</Label>
            <Input id="company-name" placeholder="e.g., Acme Inc." required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="e.g., New York, NY or Remote" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-type">Job Type</Label>
              <Select required>
                <SelectTrigger id="job-type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="job-description">Full Job Description</Label>
            <Textarea id="job-description" rows={8} placeholder="Provide a detailed description of the role, responsibilities, and qualifications." required />
          </div>
           <div className="space-y-2">
            <Label htmlFor="application-url">Application URL</Label>
            <Input id="application-url" type="url" placeholder="https://example.com/apply" required />
          </div>
          <DialogFooter>
            <Button type="submit">Post Job</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Job Board</h1>
          <p className="text-muted-foreground">
            Find your next opportunity from companies in our network.
          </p>
        </div>
        {currentUserRole === 'alumni' && <PostJobDialog />}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {mockJobs.map((job) => (
          <Card key={job.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>{job.company}</CardDescription>
                </div>
                <Badge
                  variant={
                    job.type === 'Internship' ? 'default' : 'secondary'
                  }
                >
                  {job.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                {job.shortDescription}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
                <div className="text-xs">
                  Posted by{' '}
                  <Link
                    href={`/dashboard/directory/${job.postedBy.id}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {job.postedBy.firstName} {job.postedBy.lastName}
                  </Link>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <JobSummary job={job} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
