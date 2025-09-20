
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// You can edit the list of news items here.
// Each item should have an id, href, title, and date.
type ScrollItem = {
  id: string;
  href: string;
  title: string;
  date: string;
};

interface AutoScrollListProps {
  items: ScrollItem[];
}

export function AutoScrollList({ items }: AutoScrollListProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  if (!items || items.length === 0) {
    return null;
  }

  // Duplicate the first item and add it to the end for a seamless loop effect
  const extendedItems = [...items, items[0]];

  return (
    <div
      className="relative h-48 w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          'absolute left-0 top-0 flex w-full flex-col',
          isHovered ? 'animate-pause' : 'animate-scroll-up'
        )}
        style={{
          // Controls the speed of the scroll. This should be a multiple of the
          // number of items plus one (for the duplicated item).
          animationDuration: `${extendedItems.length * 3}s`,
        }}
      >
        {extendedItems.map((item, index) => (
          <Link
            href={item.href}
            key={`${item.id}-${index}`}
            className="flex h-12 items-center rounded-md p-2 transition-colors hover:bg-accent"
          >
            <div className="flex-1 space-y-1">
              <p className="truncate text-sm font-medium leading-snug">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground">{item.date}</p>
            </div>
          </Link>
        ))}
      </div>
      <style jsx global>{`
        @keyframes scroll-up {
          0% {
            transform: translateY(0);
          }
          100% {
            // Move the container up by the height of all but one item
            transform: translateY(-${100 - 100 / extendedItems.length}%);
          }
        }
        .animate-scroll-up {
          animation: scroll-up linear infinite;
        }
        .animate-pause {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

    