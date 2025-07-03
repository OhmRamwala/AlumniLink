'use client';
import { useState } from 'react';
import { summarizeJobDescription } from '@/ai/flows/summarize-job-description';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, Terminal } from 'lucide-react';
import type { Job } from '@/lib/types';

export function JobSummary({ job }: { job: Job }) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    setError('');
    setIsLoading(true);
    setSummary('');
    try {
      const result = await summarizeJobDescription({
        jobDescription: job.fullDescription,
      });
      setSummary(result.summary);
    } catch (e) {
      setError('Failed to generate summary. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Read More & Summarize
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{job.title}</DialogTitle>
          <DialogDescription>
            {job.company} - {job.location}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <p className="text-sm text-muted-foreground">{job.fullDescription}</p>
          
          <Button onClick={handleSummarize} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Summary...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Summarize with AI
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {summary && (
             <div className="p-4 border rounded-lg bg-secondary/50">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary"/> AI Summary</h3>
                <p className="text-sm text-secondary-foreground">{summary}</p>
             </div>
          )}

        </div>
        <DialogFooter>
          <Button asChild className="w-full bg-accent hover:bg-accent/90">
            <a href={job.url} target="_blank" rel="noopener noreferrer">
              Apply on Company Site
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
