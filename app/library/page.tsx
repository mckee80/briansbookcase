import { mockEbooks } from '@/data/mockData';
import Link from 'next/link';

export default function Library() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold font-garamond mb-6 text-primary">
          Our Library
        </h1>
        <p className="font-crimson text-lg mb-8 text-gray-700">
          Browse our collection of donated fiction ebooks. All proceeds support suicide prevention initiatives.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockEbooks.map((ebook) => (
            <div
              key={ebook.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-border"
            >
              <div className="h-80 relative bg-gray-100">
                <img
                  src={ebook.coverImage}
                  alt={`Cover of ${ebook.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold font-garamond text-xl mb-2 text-primary">
                  {ebook.title}
                </h3>
                <p className="font-baskerville text-sm text-accent mb-3">
                  by {ebook.author}
                </p>
                <p className="font-crimson text-sm text-gray-600 mb-4 line-clamp-3">
                  {ebook.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{ebook.publicationYear}</span>
                  <button className="px-4 py-2 bg-accent text-white rounded hover:bg-primary transition-colors text-sm">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
