'use client';

import { useState, useEffect } from 'react';
import { X, Rocket } from 'lucide-react';

const BANNER_DISMISSED_KEY = 'launch-banner-dismissed';

// To reset the banner (for testing), run in browser console:
// localStorage.removeItem('launch-banner-dismissed')

export default function LaunchBanner() {
  // Start with null to indicate "not yet determined"
  const [isVisible, setIsVisible] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
    setIsVisible(!dismissed);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
  };

  // Don't render anything until we've checked localStorage
  if (isVisible === null || isVisible === false) return null;

  return (
    <div className="bg-gradient-to-r from-accent/90 to-primary/90 text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 pr-8">
        <Rocket size={20} className="flex-shrink-0 hidden sm:block" />
        <p className="font-crimson text-sm sm:text-base text-center">
          <span className="font-bold">Help Us Launch!</span>{' '}
          <span className="hidden sm:inline">
            We&apos;re building our library and looking for donated short stories. Share your fiction and support mental health.
          </span>
          <span className="sm:hidden">
            We&apos;re looking for short story submissions.
          </span>
          {' '}Email{' '}
          <a
            href="mailto:mckee80@gmail.com"
            className="underline hover:no-underline font-semibold"
          >
            mckee80@gmail.com
          </a>
        </p>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded transition-colors"
        aria-label="Dismiss banner"
      >
        <X size={18} />
      </button>
    </div>
  );
}
