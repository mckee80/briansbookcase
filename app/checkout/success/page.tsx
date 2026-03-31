import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function CheckoutSuccess() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg border-2 border-border shadow-lg p-12 relative page-corner">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-green-600" size={40} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-garamond mb-4 text-primary">
            Thank You for Your Support!
          </h1>
          <p className="font-crimson text-lg text-gray-700 mb-4">
            Your donation directly funds mental health and crisis intervention programs.
            Every contribution makes a difference.
          </p>
          <p className="font-crimson text-base text-gray-600 mb-8">
            You now have full access to our library of donated stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/library">
              <button className="px-8 py-3 bg-accent text-white rounded-lg hover:bg-primary transition-colors font-semibold font-crimson text-lg">
                Start Reading
              </button>
            </Link>
            <Link href="/account">
              <button className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold font-crimson text-lg">
                View Account
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
