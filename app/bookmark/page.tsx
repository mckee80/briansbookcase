'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BookmarkRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Track bookmark scan in Google Analytics (if available)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'bookmark_scan', {
        event_category: 'acquisition',
        event_label: 'bookmark_qr_code',
      });
    }

    // Redirect to homepage after brief delay
    const timer = setTimeout(() => {
      router.push('/');
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-parchment">
      <div className="text-center max-w-md p-8">
        <h1 className="text-3xl font-bold font-garamond text-primary mb-4">
          Welcome to Brian&apos;s Bookcase!
        </h1>
        <p className="font-crimson text-lg text-gray-700 mb-2">
          Thanks for scanning our bookmark.
        </p>
        <p className="font-crimson text-gray-600">
          Redirecting you to our free library...
        </p>
        <div className="mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
        </div>
      </div>
    </main>
  );
}
