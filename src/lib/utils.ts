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
  'ibbc.co',
  'static.vecteezy.com',
  'miro.medium.com',
  'old.ckpcet.ac.in',
  'ckpcet.ac.in',
  'media.licdn.com',
  'encrypted-tbn0.gstatic.com',
];

export function getSafeImageUrl(url: string | null | undefined): string {
  const fallbackUrl = 'https://placehold.co/600x400.png';
  if (!url) {
    return fallbackUrl;
  }
  try {
    const { hostname } = new URL(url);
    // Stricter check: hostname must exactly match one of the allowed hosts.
    if (ALLOWED_IMAGE_HOSTS.includes(hostname)) {
      return url;
    }
  } catch (error) {
    // Invalid URL format
    return fallbackUrl;
  }
  // Hostname not in allowlist
  return fallbackUrl;
}