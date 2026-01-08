'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/adminCheck';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-primary text-parchment shadow-md border-b-4 border-accent">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold font-garamond hover:text-accent transition-colors">
            Brian&apos;s Bookcase
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/library" className="hover:text-accent transition-colors">
              Library
            </Link>
            <Link href="/shop" className="hover:text-accent transition-colors">
              Shop
            </Link>
            <Link href="/membership" className="hover:text-accent transition-colors">
              Join Us!
            </Link>
            <Link href="/about" className="hover:text-accent transition-colors">
              About
            </Link>
            <Link href="/authors" className="hover:text-accent transition-colors">
              Authors
            </Link>

            {user ? (
              <>
                <Link href="/account" className="hover:text-accent transition-colors">
                  Account
                </Link>
                {isAdmin(user) && (
                  <Link href="/admin" className="hover:text-accent transition-colors">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-accent rounded hover:bg-opacity-80 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-accent transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-accent rounded hover:bg-opacity-80 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded hover:bg-accent/20 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-accent/30">
            <div className="flex flex-col space-y-4">
              <Link
                href="/library"
                className="hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Library
              </Link>
              <Link
                href="/shop"
                className="hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/membership"
                className="hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join Us!
              </Link>
              <Link
                href="/about"
                className="hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/authors"
                className="hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Authors
              </Link>

              {user ? (
                <>
                  <Link
                    href="/account"
                    className="hover:text-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Account
                  </Link>
                  {isAdmin(user) && (
                    <Link
                      href="/admin"
                      className="hover:text-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-accent rounded hover:bg-opacity-80 transition-colors text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hover:text-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-accent rounded hover:bg-opacity-80 transition-colors inline-block text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
