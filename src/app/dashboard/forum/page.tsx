import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockThreads } from '@/lib/mock-data';
import { MessageSquare, PlusCircle } from 'lucide-react';

export default function ForumPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Discussion Forum</h1>
          <p className="text-muted-foreground">
            Ask questions, share advice, and connect with the community.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/forum/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Start a Thread
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead className="text-center">Replies</TableHead>
                <TableHead className="text-right">Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockThreads.map((thread) => (
                <TableRow key={thread.id}>
                  <TableCell>
                    <div>
                      <Link
                        href={`/dashboard/forum/${thread.id}`}
                        className="font-medium hover:underline"
                      >
                        {thread.title}
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        by {thread.author.firstName} {thread.author.lastName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{thread.replyCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {thread.timestamp}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
