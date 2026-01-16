import Link from 'next/link';

export default function Shop() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-garamond mb-4 text-primary">
            Shop
          </h1>
          <p className="font-crimson text-lg text-gray-700">
            Support mental health with every purchase
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white rounded-lg border-2 border-border shadow-lg p-12 text-center relative page-corner">
          <div className="mb-8">
            <div className="text-8xl mb-6">📚</div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-garamond mb-4 text-primary">
              Cool Merch Coming Soon!
            </h2>
            <p className="font-crimson text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              We&apos;re working on some amazing merchandise to help you show your support for mental health awareness. Check back soon for t-shirts, mugs, bookmarks, and more!
            </p>
          </div>

          <div className="border-t-2 border-border pt-8 mt-8">
            <p className="font-crimson text-lg text-primary mb-6">
              In the meantime, you can support our mission by joining our community:
            </p>
            <Link href="/membership">
              <button className="px-8 py-3 bg-accent text-white rounded-lg hover:bg-primary transition-colors font-semibold text-lg">
                Explore Membership Options
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
