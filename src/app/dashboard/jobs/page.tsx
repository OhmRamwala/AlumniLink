import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockJobs } from '@/lib/mock-data';
import { MapPin, Briefcase } from 'lucide-react';
import { JobSummary } from '@/components/jobs/job-summary';

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Job Board</h1>
        <p className="text-muted-foreground">
          Find your next opportunity from companies in our network.
        </p>
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
                  <Badge variant={job.type === 'Internship' ? 'default' : 'secondary'}>{job.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                {job.shortDescription}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                  <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {job.location}
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
