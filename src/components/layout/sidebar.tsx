'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';

const menuItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/dashboard/news',
    icon: Newspaper,
    label: 'News',
  },
  {
    href: '/dashboard/events',
    icon: CalendarDays,
    label: 'Events',
  },
  {
    href: '/dashboard/jobs',
    icon: Briefcase,
    label: 'Jobs',
  },
  {
    href: '/dashboard/directory',
    icon: Users,
    label: 'Directory',
  },
  {
    href: '/dashboard/forum',
    icon: MessagesSquare,
    label: 'Forum',
  },
];

export function AppSidebar() {
  const pathname = usePathname();

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
        {menuItems.map((item) => (
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
