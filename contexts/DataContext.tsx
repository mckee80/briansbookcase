'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { extractEbookCover } from '@/lib/extractEbookCover';

// Create Supabase client with proper auth persistence
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Types
export interface Ebook {
  id: number;
  title: string;
  author: string;
  genre: string;
  year: number;
  description?: string;
  coverImage?: string;
  pageCount?: number;
  downloadUrl?: string;
}

export interface Author {
  id: number;
  name: string;
  email: string;
  bio?: string;
  photoUrl?: string;
  booksCount: number;
}

interface DataContextType {
  ebooks: Ebook[];
  authors: Author[];
  loading: boolean;
  addEbook: (ebook: Omit<Ebook, 'id'>, file?: File, coverImage?: File) => Promise<void>;
  removeEbook: (id: number) => Promise<void>;
  addAuthor: (author: Omit<Author, 'id' | 'booksCount'>) => Promise<void>;
  updateAuthor: (id: number, updates: Partial<Omit<Author, 'id' | 'booksCount'>>, photoFile?: File) => Promise<void>;
  removeAuthor: (id: number) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial fallback data (used if database is not configured)
const initialEbooks: Ebook[] = [
  {
    id: 1,
    title: 'The Silent Echo',
    author: 'Sarah Mitchell',
    genre: 'Contemporary Fiction',
    year: 2023,
    description: 'A powerful story about finding hope in the darkest moments.',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    pageCount: 342,
    downloadUrl: '/downloads/silent-echo.epub',
  },
  {
    id: 2,
    title: 'Whispers of Tomorrow',
    author: 'David Chen',
    genre: 'Drama',
    year: 2022,
    description: 'An inspiring tale of resilience and human connection.',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    pageCount: 298,
    downloadUrl: '/downloads/whispers-tomorrow.epub',
  },
  {
    id: 3,
    title: 'Beyond the Horizon',
    author: 'Maria Rodriguez',
    genre: 'Literary Fiction',
    year: 2023,
    description: 'A beautifully written narrative about healing and friendship.',
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
    pageCount: 411,
    downloadUrl: '/downloads/beyond-horizon.epub',
  },
  {
    id: 4,
    title: "The Lighthouse Keeper's Song",
    author: 'James Patterson',
    genre: 'Fiction',
    year: 2021,
    description: 'A heartwarming story of redemption and community support.',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    pageCount: 367,
    downloadUrl: '/downloads/lighthouse-song.epub',
  },
];

const initialAuthors: Author[] = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah@example.com', booksCount: 1 },
  { id: 2, name: 'David Chen', email: 'david@example.com', booksCount: 1 },
  { id: 3, name: 'Maria Rodriguez', email: 'maria@example.com', booksCount: 1 },
  { id: 4, name: 'James Patterson', email: 'james@example.com', booksCount: 1 },
];

// Helper function to map database row to Ebook type
function mapDbToEbook(row: any): Ebook {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    genre: row.genre,
    year: row.year,
    description: row.description || undefined,
    coverImage: row.cover_image || undefined,
    pageCount: row.page_count || undefined,
    downloadUrl: row.download_url || undefined,
  };
}

