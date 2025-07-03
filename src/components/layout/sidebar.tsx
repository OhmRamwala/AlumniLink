'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
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

  useEffect(() => {
    if (!auth || !db) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const visibleMenuItems = menuItems.filter(item => 
    !item.roles || (userProfile && item.roles.includes(userProfile.role))
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground"
        >
          <Link2 className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold">AlumniLink</span>
        </Link>
      </SidebarHeader>
      <SidebarMenu className="flex-1">
        {visibleMenuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href}>
              <SidebarMenuButton
                isActive={pathname === item.href}
                tooltip={item.label}
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
          <Link href="/login">
            <SidebarMenuButton tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
