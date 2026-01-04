'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="bg-primary text-parchment shadow-md border-b-4 border-accent">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold font-garamond hover:text-accent transition-colors">
            Brian's Bookcase
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/library" className="hover:text-accent transition-colors">
              Library
            </Link>
            <Link href="/shop" className="hover:text-accent transition-colors">
              Shop
            </Link>
            <Link href="/membership" className="hover:text-accent transition-colors">
              Membership
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
        </div>
      </nav>
    </header>
  );
}
