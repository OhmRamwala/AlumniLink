import Link from 'next/link';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { AuthRedirect } from '@/components/auth/auth-redirect';

const NavLink = ({ redirectUrl, children }: { redirectUrl: string, children: React.ReactNode }) => (
    <AuthRedirect redirectUrl={redirectUrl} className="text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:text-primary-foreground/80">
        {children}
    </AuthRedirect>
);

const NavDropdown = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:text-primary-foreground/80 focus:outline-none">
      {label}
      <ChevronDown className="h-4 w-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      {children}
    </DropdownMenuContent>
  </DropdownMenu>
);

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* Top bar */}
      <div className="bg-background">
        <div className="container flex h-20 items-center justify-between px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-3 text-foreground">
            <Image
              src="https://i.ibb.co/nMdDdh3q/logo.png"
              alt="Sarvajanik College of Engineering and Technology Logo"
              width={60}
              height={60}
              className="h-14 w-14 shrink-0"
            />
            <span className="hidden text-lg font-bold tracking-tight sm:block">
            C.K Pithawalla College of Engineering & Technology
            </span>
          </Link>
          <Button asChild>
            <Link href="/login">SIGN UP / LOGIN</Link>
          </Button>
        </div>
      </div>

      {/* Bottom bar */}
      <nav className="hidden w-full bg-blue-900 md:flex">
        <div className="container flex h-12 items-center justify-center gap-6 px-4 lg:px-8">
            <Link href="/" className="text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:text-primary-foreground/80">Home</Link>
            
            <Link href="/#events" className="text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:text-primary-foreground/80">Events</Link>
            <Link href="/#news" className="text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:text-primary-foreground/80">News</Link>
            
            <NavDropdown label="Find Alumni">
                <DropdownMenuItem asChild><AuthRedirect redirectUrl="/dashboard/directory">Alumni Directory</AuthRedirect></DropdownMenuItem>
            </NavDropdown>

            <NavLink redirectUrl="/dashboard/jobs">Jobs</NavLink>
            
            <Link href="/#about" className="text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:text-primary-foreground/80">About</Link>
        </div>
      </nav>
    </header>
  );
}
