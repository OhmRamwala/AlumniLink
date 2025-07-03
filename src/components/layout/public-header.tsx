import Link from 'next/link';
import { Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PublicHeader() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-background border-b sticky top-0 z-50">
      <Link
        href="#"
        className="flex items-center justify-center"
        prefetch={false}
      >
        <Link2 className="h-6 w-6 text-primary" />
        <span className="sr-only">AlumniLink</span>
      </Link>
       <h1 className="ml-2 text-lg font-bold">AlumniLink</h1>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <Link
          href="#events"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          Events
        </Link>
        <Link
          href="#news"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          News
        </Link>
        <Link
          href="#jobs"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          Jobs
        </Link>
         <Button asChild size="sm">
            <Link href="/login">Login/Signup</Link>
        </Button>
      </nav>
    </header>
  );
}
