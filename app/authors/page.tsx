'use client';

import { useData } from '@/contexts/DataContext';

export default function Authors() {
  const { ebooks, authors: authorsList } = useData();

  // Get unique authors from ebooks with their books
  const authors = Array.from(new Set(ebooks.map(book => book.author))).map(authorName => {
    const books = ebooks.filter(book => book.author === authorName);
    const authorInfo = authorsList.find(a => a.name === authorName);
    return {
      name: authorName,
      email: authorInfo?.email || '',
      bio: authorInfo?.bio || '',
      photoUrl: authorInfo?.photoUrl || '',
      books: books,
      bookCount: books.length,
    };
  });

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold font-garamond mb-6 text-primary">
          Our Authors
        </h1>
        <p className="font-crimson text-lg mb-8 text-gray-700">
          Meet the generous authors who have donated their work to support suicide prevention.
          Their contributions make our mission possible.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {authors.map((author) => (
            <div key={author.name} className="bg-white rounded-lg border-2 border-border shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all relative page-corner">
              <div className="flex items-start mb-4">
                {author.photoUrl ? (
                  <img
                    src={author.photoUrl}
                    alt={author.name}
                    className={`w-32 h-32 rounded-full mr-6 border-2 border-accent/30 ${
                      author.name === 'Brian Paul McKee' ? 'object-contain bg-white' : 'object-cover object-center'
                    }`}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-5xl font-bold text-accent mr-6">
                    {author.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold font-garamond text-primary mb-1">
                    {author.name}
                  </h2>
                  <p className="text-sm font-crimson text-gray-600">
                    {author.bookCount} {author.bookCount === 1 ? 'book' : 'books'} donated
                  </p>
                </div>
              </div>

              {author.bio && (
                <p className="font-crimson text-gray-700 mb-4 italic border-l-2 border-accent/30 pl-4">
                  {author.bio}
                </p>
              )}

              <div className="space-y-3">
                <h3 className="font-bold font-baskerville text-accent mb-2">Contributed Works:</h3>
                {author.books.map((book) => (
                  <div key={book.id} className="border-l-2 border-accent/30 pl-4">
                    <p className="font-bold font-garamond text-primary">{book.title}</p>
                    <p className="text-sm font-crimson text-gray-600">{book.genre} • {book.year}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border-2 border-border shadow-lg p-8 text-center relative page-corner">
          <h2 className="text-3xl font-bold font-garamond mb-4 text-primary border-b-2 border-border pb-3">
            Are You an Author?
          </h2>
          <p className="font-crimson text-lg text-primary mb-6 max-w-2xl mx-auto">
            Join our community of compassionate authors making a difference. Donate your fiction
            to support suicide prevention and help us reach more readers.
          </p>
          <div className="space-y-4 mb-6">
            <div className="bg-parchment rounded-lg border border-border p-4 max-w-md mx-auto">
              <h3 className="font-bold font-garamond text-primary mb-2">Benefits of Contributing:</h3>
              <ul className="text-left font-crimson text-primary space-y-2">
                <li className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  Support a meaningful cause
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  Reach new readers
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  Featured author profile
                </li>
              </ul>
            </div>
          </div>
          <button className="px-8 py-3 bg-accent text-white rounded-lg hover:bg-primary transition-colors font-semibold text-lg">
            Become a Contributing Author
          </button>
        </div>
      </div>
    </main>
  );
}
