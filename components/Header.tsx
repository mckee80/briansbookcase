import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-primary text-parchment shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold font-garamond">
            BriansBookcase
          </Link>
          <div className="flex space-x-6">
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
            <Link href="/account" className="hover:text-accent transition-colors">
              Account
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
