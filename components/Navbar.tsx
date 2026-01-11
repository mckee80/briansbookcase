'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/adminCheck';
import { User, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  // Get user's first initial for avatar
  const getUserInitial = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
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
            <Link href="/about" className="hover:text-accent transition-colors">
              About
            </Link>
            <Link href="/library" className="hover:text-accent transition-colors">
              Library
            </Link>
            <Link href="/authors" className="hover:text-accent transition-colors">
              Authors
            </Link>
            <Link href="/shop" className="hover:text-accent transition-colors">
              Shop
            </Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 hover:text-accent transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-semibold">
                    {getUserInitial()}
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border-2 border-border py-2 z-50">
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-primary hover:bg-parchment transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Account
                    </Link>
                    {isAdmin(user) && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-primary hover:bg-parchment transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-primary hover:bg-parchment transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-accent transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/membership"
                  className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-primary transition-colors font-semibold"
                >
                  Join Us!
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
                href="/about"
                className="hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/library"
                className="hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Library
              </Link>
              <Link
                href="/authors"
                className="hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Authors
              </Link>
              <Link
                href="/shop"
                className="hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
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
                    href="/membership"
                    className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-primary transition-colors font-semibold text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Join Us!
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
