
'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MailCheck, Link2 } from 'lucide-react';

function VerificationContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    return (
        <div className="relative flex min-h-screen items-center justify-center p-4 bg-white">
            <Link href="/" className="absolute top-4 left-4 z-10 flex items-center gap-2 text-foreground hover:text-foreground/80">
                <Link2 className="h-6 w-6 text-primary" />
                <span className="font-semibold">AlumniLink</span>
            </Link>
            <Card className="w-full max-w-md mx-auto text-center shadow-lg">
                <CardHeader>
                    <div className="mx-auto bg-primary rounded-full h-16 w-16 flex items-center justify-center">
                        <MailCheck className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="mt-4 text-2xl">Verify Your Email</CardTitle>
                    <CardDescription>
                        A verification link has been sent to your email address:
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold text-lg">{email || 'your email'}</p>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Please check your inbox (and spam folder) and click the link to complete your registration.
                    </p>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <p className="text-xs text-muted-foreground">
                        Once verified, you can log in to your account.
                    </p>
                    <Button asChild className="w-full">
                        <Link href="/login">Back to Login</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default function PendingVerificationPage() {
    return (
        <Suspense>
            <VerificationContent />
        </Suspense>
    )
}
