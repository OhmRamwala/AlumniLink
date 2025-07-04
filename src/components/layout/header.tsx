'use client';

import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from './user-nav';

export function Header() {
  const { state, isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b px-4 sm:h-16 sm:px-6">
      {(isMobile || state === 'collapsed') && <SidebarTrigger className="flex" />}
      <div className="flex-1" />
      <UserNav />
    </header>
  );
}
