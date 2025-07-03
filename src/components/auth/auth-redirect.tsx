'use client';

import Link from 'next/link';
import type { LinkProps } from 'next/link';
import React from 'react';

interface AuthRedirectProps extends Omit<React.ComponentProps<typeof Link>, 'href'> {
  children: React.ReactNode;
  redirectUrl: string;
}

export function AuthRedirect({ children, redirectUrl, ...props }: AuthRedirectProps) {
  const loginPath = `/login?redirect=${encodeURIComponent(redirectUrl)}`;

  return (
    <Link href={loginPath} {...props}>
      {children}
    </Link>
  );
}
