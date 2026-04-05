export default function Footer() {
  return (
    <footer className="bg-primary text-parchment mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold font-garamond mb-4">Brian&apos;s Bookcase</h3>
            <p className="font-crimson text-sm">
              Supporting mental health through the power of donated fiction.
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
              <li><a href="/membership" className="hover:text-accent transition-colors">Support Us</a></li>
              <li><a href="/contribute" className="hover:text-accent transition-colors">Become a Contributing Author</a></li>
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
          <p className="mt-4 text-xs text-parchment/60 max-w-3xl mx-auto">
            Brian&apos;s Bookcase is a Pennsylvania nonprofit corporation operating through a fiscal sponsorship with Players Philanthropy Fund, Inc., a Texas nonprofit corporation recognized by IRS as a tax-exempt public charity under Section 501(c)(3) of the Internal Revenue Code (Federal Tax ID: 27-6601178, ppf.org/pp). Contributions to Brian&apos;s Bookcase qualify as tax-deductible to the fullest extent of the law.
          </p>
        </div>
      </div>
    </footer>
  );
}
