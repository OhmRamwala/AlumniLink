
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  Linkedin,
  Github,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import { doc, getDoc, type DocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User as UserProfileData } from '@/lib/types';

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  if (!db) {
    notFound();
  }

  let userDoc: DocumentSnapshot;
  try {
    const userDocRef = doc(db, 'users', params.id);
    userDoc = await getDoc(userDocRef);
  } catch (error) {
    console.error('Firestore error fetching user profile:', error);
    // This can happen due to permission errors or other issues.
    // We'll treat it as "not found" to prevent crashing.
    return notFound();
  }

  if (!userDoc.exists()) {
    notFound();
  }

  const user = userDoc.data() as UserProfileData;
  user.id = params.id; // Add the doc id to the user object

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild>
          <Link href="/dashboard/directory">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader className="items-center text-center">
          <Avatar className="h-32 w-32 mb-4">
            <AvatarImage
              src={user.avatar || `https://placehold.co/128x128.png`}
              alt={`${user.firstName} ${user.lastName}`}
              data-ai-hint="professional headshot"
            />
            <AvatarFallback className="text-4xl">
              {user.firstName[0]}
              {user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl">
            {user.firstName} {user.lastName}
          </CardTitle>
          <CardDescription className="text-base">
            {user.role === 'alumni'
              ? `${user.jobTitle} at ${user.company}`
              : `Student, ${user.major}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="max-w-2xl mx-auto">
          <div className="space-y-6 text-center md:text-left">
            <div className="prose prose-sm text-muted-foreground mx-auto text-center">
              <p>{user.about}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                <span>
                  {user.role === 'alumni'
                    ? `Graduated ${user.graduationYear}`
                    : `Expected Graduation ${user.graduationYear}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{user.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a href={`mailto:${user.email}`} className="hover:underline">
                  {user.email}
                </a>
              </div>
            </div>
            
            {user.role === 'student' && user.cvUrl && (
              <div className="pt-4 border-t flex flex-col items-center sm:items-start">
                <h3 className="font-semibold mb-2 text-lg w-full text-center md:text-left">Curriculum Vitae (CV)</h3>
                <Button asChild variant="outline">
                    <a href={user.cvUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="mr-2 h-4 w-4" />
                        View CV
                    </a>
                </Button>
              </div>
            )}

            <div className="flex justify-center gap-4 pt-4 border-t">
              {user.linkedin && (
                <Button variant="outline" size="icon" asChild>
                  <a href={user.linkedin} target="_blank" rel="noreferrer">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
              )}
              {user.github && (
                <Button variant="outline" size="icon" asChild>
                  <a href={user.github} target="_blank" rel="noreferrer">
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
