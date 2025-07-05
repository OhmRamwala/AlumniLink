
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Link2, Linkedin, Github, Loader2, AlertTriangle, ChevronsUpDown, Check, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useState, useMemo, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword, sendEmailVerification, type User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { countries } from '@/lib/countries';
import { cn } from '@/lib/utils';

// Base schema for common fields
const baseSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required.' })
    .regex(/^[a-zA-Z ]*$/, {
      message: 'First name can only contain letters and spaces.',
    }),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required.' })
    .regex(/^[a-zA-Z ]*$/, {
      message: 'Last name can only contain letters and spaces.',
    }),
  enrollmentNo: z.string().regex(/^[0-9]+$/, {
    message: 'Enrollment number must contain only digits.',
  }),
  department: z.string().min(1, { message: 'Department is required.' }).regex(/^[a-zA-Z ]*$/, {
      message: 'Department can only contain letters and spaces.',
    }),
  country: z.string().min(1, { message: 'Country is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter.' })
    .regex(/[0-9]/, { message: 'Must contain at least one number.' }),
});

// Using discriminatedUnion to handle different fields based on role
const formSchema = z.discriminatedUnion('role', [
  z.object({
    role: z.literal('student'),
    about: z.string().min(1, { message: 'This field is required.' }),
    linkedin: z.string().min(1, { message: 'LinkedIn profile is required.' }).url({ message: 'A valid LinkedIn URL is required.' }),
    github: z.string().min(1, { message: 'GitHub profile is required.' }).url({ message: 'A valid GitHub URL is required.' }),
  }).merge(baseSchema),
  z.object({
    role: z.literal('alumni'),
    position: z.string().min(1, { message: 'Position is required.' }),
    company: z.string().min(1, { message: 'Company is required.' }),
    about: z.string().min(1, { message: 'This field is required.' }),
    linkedin: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
    github: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  }).merge(baseSchema),
]);
type FormValues = z.infer<typeof formSchema>;


