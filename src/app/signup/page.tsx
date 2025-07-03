'use client';
import { useState } from 'react';
import Link from 'next/link';
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
import { Link2, Linkedin, Github } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function SignupPage() {
  const [role, setRole] = useState('student');

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl mx-auto">
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
          <div className="space-y-4">
            {/* Common Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" placeholder="Max" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" placeholder="Robinson" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enrollment-no">Enrollment No.</Label>
                  <Input id="enrollment-no" placeholder="123456789" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" placeholder="Computer Science" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="New York, NY" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>I am a...</Label>
              <RadioGroup
                defaultValue="student"
                onValueChange={setRole}
                className="flex"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="alumni" id="alumni" />
                  <Label htmlFor="alumni">Alumni</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Student-specific fields */}
            {role === 'student' && (
              <>
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Student Profile</h3>
                  <div className="space-y-2">
                    <Label htmlFor="about-student">Tell us about yourself</Label>
                    <Textarea
                      id="about-student"
                      placeholder="I'm a passionate developer interested in AI..."
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Social Profiles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin-student">LinkedIn Profile</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="linkedin-student"
                          placeholder="https://linkedin.com/in/..."
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github-student">GitHub Profile</Label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="github-student"
                          placeholder="https://github.com/..."
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                 <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                        <Label htmlFor="cv">Upload CV</Label>
                        <Input id="cv" type="file" required/>
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
                     <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input id="position" placeholder="Software Engineer" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" placeholder="Acme Inc." required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about-alumni">About</Label>
                    <Textarea
                      id="about-alumni"
                      placeholder="Experienced professional with a demonstrated history of working in the computer software industry."
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Social Profiles (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="linkedin-alumni">LinkedIn Profile</Label>
                        <div className="relative">
                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                            id="linkedin-alumni"
                            placeholder="https://linkedin.com/in/..."
                            className="pl-10"
                            />
                        </div>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="github-alumni">GitHub Profile</Label>
                        <div className="relative">
                            <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                            id="github-alumni"
                            placeholder="https://github.com/..."
                            className="pl-10"
                            />
                        </div>
                        </div>
                    </div>
                </div>
              </>
            )}


            <Button type="submit" className="w-full">
              <Link href="/dashboard">Create an account</Link>
            </Button>
          </div>
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
