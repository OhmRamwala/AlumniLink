
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
  serverTimestamp,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

import type { DonationCampaign, User as UserProfile } from '@/lib/types';
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
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Loader2, Pencil, Trash2 } from 'lucide-react';

const campaignSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  goalAmount: z.coerce.number().min(1, 'Goal amount must be greater than 0.'),
  imageUrl: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
});
type CampaignFormValues = z.infer<typeof campaignSchema>;

function CampaignFormDialog({ campaign, onSave }: { campaign?: DonationCampaign, onSave: () => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!campaign;

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: isEditMode
      ? { ...campaign, imageUrl: campaign.imageUrl || '' }
      : { title: '', description: '', goalAmount: 1000, imageUrl: '' },
  });

  useEffect(() => {
    if (isEditMode) {
      form.reset({ ...campaign, imageUrl: campaign.imageUrl || '' });
    }
  }, [campaign, form, isEditMode]);

  async function onSubmit(values: CampaignFormValues) {
    if (!db) return;
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        const campaignRef = doc(db, 'donations', campaign.id);
        await updateDoc(campaignRef, values);
        toast({ title: 'Success', description: 'Campaign updated.' });
      } else {
        await addDoc(collection(db, 'donations'), {
          ...values,
          currentAmount: 0,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Success', description: 'Campaign created.' });
      }

      setOpen(false);
      form.reset();
      onSave();
    } catch (error) {
      console.error('Error saving campaign:', error);
      let description = 'Failed to save campaign.';
      if (error instanceof Error && 'code' in error && (error as any).code === 'permission-denied') {
        description = 'Permission denied. Ensure Firestore rules are set correctly.';
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
      Create Campaign
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit' : 'Create'} Campaign</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the campaign details below.' : 'Launch a new fundraising campaign.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Campaign Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="goalAmount" render={({ field }) => (
                <FormItem><FormLabel>Goal Amount (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem><FormLabel>Image URL (Optional)</FormLabel><FormControl><Input placeholder="https://placehold.co/600x400.png" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Save Changes' : 'Create Campaign'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function DonationsPage() {
    const [campaigns, setCampaigns] = useState<DonationCampaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const { toast } = useToast();

    const fetchCampaigns = () => {
        if (!db) return;
        const q = query(collection(db, 'donations'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const campaignsData: DonationCampaign[] = [];
            querySnapshot.forEach((doc) => {
              campaignsData.push({ id: doc.id, ...doc.data() } as DonationCampaign);
            });
            setCampaigns(campaignsData);
            setIsLoading(false);
          },
          (error) => {
            console.error('Error fetching campaigns:', error);
            setIsLoading(false);
          }
        );
        return unsubscribe;
    };

    useEffect(() => {
        if (!auth || !db) {
            setIsLoading(false);
            return;
        }
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setUserProfile(userDoc.data() as UserProfile);
                }
            }
            const unsubscribeFirestore = fetchCampaigns();
            return () => {
              if (unsubscribeFirestore) unsubscribeFirestore();
            };
        });
    
        return () => unsubscribeAuth();
      }, []);

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
    }
  
    const handleDeleteCampaign = async (campaignId: string) => {
      if (!db) return;
      const isConfirmed = window.confirm("Are you sure you want to delete this campaign?");
      if (!isConfirmed) return;

      try {
          await deleteDoc(doc(db, "donations", campaignId));
          toast({ title: 'Success', description: 'Campaign has been deleted.' });
      } catch (error) {
          console.error("Error deleting campaign: ", error);
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete campaign.' });
      }
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
            <h1 className="text-3xl font-bold tracking-tight">Donation Campaigns</h1>
            <p className="text-muted-foreground">
              Support the university by contributing to our causes.
            </p>
        </div>
        {userProfile?.role === 'admin' && <CampaignFormDialog onSave={fetchCampaigns} />}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="flex flex-col overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={campaign.imageUrl || 'https://placehold.co/600x400.png'}
                alt={campaign.title}
                fill
                className="object-cover"
                data-ai-hint="charity donation"
              />
            </div>
            <CardHeader>
              <CardTitle>{campaign.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground">{campaign.description}</p>
              <div>
                <Progress value={(campaign.currentAmount / campaign.goalAmount) * 100} className="h-2" />
                <div className="flex justify-between text-sm mt-2">
                    <span className="font-semibold">{formatCurrency(campaign.currentAmount)}</span>
                    <span className="text-muted-foreground">Goal: {formatCurrency(campaign.goalAmount)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-6 pt-0">
               <Button className="w-full bg-accent hover:bg-accent/90">
                 Donate Now
               </Button>
               {userProfile?.role === 'admin' && (
                <div className="flex items-center ml-2">
                  <CampaignFormDialog campaign={campaign} onSave={fetchCampaigns} />
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteCampaign(campaign.id)}>
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
