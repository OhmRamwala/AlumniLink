'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, PlusCircle } from 'lucide-react';
import type { ForumThread } from '@/lib/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';


function ForumSkeleton() {
    return (
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
                        {[...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="space-y-1">
                                            <Skeleton className="h-4 w-64" />
                                            <Skeleton className="h-3 w-32" />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Skeleton className="h-4 w-8 mx-auto" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Skeleton className="h-4 w-24 ml-auto" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default function ForumPage() {
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            setIsLoading(false);
            return;
        }
        const q = query(collection(db, 'threads'), orderBy('lastActivity', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const threadsData: ForumThread[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ForumThread));
            setThreads(threadsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching forum threads: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const formatTimestamp = (ts: Timestamp | undefined) => {
      if (!ts) return 'just now';
      return formatDistanceToNow(ts.toDate(), { addSuffix: true });
    }

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
      
      {isLoading ? <ForumSkeleton /> : (
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
                {threads.map((thread) => (
                    <TableRow key={thread.id}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={thread.postedBy.avatar || 'https://placehold.co/40x40.png'} alt={`${thread.postedBy.firstName}'s avatar`} />
                                <AvatarFallback>{thread.postedBy.firstName[0]}{thread.postedBy.lastName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <Link href={`/dashboard/forum/${thread.id}`} className="font-medium hover:underline">
                                    {thread.title}
                                </Link>
                                <div className="text-sm text-muted-foreground">
                                    by {thread.postedBy.firstName} {thread.postedBy.lastName}
                                </div>
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
                        {formatTimestamp(thread.lastActivity)}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
