'use client';

import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from './user-nav';
import { ThemeToggle } from '../theme-toggle';

export function Header() {
  const { isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-16 sm:px-6">
      {isMobile && <SidebarTrigger className="flex" />}
      <div className="flex-1" />
      <ThemeToggle />
      <UserNav />
    </header>
  );
}
