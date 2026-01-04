export default function Footer() {
  return (
    <footer className="bg-primary text-parchment mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold font-garamond mb-4">Brian's Bookcase</h3>
            <p className="font-crimson text-sm">
              Supporting suicide prevention through the power of donated fiction.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold font-garamond mb-4">Quick Links</h3>
            <ul className="space-y-2 font-crimson text-sm">
              <li><a href="/library" className="hover:text-accent transition-colors">Library</a></li>
              <li><a href="/shop" className="hover:text-accent transition-colors">Shop</a></li>
              <li><a href="/membership" className="hover:text-accent transition-colors">Membership</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold font-garamond mb-4">Support</h3>
            <p className="font-crimson text-sm">
              If you or someone you know is struggling, please reach out for help.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-accent text-center font-crimson text-sm">
          <p>&copy; {new Date().getFullYear()} Brian's Bookcase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
