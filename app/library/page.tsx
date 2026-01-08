'use client';

import { useData } from '@/contexts/DataContext';
import Link from 'next/link';
import { Download } from 'lucide-react';

export default function Library() {
  const { ebooks } = useData();

  const handleDownload = (ebook: typeof ebooks[0]) => {
    if (ebook.downloadUrl) {
      // Open download URL in new tab
      window.open(ebook.downloadUrl, '_blank');
    } else {
      alert('Download not available for this ebook.');
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold font-garamond mb-6 text-primary">
          Our Library
        </h1>
        <p className="font-crimson text-lg mb-8 text-gray-700">
          Browse our collection of donated stories. All proceeds support suicide prevention initiatives.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ebooks.map((ebook) => (
            <div
              key={ebook.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-border"
            >
              <div className="h-80 relative bg-gray-100">
                {ebook.coverImage ? (
                  <img
                    src={ebook.coverImage}
                    alt={`Cover of ${ebook.title}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                    <div className="text-center p-4">
                      <div className="text-6xl mb-2">📚</div>
                      <p className="font-garamond text-primary font-bold">{ebook.title}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold font-garamond text-xl mb-2 text-primary">
                  {ebook.title}
                </h3>
                <p className="font-baskerville text-sm text-accent mb-3">
                  by {ebook.author}
                </p>
                {ebook.description && (
                  <p className="font-crimson text-sm text-gray-600 mb-4 line-clamp-3">
                    {ebook.description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-crimson">
                    {ebook.genre} • {ebook.year}
                  </span>
                  <button
                    onClick={() => handleDownload(ebook)}
                    disabled={!ebook.downloadUrl}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded hover:bg-primary transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {ebooks.length === 0 && (
          <div className="text-center py-16">
            <p className="font-crimson text-xl text-gray-600">
              No stories available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