// Helper function to map database row to Author type
function mapDbToAuthor(row: any): Author {
  return {
    id: row.id,
    name: row.name,
    email: row.email || '',
    bio: row.bio || undefined,
    photoUrl: row.photo_url || undefined,
    booksCount: row.books_count || 0,
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Supabase
  const fetchEbooks = async () => {
    try {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setEbooks(data.map(mapDbToEbook));
      }
    } catch (error) {
      console.error('Error fetching ebooks:', error);
      // Fallback to localStorage or initial data
      const storedEbooks = localStorage.getItem('ebooks');
      if (storedEbooks) {
        setEbooks(JSON.parse(storedEbooks));
      } else {
        setEbooks(initialEbooks);
      }
    }
  };

  const fetchAuthors = async () => {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      if (data) {
        setAuthors(data.map(mapDbToAuthor));
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
      // Fallback to localStorage or initial data
      const storedAuthors = localStorage.getItem('authors');
      if (storedAuthors) {
        setAuthors(JSON.parse(storedAuthors));
      } else {
        setAuthors(initialAuthors);
      }
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchEbooks(), fetchAuthors()]);
    setLoading(false);
  };

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, []);

  // Backup to localStorage
  useEffect(() => {
    if (ebooks.length > 0 && !loading) {
      localStorage.setItem('ebooks', JSON.stringify(ebooks));
    }
  }, [ebooks, loading]);

  useEffect(() => {
    if (authors.length > 0 && !loading) {
      localStorage.setItem('authors', JSON.stringify(authors));
    }
  }, [authors, loading]);

  const addEbook = async (ebook: Omit<Ebook, 'id'>, file?: File, coverImage?: File) => {
    try {
      let downloadUrl = ebook.downloadUrl || null;
      let coverImageUrl = ebook.coverImage || null;

      // Upload ebook file to Supabase Storage if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${ebook.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('ebooks')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from('ebooks')
          .getPublicUrl(fileName);

        downloadUrl = urlData.publicUrl;

        // If no cover image provided, try to extract from ebook file
        if (!coverImage && file.name.toLowerCase().endsWith('.epub')) {
          console.log('Attempting to extract cover from EPUB file...');
          const extractedCover = await extractEbookCover(file);
          if (extractedCover) {
            coverImage = extractedCover;
            console.log('Successfully extracted cover from EPUB');
          } else {
            console.log('Could not extract cover from EPUB');
          }
        }
      }

      // Upload cover image to Supabase Storage if provided (or extracted)
      if (coverImage) {
        const fileExt = coverImage.name.split('.').pop();
        const coverFileName = `cover-${Date.now()}-${ebook.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExt}`;

        const { data: coverUploadData, error: coverUploadError } = await supabase.storage
          .from('ebooks')
          .upload(coverFileName, coverImage, {
            cacheControl: '3600',
            upsert: false,
          });

        if (coverUploadError) throw coverUploadError;

        // Get public URL for the cover image
        const { data: coverUrlData } = supabase.storage
          .from('ebooks')
          .getPublicUrl(coverFileName);

        coverImageUrl = coverUrlData.publicUrl;
      }

      const { data, error } = await supabase
        .from('ebooks')
        .insert([
          {
            title: ebook.title,
            author: ebook.author,
            genre: ebook.genre,
            year: ebook.year,
            description: ebook.description || null,
            cover_image: coverImageUrl,
            page_count: ebook.pageCount || null,
            download_url: downloadUrl,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Refresh data to get updated counts
        await refreshData();
      }
    } catch (error) {
      console.error('Error adding ebook:', error);
      // Fallback to local state
      const newEbook = {
        ...ebook,
        id: Math.max(...ebooks.map(e => e.id), 0) + 1,
      };
      setEbooks([...ebooks, newEbook]);
      throw error;
    }
  };

  const removeEbook = async (id: number) => {
    try {
      // First, get the ebook to find its download URL
      const ebookToRemove = ebooks.find(e => e.id === id);

      // Delete from database
      const { error } = await supabase
        .from('ebooks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Delete file from storage if it exists
      if (ebookToRemove?.downloadUrl) {
        try {
          const fileName = ebookToRemove.downloadUrl.split('/').pop();
          if (fileName) {
            await supabase.storage.from('ebooks').remove([fileName]);
          }
        } catch (storageError) {
          console.warn('Failed to delete file from storage:', storageError);
          // Don't throw - the database record is already deleted
        }
      }

      // Refresh data to get updated counts
      try {
        await refreshData();
      } catch (refreshError) {
        // If refresh fails, just update local state
        console.warn('Failed to refresh after delete, updating local state:', refreshError);
        setEbooks(ebooks.filter(e => e.id !== id));
      }
    } catch (error) {
      console.error('Error removing ebook:', error);
      // Fallback to local state
      setEbooks(ebooks.filter(e => e.id !== id));
      throw error;
    }
  };

  const addAuthor = async (author: Omit<Author, 'id' | 'booksCount'>) => {
    try {
      // Count how many ebooks this author already has
      const { count, error: countError } = await supabase
        .from('ebooks')
        .select('*', { count: 'exact', head: true })
        .eq('author', author.name);

      if (countError) throw countError;

      const initialBookCount = count || 0;

      // Insert the author with the correct initial book count
      const { data, error } = await supabase
        .from('authors')
        .insert([
          {
            name: author.name,
            email: author.email || null,
            books_count: initialBookCount,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Refresh data to ensure consistency
        await refreshData();
      }
    } catch (error) {
      console.error('Error adding author:', error);
      // Fallback to local state
      const newAuthor = {
        ...author,
        id: Math.max(...authors.map(a => a.id), 0) + 1,
        booksCount: 0,
      };
      setAuthors([...authors, newAuthor]);
      throw error;
    }
  };

  const updateAuthor = async (id: number, updates: Partial<Omit<Author, 'id' | 'booksCount'>>, photoFile?: File) => {
    try {
      let photoUrl = updates.photoUrl;

      // Upload photo if provided
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `author-${id}-${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError} = await supabase.storage
          .from('ebooks')
          .upload(fileName, photoFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) throw uploadError;

        // Get public URL for the photo
        const { data: urlData } = supabase.storage
          .from('ebooks')
          .getPublicUrl(fileName);

        photoUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from('authors')
        .update({
          email: updates.email !== undefined ? updates.email : undefined,
          bio: updates.bio !== undefined ? updates.bio : undefined,
          photo_url: photoUrl !== undefined ? photoUrl : undefined,
        })
        .eq('id', id);

      if (error) throw error;

      // Refresh data to ensure consistency
      await refreshData();
    } catch (error) {
      console.error('Error updating author:', error);
      throw error;
    }
  };

  const removeAuthor = async (id: number): Promise<boolean> => {
    try {
      const author = authors.find(a => a.id === id);
      if (author && author.booksCount > 0) {
        return false; // Cannot remove author with books
      }

      const { error } = await supabase
        .from('authors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAuthors(authors.filter(a => a.id !== id));
      return true;
    } catch (error) {
      console.error('Error removing author:', error);
      // Fallback to local state
      const author = authors.find(a => a.id === id);
      if (author && author.booksCount > 0) {
        return false;
      }
      setAuthors(authors.filter(a => a.id !== id));
      return true;
    }
  };

  return (
    <DataContext.Provider
      value={{
        ebooks,
        authors,
        loading,
        addEbook,
        removeEbook,
        addAuthor,
        updateAuthor,
        removeAuthor,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
