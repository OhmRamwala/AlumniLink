'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const images = [
  {
    src: 'https://i.ibb.co/Y4CQjWyD/main1.jpg',
    alt: 'University students collaborating',
    hint: 'university students',
  },
  {
    src: 'https://i.ibb.co/LhkrMW47/main2.webp',
    alt: 'University campus building',
    hint: 'university campus',
  },
  {
    src: 'https://i.ibb.co/FbdwyLdX/main-4.jpg',
    alt: 'Graduation ceremony',
    hint: 'graduation ceremony',
  },
  {
    src: 'https://i.ibb.co/PsJNWDXC/main3.webp',
    alt: 'Students in a lecture hall',
    hint: 'lecture hall',
  },
  {
    src: 'https://i.ibb.co/Vpbh5XXq/main5.jpg',
    alt: 'Alumni networking event',
    hint: 'networking event',
  },
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      {images.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          className={cn(
            'object-cover transition-opacity duration-1000 ease-in-out',
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          )}
          data-ai-hint={image.hint}
          priority={index === 0}
        />
      ))}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center text-primary-foreground">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Connect, Grow, and Succeed with AlumniLink
            </h1>
            <p className="mx-auto max-w-[700px] text-primary-foreground/90 md:text-xl">
              Your exclusive platform to network with fellow alumni, discover
              career opportunities, and stay connected with the university
              community.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button asChild size="lg">
              <Link href="/signup">Join Now</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
