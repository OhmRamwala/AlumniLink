import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ALLOWED_IMAGE_HOSTS = [
  'placehold.co',
  'firebasestorage.googleapis.com',
  'i.ibb.co',
  'ibb.co',
  'static.vecteezy.com',
  'miro.medium.com',
  'old.ckpcet.ac.in',
  'ckpcet.ac.in',
  'media.licdn.com',
  'encrypted-tbn0.gstatic.com',
  'i.ibb.co',
  'ibbc.co', // This seems to be the problematic one from testing. Even if invalid, checking it is safe.
];

export function getSafeImageUrl(url: string | null | undefined): string {
  const fallbackUrl = 'https://placehold.co/600x400.png';
  if (!url) {
    return fallbackUrl;
  }
  try {
    const { hostname } = new URL(url);
    if (ALLOWED_IMAGE_HOSTS.some(allowedHost => hostname.endsWith(allowedHost))) {
      return url;
    }
  } catch (error) {
    // Invalid URL format
    return fallbackUrl;
  }
  // Hostname not in allowlist
  return fallbackUrl;
}

    