'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import EpubReader from '@/components/EpubReader/EpubReader';
import { X } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ReadPage() {
  const params = useParams();
  const router = useRouter();
  const ebookId = Number(params.id);

  const [user, setUser] = useState<any>(null);
  const [ebook, setEbook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check authentication
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        if (!currentUser) {
          router.push(`/login?redirect=/library/read/${ebookId}`);
          return;
        }

        setUser(currentUser);

        // Fetch ebook data
        const { data: ebookData, error: ebookError } = await supabase
          .from('ebooks')
          .select('*')
          .eq('id', ebookId)
          .single();

        if (ebookError || !ebookData) {
          setError('Ebook not found');
          setLoading(false);
          return;
        }

        if (!ebookData.download_url) {
          setError('This ebook is not available for reading');
          setLoading(false);
          return;
        }

        setEbook(ebookData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading reader:', err);
        setError('Failed to load ebook');
        setLoading(false);
      }
    };

    loadData();
  }, [ebookId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 font-crimson text-primary">Loading reader...</p>
        </div>
      </div>
    );
  }

  if (error || !ebook) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold font-garamond text-primary mb-4">
            Error
          </h1>
          <p className="font-crimson text-gray-700 mb-6">
            {error || 'Failed to load ebook'}
          </p>
          <button
            onClick={() => router.push('/library')}
            className="px-6 py-3 bg-accent text-white rounded hover:bg-primary transition-colors font-crimson"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Close button */}
      <button
        onClick={() => router.push('/library')}
        className="fixed top-4 right-4 z-50 p-2 bg-white rounded-full shadow-lg border-2 border-accent text-accent hover:bg-accent hover:text-white transition-colors"
        title="Close Reader"
      >
        <X size={24} />
      </button>

      <EpubReader
        ebookId={ebookId}
        ebookUrl={ebook.download_url}
        ebookTitle={ebook.title}
        userId={user.id}
      />
    </>
  );
}
