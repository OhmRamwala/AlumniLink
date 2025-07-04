'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User as UserProfile } from '@/lib/types';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  Briefcase,
  Users,
  MessagesSquare,
  LogOut,
  Link2,
  HeartHandshake,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    roles: ['student', 'alumni', 'admin'],
  },
  {
    href: '/dashboard/news',
    icon: Newspaper,
    label: 'News',
    roles: ['student', 'alumni', 'admin'],
  },
  {
    href: '/dashboard/events',
    icon: CalendarDays,
    label: 'Events',
    roles: ['student', 'alumni', 'admin'],
  },
  {
    href: '/dashboard/jobs',
    icon: Briefcase,
    label: 'Jobs',
    roles: ['student', 'alumni', 'admin'],
  },
  {
    href: '/dashboard/directory',
    icon: Users,
    label: 'Directory',
    roles: ['student', 'alumni', 'admin'],
  },
  {
    href: '/dashboard/forum',
    icon: MessagesSquare,
    label: 'Forum',
    roles: ['student', 'alumni', 'admin'],
  },
  {
    href: '/dashboard/donations',
    icon: HeartHandshake,
    label: 'Donations',
    roles: ['alumni', 'admin'],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { state } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    if (!auth || !db) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile({ id: user.uid, ...userDoc.data() } as UserProfile);
        } else {
          // User authenticated but no profile in Firestore.
          // This is an invalid state, so we'll log them out.
          setUserProfile(null);
          router.push('/login');
        }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const visibleMenuItems = menuItems.filter((item) =>
    !item.roles || (userProfile && item.roles.includes(userProfile.role))
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 justify-center">
        <div className="flex h-full w-full items-center">
          <Link
            href="/dashboard"
            className={cn(
              'flex h-full items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground w-full',
              state === 'collapsed' ? 'justify-center' : 'justify-start pl-2'
            )}
          >
            <Link2
              className={cn(
                'h-5 w-5 flex-shrink-0 text-primary transition-all'
              )}
            />
            {state === 'expanded' && (
              <span className="whitespace-nowrap font-semibold text-base">
                AlumniLink
              </span>
            )}
          </Link>
          {state === 'expanded' && <SidebarTrigger className="shrink-0" />}
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1">
        {visibleMenuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href}>
              <SidebarMenuButton
                isActive={pathname === item.href}
                className={cn('w-full', state === 'collapsed' ? 'justify-center' : 'justify-start')}
                tooltip={{
                  children: item.label,
                  side: 'top',
                  align: 'center',
                }}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleLogout}
            className={cn('w-full', state === 'collapsed' ? 'justify-center' : 'justify-start')}
            tooltip={{
              children: 'Logout',
              side: 'top',
              align: 'center',
            }}
          >
            <LogOut />
            <span>Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
