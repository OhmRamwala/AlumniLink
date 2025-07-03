'use client';
import { useState } from 'react';
import {
  summarizeJobDescription,
  type SummarizeJobDescriptionOutput,
} from '@/ai/flows/summarize-job-description';
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
import { ScrollArea } from '../ui/scroll-area';

export function JobSummary({ job }: { job: Job }) {
  const [summary, setSummary] = useState<SummarizeJobDescriptionOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    setError('');
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeJobDescription({
        jobDescription: job.fullDescription,
      });
      setSummary(result);
    } catch (e: any) {
      if (e.message?.includes('MISSING_API_KEY')) {
        setError(
          'The AI service is not configured. Please set the GOOGLE_API_KEY in your .env file.'
        );
      } else {
        setError('Failed to generate summary. Please try again.');
      }
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{job.title}</DialogTitle>
          <DialogDescription>
            {job.company} - {job.location}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>
                  {error.includes('AI service')
                    ? 'Configuration Error'
                    : 'Error'}
                </AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoading && (
              <div className="flex items-center justify-center p-8 space-x-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-muted-foreground">Generating summary...</p>
              </div>
            )}

            {summary && !isLoading && (
              <div className="space-y-4 text-sm">
                <h3 className="font-semibold">AI Summary</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {summary.summary}
                </p>
              </div>
            )}

            {!summary && !isLoading && (
              <div className="space-y-4">
                 <h3 className="font-semibold">Full Job Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {job.fullDescription}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 w-full pt-4">
          <Button
            onClick={handleSummarize}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {summary ? 'Regenerate' : 'Generate'} AI Summary
          </Button>
          <Button asChild className="bg-accent hover:bg-accent/90">
            <a href={job.url} target="_blank" rel="noopener noreferrer">
              Apply on Company Site
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
