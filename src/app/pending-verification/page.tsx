
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
import { MailCheck } from 'lucide-react';

function VerificationContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    return (
        <div className="relative flex min-h-screen items-center justify-center p-4">
            <Image
                src="https://placehold.co/1920x1080.png"
                alt="University campus background"
                fill
                className="object-cover -z-10 brightness-50"
                data-ai-hint="university campus"
            />
            <Card className="w-full max-w-md mx-auto text-center">
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
