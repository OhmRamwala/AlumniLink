
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Link2, Linkedin, Github, Loader2, AlertTriangle, UploadCloud, ChevronsUpDown, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useState, useMemo, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword, type User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage, isFirebaseConfigured } from '@/lib/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { countries } from '@/lib/countries';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf'];

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
    .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter.' })
    .regex(/[0-9]/, { message: 'Must contain at least one number.' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Must contain at least one special character.',
    }),
});

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [countryPopoverOpen, setCountryPopoverOpen] = useState(false);

  const formSchema = useMemo(() => {
    const cvSchema = z.any().superRefine((val, ctx) => {
      if (typeof window === 'undefined') {
        // Allow any value on the server, validation is client-side only.
        return;
      }
      if (!(val instanceof FileList) || val.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CV is required.",
        });
        return;
      }
      if (val.length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only one file is allowed.",
        });
        return;
      }
      const file = val[0];
      if (file.size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Max file size is 5MB.`,
        });
      }
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Only .pdf files are accepted.',
        });
      }
    });

    return z.discriminatedUnion('role', [
      baseSchema.extend({
        role: z.literal('student'),
        about: z.string().min(1, { message: 'This field is required.' }),
        cv: cvSchema,
        linkedin: z.string().url({ message: 'Please enter a valid URL.' }),
        github: z.string().url({ message: 'Please enter a valid URL.' }),
      }),
      baseSchema.extend({
        role: z.literal('alumni'),
        position: z.string().min(1, { message: 'Position is required.' }),
        company: z.string().min(1, { message: 'Company is required.' }),
        about: z.string().min(1, { message: 'This field is required.' }),
        linkedin: z
          .string()
          .url({ message: 'Please enter a valid URL.' })
          .optional()
          .or(z.literal('')),
        github: z
          .string()
          .url({ message: 'Please enter a valid URL.' })
          .optional()
          .or(z.literal('')),
      }),
    ]);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
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
      company: '',
      position: '',
    },
  });

  const role = form.watch('role');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth || !db || !storage) {
        toast({ variant: 'destructive', title: 'Configuration Error', description: 'Firebase is not configured.' });
        return;
    }
    setIsLoading(true);
    let user: User | null = null;

    try {
        // Step 1: Create user in Auth.
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password
        );
        user = userCredential.user;

        // Step 2: Prepare and save the user document to Firestore.
        // Uniqueness of enrollmentNo should be enforced via Firestore security rules if it's a critical requirement.
        const { password, ...userData } = values;
        const dataToSave: { [key: string]: any } = {
            ...userData,
            createdAt: new Date(),
        };

        if (values.role === 'student' && 'cv' in values && values.cv?.length > 0) {
            const cvFile = values.cv[0];
            const storageRef = ref(storage, `cvs/${user.uid}.pdf`);
            await uploadBytes(storageRef, cvFile);
            dataToSave.cvUrl = await getDownloadURL(storageRef);
        }

        // Remove the FileList from the object to be saved
        if ('cv' in dataToSave) {
            delete dataToSave.cv;
        }

        await setDoc(doc(db, 'users', user.uid), dataToSave);

        toast({
            title: 'Account Created!',
            description: 'You have been successfully signed up.',
        });

        const redirectUrl = searchParams.get('redirect');
        router.push(redirectUrl || '/dashboard');

    } catch (error: any) {
        // If any part of the process fails after user creation,
        // we must delete the user from Auth to prevent orphaned accounts.
        if (user) {
            await user.delete().catch(e => console.error("Failed to clean up user from Auth:", e));
        }

        let errorMessage = 'An unexpected error occurred. Please try again.';
        const errorCode = error.code;

        switch (errorCode) {
            case 'auth/email-already-in-use':
                errorMessage = 'This email address is already in use.';
                break;
            case 'auth/weak-password':
                errorMessage = 'The password is too weak.';
                break;
            case 'storage/unauthorized':
                errorMessage = "CV upload failed due to a permissions issue. Please check your Firebase Storage rules.";
                break;
            case 'permission-denied':
                errorMessage = "Saving your profile failed due to a database permissions issue. Please ensure your Firestore security rules are configured correctly.";
                break;
            default:
                console.error('Signup error:', error);
                break;
        }

        toast({
            variant: 'destructive',
            title: 'Signup Failed',
            description: errorMessage,
        });
    } finally {
        setIsLoading(false);
    }
}


  if (!isFirebaseConfigured) {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="University campus background"
          fill
          className="object-cover -z-10 brightness-50"
          data-ai-hint="university campus"
        />
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Configuration Needed</CardTitle>
            <CardDescription>
              Your application is not connected to Firebase.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Firebase Not Configured</AlertTitle>
              <AlertDescription>
                <p>
                  To get started, you need to add your Firebase project's
                  configuration to the <code>.env</code> file.
                </p>
                <p className="mt-2">
                  Please refer to the Firebase documentation to find your
                  project credentials and add them to the empty{' '}
                  <code>.env</code> file in the root of this project.
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <Image
        src="https://placehold.co/1920x1080.png"
        alt="University campus background"
        fill
        className="object-cover -z-10 brightness-50"
        data-ai-hint="university campus"
      />
      <Card className="w-full max-w-2xl mx-auto my-8">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-2">
            <Link2 className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold">AlumniLink</CardTitle>
          </div>
          <CardDescription>
            Create an account to connect with peers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Max" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Robinson" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="enrollmentNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enrollment No.</FormLabel>
                      <FormControl>
                        <Input placeholder="123456789" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Computer Science" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Country</FormLabel>
                      <Popover open={countryPopoverOpen} onOpenChange={setCountryPopoverOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isLoading}
                            >
                              {field.value
                                ? countries.find(
                                    (country) => country.label === field.value
                                  )?.label
                                : "Select country"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput placeholder="Search country..." />
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                                <ScrollArea className="h-72">
                                  {countries.map((country) => (
                                    <CommandItem
                                      value={country.label}
                                      key={country.value}
                                      onSelect={() => {
                                        form.setValue("country", country.label)
                                        setCountryPopoverOpen(false)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          country.label === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {country.label}
                                    </CommandItem>
                                  ))}
                                </ScrollArea>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>
                      Must be 8+ characters with uppercase, lowercase, number,
                      and special character.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>I am a...</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.reset({
                            ...form.getValues(),
                            role: value as 'student' | 'alumni',
                            company: '',
                            position: '',
                          });
                        }}
                        defaultValue={field.value}
                        className="flex gap-4"
                        disabled={isLoading}
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="student" id="student" />
                          </FormControl>
                          <Label htmlFor="student">Student</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="alumni" id="alumni" />
                          </FormControl>
                          <Label htmlFor="alumni">Alumni</Label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Student-specific fields */}
              {role === 'student' && (
                <>
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Student Profile</h3>
                     <FormField
                      control={form.control}
                      name="about"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tell us about yourself</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="I'm a passionate developer interested in AI..."
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload CV (PDF only, required)</FormLabel>
                          <FormControl>
                            <Label htmlFor="cv-upload" className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-2 border-dashed p-4 text-center text-muted-foreground hover:border-primary hover:text-primary ${form.watch('cv')?.[0]?.name ? 'border-primary text-primary' : ''}`}>
                              <UploadCloud className="h-6 w-6" />
                              <span>{(form.watch('cv') as any)?.[0]?.name || 'Click to upload or drag and drop'}</span>
                            </Label>
                          </FormControl>
                          <Input 
                              id="cv-upload"
                              type="file" 
                              className="hidden" 
                              accept=".pdf"
                              {...form.register('cv')}
                              disabled={isLoading}
                            />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Social Profiles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn Profile</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                  type="url"
                                  placeholder="https://linkedin.com/in/..."
                                  className="pl-10"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="github"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GitHub Profile</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                  type="url"
                                  placeholder="https://github.com/..."
                                  className="pl-10"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Alumni-specific fields */}
              {role === 'alumni' && (
                <>
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Alumni Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Software Engineer"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Inc." {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="about"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Experienced professional with a demonstrated history of working in the computer software industry."
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">
                      Social Profiles (Optional)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn Profile</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                  type="url"
                                  placeholder="https://linkedin.com/in/..."
                                  className="pl-10"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="github"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GitHub Profile</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                  type="url"
                                  placeholder="https://github.com/..."
                                  className="pl-10"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create an account
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
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
