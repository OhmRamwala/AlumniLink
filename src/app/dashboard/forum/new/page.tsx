'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { onAuthStateChanged, type User as AuthUser } from 'firebase/auth';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { User as UserProfile } from '@/lib/types';

const threadSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  content: z.string().min(10, 'Content must be at least 10 characters long.'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
});

type ThreadFormValues = z.infer<typeof threadSchema>;

export default function NewThreadPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    const form = useForm<ThreadFormValues>({
        resolver: zodResolver(threadSchema),
        defaultValues: { title: '', content: '', imageUrl: '', videoUrl: '' },
    });

    useEffect(() => {
        if (!auth || !db) return;
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserProfile({ id: user.uid, ...userDoc.data() } as UserProfile);
                } else {
                    router.push('/login'); // Redirect if profile doesn't exist
                }
            } else {
                router.push('/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    async function onSubmit(values: ThreadFormValues) {
        if (!userProfile || !db) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to post.' });
            return;
        }
        setIsSubmitting(true);
        try {
            const dataToSave: any = {
                title: values.title,
                content: values.content,
                postedBy: {
                    id: userProfile.id,
                    firstName: userProfile.firstName,
                    lastName: userProfile.lastName,
                    avatar: userProfile.avatar || '',
                },
                postedAt: serverTimestamp(),
                lastActivity: serverTimestamp(),
                replyCount: 0,
            };

            if (values.imageUrl) {
                dataToSave.imageUrl = values.imageUrl;
            }
            if (values.videoUrl) {
                dataToSave.videoUrl = values.videoUrl;
            }

            await addDoc(collection(db, 'threads'), dataToSave);
            
            toast({ title: 'Success', description: 'Your thread has been posted.' });
            router.push('/dashboard/forum');
        } catch (error) {
            console.error('Error posting thread:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to post thread.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!userProfile) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <Button variant="ghost" asChild>
                    <Link href="/dashboard/forum">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Forum
                    </Link>
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Start a New Discussion</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl><Input placeholder="What's on your mind?" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="content" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl><Textarea placeholder="Share more details here..." rows={10} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="imageUrl" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL (Optional)</FormLabel>
                                    <FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="videoUrl" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Video URL (Optional)</FormLabel>
                                    <FormControl><Input placeholder="https://youtube.com/watch?v=..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Post Thread
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