function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countryPopoverOpen, setCountryPopoverOpen] = useState(false);
  const [step, setStep] = useState(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'student',
      firstName: '',
      lastName: '',
      enrollmentNo: '',
      department: '',
      country: '',
      email: '',
      password: '',
      about: '',
      linkedin: '',
      github: '',
    },
    mode: 'onTouched'
  });

  const role = form.watch('role');
  const passwordValue = form.watch('password');
  
  const passwordChecks = useMemo(() => [
      { rule: (pwd: string) => pwd.length >= 8, label: 'At least 8 characters' },
      { rule: (pwd: string) => /[A-Z]/.test(pwd), label: 'An uppercase letter' },
      { rule: (pwd: string) => /[0-9]/.test(pwd), label: 'A number' },
  ], []);

  const handleNextStep = async () => {
    const fieldsToValidate: (keyof FormValues)[] = [
        'firstName', 'lastName', 'enrollmentNo', 'department', 'country', 'email', 'password', 'role'
    ];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(2);
    }
  };

  async function onSubmit(values: FormValues) {
    if (!auth || !db) {
        toast({ variant: 'destructive', title: 'Configuration Error', description: 'Firebase is not configured.' });
        return;
    }
    setIsLoading(true);
    let user: User | null = null;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        user = userCredential.user;
        await sendEmailVerification(user);

        const { password, ...userData } = values;
        
        const dataToSave: any = { 
            ...userData, 
            createdAt: new Date(),
            id: user.uid,
        };
        // Ensure optional fields are handled correctly
        if (dataToSave.role === 'student') {
            delete dataToSave.company;
            delete dataToSave.position;
        }


        await setDoc(doc(db, 'users', user.uid), dataToSave);
        router.push(`/pending-verification?email=${encodeURIComponent(values.email)}`);

    } catch (error: any) {
        if (user) {
            await user.delete().catch(e => console.error("Failed to clean up orphaned user from Auth:", e));
        }
        let errorMessage = 'An unexpected error occurred. Please try again.';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email address is already in use by another account.';
        } else if (error.code?.includes('permission-denied')) {
            errorMessage = "Could not save your profile. This is a database permissions issue. Please ensure your Firestore security rules are configured correctly to allow writes.";
        }
        toast({ variant: 'destructive', title: 'Signup Failed', description: errorMessage });
    } finally {
        setIsLoading(false);
    }
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <Image
          src="https://i.ibb.co/jZwVcQTg/sugnupbg.webp" alt="University campus background"
          fill className="object-cover -z-10 brightness-50" data-ai-hint="university campus" />
        <Card className="w-full max-w-lg mx-auto"><CardHeader><CardTitle className="text-2xl">Configuration Needed</CardTitle>
            <CardDescription>Your application is not connected to Firebase.</CardDescription></CardHeader>
          <CardContent><Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Firebase Not Configured</AlertTitle>
              <AlertDescription><p>To get started, you need to add your Firebase project's configuration to the d.env file.</p>
                <p className="mt-2">Please refer to the Firebase documentation to find your project credentials and add them to the empty <code>.env</code> file in the root of this project.</p>
              </AlertDescription></Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <Image
        src="https://i.ibb.co/jZwVcQTg/sugnupbg.webp" alt="University campus background"
        fill className="object-cover -z-10 brightness-50" data-ai-hint="university campus" />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="w-full max-w-2xl mx-auto my-8">
                    <CardHeader className="space-y-1 text-center"><div className="flex items-center justify-center gap-2">
                        <Link2 className="h-8 w-8 text-primary" /><CardTitle className="text-3xl font-bold">AlumniLink</CardTitle></div>
                        <CardDescription>
                            {step === 1 ? 'Create an account to connect with peers' : `Tell us more about your ${role} profile`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="firstName" render={({ field }) => (
                                    <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="Max" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="lastName" render={({ field }) => (
                                    <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Robinson" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="enrollmentNo" render={({ field }) => (
                                    <FormItem><FormLabel>Enrollment No.</FormLabel><FormControl><Input placeholder="123456789" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="department" render={({ field }) => (
                                    <FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="Computer Science" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="country" render={({ field }) => (
                                    <FormItem><FormLabel>Country</FormLabel>
                                    <Popover open={countryPopoverOpen} onOpenChange={setCountryPopoverOpen}><PopoverTrigger asChild><FormControl>
                                            <Button variant="outline" role="combobox" className={cn("w-full justify-between",!field.value && "text-muted-foreground")} disabled={isLoading}>
                                            {field.value ? countries.find((c) => c.label === field.value)?.label : "Select country"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button></FormControl></PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0"><Command><CommandInput placeholder="Search country..." />
                                            <CommandEmpty>No country found.</CommandEmpty><CommandGroup><ScrollArea className="h-72">
                                                {countries.map((c) => (<CommandItem value={c.label} key={c.value} onSelect={() => {form.setValue("country", c.label); setCountryPopoverOpen(false);}}>
                                                    <Check className={cn("mr-2 h-4 w-4", c.label === field.value ? "opacity-100" : "opacity-0")} />
                                                    {c.label}
                                                    </CommandItem>))}
                                                </ScrollArea></CommandGroup></Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="m@example.com" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem><FormLabel>Password</FormLabel><FormControl><div className="relative">
                                        <Input type={showPassword ? 'text' : 'password'} {...field} disabled={isLoading} />
                                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(p => !p)}>
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                                        </Button>
                                        </div></FormControl><FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="role" render={({ field }) => (
                                    <FormItem className="pt-2"><FormLabel>I am a...</FormLabel><FormControl>
                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex h-10 items-center gap-4" disabled={isLoading}>
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="student" id="student" /></FormControl><Label htmlFor="student">Student</Label></FormItem>
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="alumni" id="alumni" /></FormControl><Label htmlFor="alumni">Alumni</Label></FormItem>
                                        </RadioGroup></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>

                             <div className="flex justify-between items-end pt-2">
                                <div className="text-xs space-y-1">
                                    {passwordChecks.map(({ rule, label }) => (
                                        <div key={label} className={cn("flex items-center gap-1.5 transition-colors", rule(passwordValue || "") ? 'text-foreground' : 'text-muted-foreground')}>
                                            <Check className="h-3.5 w-3.5" />
                                            <span>{label}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button type="button" onClick={handleNextStep}>
                                    Next <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                         <div className="space-y-6">
                            <h3 className="text-lg font-medium text-center">{role === 'student' ? 'Student' : 'Alumni'} Profile</h3>
                            {role === 'alumni' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="position" render={({ field }) => (
                                        <FormItem><FormLabel>Position</FormLabel><FormControl><Input placeholder="Software Engineer" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="company" render={({ field }) => (
                                        <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="Acme Inc." {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            )}
                            <FormField control={form.control} name="about" render={({ field }) => (
                                <FormItem><FormLabel>About</FormLabel>
                                <FormControl><Textarea placeholder={role === 'student' ? "I'm a passionate developer interested in AI..." : "Experienced professional with a history in..."} {...field} disabled={isLoading} /></FormControl>
                                <FormMessage /></FormItem>
                            )} />
                           
                            <div className="space-y-4 pt-4 border-t">
                                <h4 className="text-md font-medium">{role === 'alumni' ? 'Social Profiles (Optional)' : 'Social Profiles'}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="linkedin" render={({ field }) => (
                                        <FormItem><FormLabel>LinkedIn Profile</FormLabel><FormControl><div className="relative">
                                                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                <Input type="url" placeholder="https://linkedin.com/in/..." className="pl-10" {...field} disabled={isLoading} />
                                                </div></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="github" render={({ field }) => (
                                        <FormItem><FormLabel>GitHub Profile</FormLabel><FormControl><div className="relative">
                                                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                <Input type="url" placeholder="https://github.com/..." className="pl-10" {...field} disabled={isLoading} />
                                                </div></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </div>
                        </div>
                    )}
                    </CardContent>
                    <CardFooter>
                        {step === 2 && (
                            <div className="w-full flex justify-between items-center">
                                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                                    Previous
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create an account
                                </Button>
                            </div>
                        )}
                    </CardFooter>
                    <div className="pb-6 text-center text-sm">
                        Already have an account?{' '} <Link href="/login" className="underline">Login</Link>
                    </div>
                </Card>
            </form>
        </Form>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
