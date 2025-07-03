'use client';

import { useState, useEffect, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Camera } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';

// Reusing and adapting the schemas from signup
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  location: z.string().min(1, 'Location is required.'),
  about: z.string().min(1, 'About section cannot be empty.'),
  linkedin: z.string().url({ message: 'Please enter a valid URL.' }).or(z.literal('')),
  github: z.string().url({ message: 'Please enter a valid URL.' }).or(z.literal('')),
  position: z.string().optional(),
  company: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface UserProfileData extends ProfileFormValues {
    email: string;
    role: 'student' | 'alumni';
    avatar?: string;
    enrollmentNo: string;
    department: string;
}

export default function ProfilePage() {
    const { toast } = useToast();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            location: '',
            about: '',
            linkedin: '',
            github: '',
            position: '',
            company: '',
        },
    });

    useEffect(() => {
        if (!auth || !db) return;
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data() as UserProfileData;
                    setProfile(userData);
                    form.reset(userData);
                } else {
                    // User exists in Auth but not DB, redirect
                    router.push('/login');
                }
            } else {
                setUser(null);
                setProfile(null);
                router.push('/login');
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [form, router]);

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !user || !storage) return;

        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const storageRef = ref(storage, `avatars/${user.uid}`);
            await uploadBytes(storageRef, file);
            const photoURL = await getDownloadURL(storageRef);

            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { avatar: photoURL });

            setProfile((prev) => prev ? { ...prev, avatar: photoURL } : null);

            toast({
                title: 'Success!',
                description: 'Profile picture updated.',
            });
        } catch (error) {
            console.error('Error uploading image:', error);
            toast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: 'There was an error uploading your picture.',
            });
        } finally {
            setIsUploading(false);
        }
    };
    
    async function onSubmit(values: ProfileFormValues) {
        if (!user || !db) return;
        setIsSaving(true);
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, values as { [key: string]: any });
            toast({
                title: 'Profile Updated',
                description: 'Your information has been saved.',
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: 'Could not save your profile changes.',
            });
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader className="items-center">
                         <Skeleton className="h-32 w-32 rounded-full" />
                         <Skeleton className="h-8 w-48 mt-4" />
                         <Skeleton className="h-6 w-64 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 pt-6">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!profile) {
        return null; // or a dedicated "not found" component
    }

    const fallback = (profile.firstName?.[0] || '') + (profile.lastName?.[0] || '');

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader className="items-center text-center">
                        <div className="relative group">
                            <Avatar className="h-32 w-32">
                                <AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} />
                                <AvatarFallback className="text-4xl">{fallback.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Label 
                                htmlFor="avatar-upload"
                                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                {isUploading ? (
                                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                                ) : (
                                    <Camera className="h-8 w-8 text-white" />
                                )}
                            </Label>
                            <Input 
                                id="avatar-upload" 
                                type="file" 
                                className="hidden" 
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                            />
                        </div>

                        <CardTitle className="text-3xl mt-4">
                            {profile.firstName} {profile.lastName}
                        </CardTitle>
                        <CardDescription>
                            {profile.role === 'alumni'
                                ? `${profile.company ? `${profile.position} at ${profile.company}` : 'Alumni'}`
                                : `Student, ${profile.department}`}
                        </CardDescription>
                         <CardDescription>{profile.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="firstName" render={({ field }) => (
                                <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="lastName" render={({ field }) => (
                                <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        {profile.role === 'alumni' && (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="position" render={({ field }) => (
                                    <FormItem><FormLabel>Position</FormLabel><FormControl><Input placeholder="e.g. Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="company" render={({ field }) => (
                                    <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="e.g. Acme Inc." {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        )}
                        <FormField control={form.control} name="location" render={({ field }) => (
                            <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="about" render={({ field }) => (
                           <FormItem><FormLabel>About</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-medium">Social Profiles</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="linkedin" render={({ field }) => (
                                    <FormItem><FormLabel>LinkedIn Profile</FormLabel><FormControl><Input {...field} placeholder="https://linkedin.com/in/..." /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="github" render={({ field }) => (
                                    <FormItem><FormLabel>GitHub Profile</FormLabel><FormControl><Input {...field} placeholder="https://github.com/..." /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
