
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
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
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

import type { NewsArticle, User as UserProfile } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
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
import { ArrowRight, PlusCircle, Loader2, Pencil, Trash2 } from 'lucide-react';

const newsSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  source: z.string().min(1, 'Source is required.'),
  summary: z.string().min(1, 'Summary is required.'),
  content: z.string().min(1, 'Content is required.'),
  imageUrl: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
});
type NewsFormValues = z.infer<typeof newsSchema>;

function NewsFormDialog({ article, onFormSubmit }: { article?: NewsArticle, onFormSubmit: () => void; }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!article;

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: isEditMode
      ? { ...article, imageUrl: article.imageUrl || '' }
      : { title: '', source: '', summary: '', content: '', imageUrl: '' },
  });

  useEffect(() => {
    if (isEditMode) {
      form.reset({ ...article, imageUrl: article.imageUrl || '' });
    }
  }, [article, form, isEditMode]);

  async function onSubmit(values: NewsFormValues) {
    if (!db) return;
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        const articleRef = doc(db, 'news', article.id);
        await updateDoc(articleRef, values);
        toast({ title: 'Success', description: 'News article updated.' });
      } else {
        await addDoc(collection(db, 'news'), {
          ...values,
          date: serverTimestamp(),
        });
        toast({ title: 'Success', description: 'News article posted.' });
      }
      
      onFormSubmit();
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error saving news:', error);
      let description = 'Failed to save news article.';
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
      Post News
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit' : 'Post'} a News Article</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details below.' : 'Share an update with the community.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2"
          >
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="source" render={({ field }) => (
                <FormItem><FormLabel>Source</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="summary" render={({ field }) => (
                <FormItem><FormLabel>Summary</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem><FormLabel>Full Content</FormLabel><FormControl><Textarea rows={8} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem><FormLabel>Image URL (Optional)</FormLabel><FormControl><Input placeholder="https://placehold.co/600x400.png" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Save Changes' : 'Post Article'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
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
    const q = query(collection(db, 'news'), orderBy('date', 'desc'));
    const unsubscribeNews = onSnapshot(q, (querySnapshot) => {
        const newsData: NewsArticle[] = [];
        querySnapshot.forEach((doc) => {
          newsData.push({ id: doc.id, ...doc.data() } as NewsArticle);
        });
        setArticles(newsData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching news:', error);
        setIsLoading(false);
      }
    );
    return () => unsubscribeNews();
  }, []);

  const handleDeleteArticle = async (articleId: string) => {
    if (!db) return;
    const isConfirmed = window.confirm("Are you sure you want to delete this article?");
    if (!isConfirmed) return;

    try {
        await deleteDoc(doc(db, "news", articleId));
        toast({ title: 'Success', description: 'Article has been deleted.' });
    } catch (error) {
        console.error("Error deleting article: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete article.' });
    }
  };

  const formatDate = (date: Timestamp | Date | string) => {
    if (date instanceof Timestamp) {
      return format(date.toDate(), 'yyyy-MM-dd');
    }
    if (date instanceof Date) {
        return format(date, 'yyyy-MM-dd')
    }
    return date;
  }

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
          <h1 className="text-3xl font-bold tracking-tight">News Feed</h1>
          <p className="text-muted-foreground">
            The latest news and stories from the alumni community.
          </p>
        </div>
        {userProfile?.role === 'admin' && <NewsFormDialog onFormSubmit={() => {}} />}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id} className="flex flex-col overflow-hidden">
            <div className="relative h-48 w-full bg-muted">
              <Image
                src={article.imageUrl || 'https://placehold.co/600x400.png'}
                alt={article.title}
                fill
                className="object-contain p-2"
                data-ai-hint="community event"
              />
            </div>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
              <CardDescription>
                {article.source} - {formatDate(article.date)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm">{article.summary}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button asChild variant="secondary" className="w-full">
                <Link href={`/dashboard/news/${article.id}`}>
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
               {userProfile?.role === 'admin' && (
                <div className="flex items-center ml-2">
                  <NewsFormDialog article={article} onFormSubmit={() => {}} />
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteArticle(article.id)}>
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
