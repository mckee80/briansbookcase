export default function Footer() {
  return (
    <footer className="bg-primary text-parchment mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold font-garamond mb-4">Brian&apos;s Bookcase</h3>
            <p className="font-crimson text-sm">
              Supporting suicide prevention through the power of donated fiction.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold font-garamond mb-4">Explore</h3>
            <ul className="space-y-2 font-crimson text-sm">
              <li><a href="/library" className="hover:text-accent transition-colors">Library</a></li>
              <li><a href="/authors" className="hover:text-accent transition-colors">Authors</a></li>
              <li><a href="/shop" className="hover:text-accent transition-colors">Shop</a></li>
              <li><a href="/about" className="hover:text-accent transition-colors">About</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold font-garamond mb-4">Get Involved</h3>
            <ul className="space-y-2 font-crimson text-sm">
              <li><a href="/membership" className="hover:text-accent transition-colors">Join Us</a></li>
              <li><a href="/authors" className="hover:text-accent transition-colors">Become a Contributing Author</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold font-garamond mb-4">Support</h3>
            <p className="font-crimson text-sm mb-3">
              If you or someone you know is struggling, please reach out for help.
            </p>
            <ul className="space-y-2 font-crimson text-sm">
              <li>
                <a
                  href="https://988lifeline.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors font-semibold"
                >
                  988 Suicide & Crisis Lifeline →
                </a>
              </li>
              <li>
                <a
                  href="https://www.crisistextline.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Crisis Text Line: Text HOME to 741741
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-accent text-center font-crimson text-sm">
          <p>&copy; {new Date().getFullYear()} Brian&apos;s Bookcase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
