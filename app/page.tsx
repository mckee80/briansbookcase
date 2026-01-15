import Link from 'next/link';
import { Book, Heart, ShoppingBag } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <section className="text-center mb-24">
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-7xl font-bold font-garamond mb-2 text-primary leading-tight">
              Read Stories, Change Lives
            </h1>
            <p className="text-4xl font-light font-garamond italic text-gray-600 mb-8">
              Building Hope One Story at a Time
            </p>
            <div className="text-left max-w-3xl mx-auto space-y-6 mb-12 font-crimson text-lg leading-relaxed text-primary bg-white p-10 rounded-lg border-2 border-border shadow-lg relative page-corner">
              <p className="drop-cap">
                Every story you read here supports suicide prevention. Our library features donated fiction from talented writers—100% of membership contributions fund crisis intervention services and mental health programs that save lives.
              </p>
              <p>
                If you&apos;ve struggled with mental health, or watched someone you love fight that battle, you know how much support matters. Every person helped by these charities is someone&apos;s child, friend, or relative. Use your love of stories to give someone suffering a helping hand.
              </p>
              <p>
                Access our full library of donated fiction and short stories at any membership level—$0, $5, $10, or $20 monthly. The amount you give doesn&apos;t change your access; it simply reflects what you&apos;re able to contribute to the cause. New stories added every month.
              </p>
              <p className="font-bold text-primary">
                We believe that a LARGE number of people, doing something SMALL consistently, can lead to GREAT things.
              </p>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-right font-crimson italic text-gray-700">
                  — Sean McKee
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/membership">
                <button className="px-8 py-4 bg-accent text-white rounded-lg hover:bg-primary transition-colors font-semibold text-lg">
                  Join Us!
                </button>
              </Link>
              <Link href="/library">
                <button className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg">
                  Browse Library
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-accent text-white rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 hover:rotate-0 transition-transform">
              <Book size={40} />
            </div>
            <h3 className="text-2xl font-bold font-garamond mb-3">Unlimited Stories</h3>
            <p className="font-crimson text-gray-700">
              Members get full access to our curated library of stories
            </p>
          </div>

          <div className="text-center p-8">
            <div className="w-20 h-20 bg-accent text-white rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 hover:rotate-0 transition-transform">
              <Heart size={40} />
            </div>
            <h3 className="text-2xl font-bold font-garamond mb-3">Support Mental Health</h3>
            <p className="font-crimson text-gray-700">
              100% of membership fees fund suicide prevention and mental health programs
            </p>
          </div>

          <div className="text-center p-8">
            <div className="w-20 h-20 bg-accent text-white rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 hover:rotate-0 transition-transform">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-2xl font-bold font-garamond mb-3">Shop for Everyone</h3>
            <p className="font-crimson text-gray-700">
              Browse and purchase our merchandise - no membership required
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
