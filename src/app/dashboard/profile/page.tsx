
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, ChevronsUpDown, Check, Edit, User as UserIcon, Building, Briefcase, GraduationCap, MapPin, Mail, Linkedin, Github } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { countries } from '@/lib/countries';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  country: z.string().min(1, 'Country is required.'),
  about: z.string().min(1, 'About section cannot be empty.'),
  linkedin: z.string().url({ message: 'Please enter a valid URL.' }).or(z.literal('')),
  github: z.string().url({ message: 'Please enter a valid URL.' }).or(z.literal('')),
  position: z.string().optional(),
  company: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface UserProfileData extends ProfileFormValues {
    email: string;
    role: 'student' | 'alumni' | 'admin';
    avatar?: string;
    enrollmentNo: string;
    department: string;
    major?: string;
    graduationYear?: number;
}

function ProfileSkeleton() {
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

export default function ProfilePage() {
    const { toast } = useToast();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [countryPopoverOpen, setCountryPopoverOpen] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '', lastName: '', country: '',
            about: '', linkedin: '', github: '',
            position: '', company: '',
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
                    router.push('/login');
                }
            } else {
                router.push('/login');
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [form, router]);
    
    async function onSubmit(values: ProfileFormValues) {
        if (!user || !db) return;
        setIsSaving(true);
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, values as { [key: string]: any });
            setProfile(prev => prev ? { ...prev, ...values } : null);
            toast({ title: 'Profile Updated', description: 'Your information has been saved.' });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not save your profile changes.' });
        } finally {
            setIsSaving(false);
        }
    }

    const handleCancel = () => {
        if (profile) {
            form.reset(profile);
        }
        setIsEditing(false);
    };

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (!profile) {
        return null;
    }

    const fallback = (profile.firstName?.[0] || '') + (profile.lastName?.[0] || '');

    return (
        <Card>
            <CardHeader className="items-center text-center">
                <Avatar className="h-32 w-32">
                    <AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} />
                    <AvatarFallback className="text-4xl">{fallback.toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <CardTitle className="text-3xl mt-4">
                    {profile.firstName} {profile.lastName}
                </CardTitle>
                <CardDescription>
                    {profile.role === 'alumni'
                        ? `${profile.position || 'Alumni'} at ${profile.company || 'Unknown Company'}`
                        : profile.role === 'admin' 
                        ? 'Administrator'
                        : `Student, ${profile.major || profile.department}`}
                </CardDescription>
                 <CardDescription>{profile.email}</CardDescription>
            </CardHeader>
            
            {isEditing ? (
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
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
                            <FormField control={form.control} name="country" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Country</FormLabel>
                                    <Popover open={countryPopoverOpen} onOpenChange={setCountryPopoverOpen}>
                                        <PopoverTrigger asChild><FormControl>
                                            <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                                                {field.value ? countries.find((c) => c.label === field.value)?.label : "Select country"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl></PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0"><Command>
                                            <CommandInput placeholder="Search country..." />
                                            <CommandEmpty>No country found.</CommandEmpty>
                                            <CommandGroup><ScrollArea className="h-72">
                                                {countries.map((c) => (
                                                    <CommandItem value={c.label} key={c.value} onSelect={() => { form.setValue("country", c.label); setCountryPopoverOpen(false); }}>
                                                        <Check className={cn("mr-2 h-4 w-4", c.label === field.value ? "opacity-100" : "opacity-0")} />
                                                        {c.label}
                                                    </CommandItem>
                                                ))}
                                            </ScrollArea></CommandGroup>
                                        </Command></PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
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
                        <CardFooter className="gap-2">
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
                            </Button>
                            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                        </CardFooter>
                    </form>
                </Form>
            ) : (
                <>
                    <CardContent className="max-w-2xl mx-auto space-y-8">
                        <div className="prose prose-sm text-muted-foreground mx-auto text-center">
                            <p>{profile.about}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t">
                            {profile.graduationYear && (
                                <div className="flex items-center gap-3">
                                <GraduationCap className="h-6 w-6 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">{profile.role === 'alumni' ? 'Graduated' : 'Expected Graduation'}</p>
                                    <p className="font-medium">{profile.graduationYear}</p>
                                </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <MapPin className="h-6 w-6 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Country</p>
                                    <p className="font-medium">{profile.country}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-6 w-6 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{profile.email}</p>
                                </div>
                            </div>
                            {profile.linkedin && (
                                <div className="flex items-center gap-3">
                                <Linkedin className="h-6 w-6 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">LinkedIn</p>
                                    <a href={profile.linkedin} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">View Profile</a>
                                </div>
                                </div>
                            )}
                            {profile.github && (
                                <div className="flex items-center gap-3">
                                <Github className="h-6 w-6 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">GitHub</p>
                                    <a href={profile.github} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">View Profile</a>
                                </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => setIsEditing(true)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Profile
                        </Button>
                    </CardFooter>
                </>
            )}
        </Card>
    );
}
