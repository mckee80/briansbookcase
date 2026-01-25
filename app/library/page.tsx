'use client';

import { useData } from '@/contexts/DataContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Download, Send, BookOpen } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import SendToDeviceModal from '@/components/SendToDeviceModal';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Library() {
  const { ebooks } = useData();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<typeof ebooks[0] | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const requireAuth = (action: () => void) => {
    if (!user) {
      router.push('/login');
      return;
    }
    action();
  };

  const handleDownload = async (ebook: typeof ebooks[0]) => {
    requireAuth(async () => {
      if (ebook.downloadUrl) {
        // Track download
        await supabase.from('book_activity').insert({
          ebook_id: ebook.id,
          user_id: user?.id,
          activity_type: 'download',
        });

        window.open(ebook.downloadUrl, '_blank');
      } else {
        alert('Download not available for this ebook.');
      }
    });
  };

  const handleSendToDevice = (ebook: typeof ebooks[0]) => {
    requireAuth(() => {
      setSelectedEbook(ebook);
      setModalOpen(true);
    });
  };

  const handleSendComplete = async (ebookId: number) => {
    // Track send to device
    await supabase.from('book_activity').insert({
      ebook_id: ebookId,
      user_id: user?.id,
      activity_type: 'send',
    });
  };

  const handleReadNow = (ebook: typeof ebooks[0]) => {
    requireAuth(() => {
      router.push(`/library/read/${ebook.id}`);
    });
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold font-garamond mb-6 text-primary">
          Our Library
        </h1>
        <p className="font-crimson text-lg mb-8 text-gray-700">
          Browse our collection of donated stories. All proceeds support mental health initiatives.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ebooks.map((ebook) => (
            <div
              key={ebook.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-border"
            >
              <div className="h-80 relative bg-gray-100 flex items-center justify-center">
                {ebook.coverImage ? (
                  <img
                    src={ebook.coverImage}
                    alt={`Cover of ${ebook.title}`}
                    className="max-w-full max-h-full object-contain"
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
                <div className="mb-3">
                  <span className="text-xs text-gray-500 font-crimson">
                    {ebook.genre} • {ebook.year}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleReadNow(ebook)}
                    disabled={!ebook.downloadUrl}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded hover:bg-accent transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <BookOpen size={16} />
                    Read Now
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(ebook)}
                      disabled={!ebook.downloadUrl}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-accent text-white rounded hover:bg-primary transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download size={16} />
                      Download
                    </button>
                    <button
                      onClick={() => handleSendToDevice(ebook)}
                      disabled={!ebook.downloadUrl}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-accent text-accent rounded hover:bg-accent hover:text-white transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={16} />
                      Send
                    </button>
                  </div>
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

      {selectedEbook && (
        <SendToDeviceModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          ebookId={selectedEbook.id}
          ebookTitle={selectedEbook.title}
          userId={user?.id || ''}
          onSendComplete={handleSendComplete}
        />
      )}
    </main>
  );
}
