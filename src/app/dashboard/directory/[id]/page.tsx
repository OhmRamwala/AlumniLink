
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  GraduationCap,
  MapPin,
  Mail,
  Linkedin,
  Github,
  ArrowLeft,
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User as UserProfileData } from '@/lib/types';

function UserProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-48" />
      </div>
      <Card>
        <CardHeader className="items-center text-center">
          <Skeleton className="h-32 w-32 rounded-full mb-4" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-5 w-3/4 mt-2" />
        </CardHeader>
        <CardContent className="max-w-2xl mx-auto">
          <div className="space-y-6 text-center md:text-left">
            <div className="prose prose-sm mx-auto text-center space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-11/12" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="flex justify-center gap-4 pt-4 border-t">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UserProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const defaultAvatar = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

  useEffect(() => {
    if (!db || !id) {
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const userDocRef = doc(db, 'users', id);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = { id, ...userDoc.data() } as UserProfileData;
          setUser(userData);
        } else {
          notFound();
        }
      } catch (error) {
        console.error('Firestore error fetching user profile:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  if (!user) {
    notFound();
  }

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
              src={user.avatar || defaultAvatar}
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
              ? `${user.position} at ${user.company}`
              : `Student, ${user.major}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="max-w-2xl mx-auto">
          <div className="space-y-6 text-center md:text-left">
            <div className="prose prose-sm text-muted-foreground mx-auto text-center">
              <p>{user.about}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              {user.graduationYear && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <span>
                    {user.role === 'alumni'
                      ? `Graduated ${user.graduationYear}`
                      : `Expected Graduation ${user.graduationYear}`}
                  </span>
                </div>
              )}
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
