'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ReactReader } from 'react-reader';
import { createClient } from '@supabase/supabase-js';
import ReaderControls from './ReaderControls';
import ReaderSettingsPanel from './ReaderSettings';
import TableOfContents from './TableOfContents';
import { ReaderSettings, TocItem } from '@/types/reader';
import {
  loadReaderSettings,
  saveReaderSettings,
  applyReaderSettings,
  DEFAULT_READER_SETTINGS,
} from '@/lib/readerUtils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface EpubReaderProps {
  ebookId: number;
  ebookUrl: string;
  ebookTitle: string;
  userId: string;
}

export default function EpubReader({
  ebookId,
  ebookUrl,
  ebookTitle,
  userId,
}: EpubReaderProps) {
  const [location, setLocation] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_READER_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [toc, setToc] = useState<TocItem[]>([]);
  const renditionRef = useRef<any>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Load initial settings and progress
  useEffect(() => {
    const loadInitialState = async () => {
      // Load settings
      const savedSettings = loadReaderSettings();
      setSettings(savedSettings);

      // Load reading progress
      try {
        const { data } = await supabase
          .from('reading_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('ebook_id', ebookId)
          .single();

        if (data?.location) {
          setLocation(data.location);
          setProgress(data.progress_percentage || 0);
        }
      } catch (error) {
        console.error('Failed to load reading progress:', error);
      }
    };

    loadInitialState();
  }, [userId, ebookId]);

  // Track 'read' activity on mount
  useEffect(() => {
    const trackReadActivity = async () => {
      try {
        await supabase.from('book_activity').insert({
          ebook_id: ebookId,
          user_id: userId,
          activity_type: 'read',
        });
      } catch (error) {
        console.error('Failed to track read activity:', error);
      }
    };

    trackReadActivity();
  }, [ebookId, userId]);

  // Save progress with debounce
  const saveProgress = useCallback(
    async (newLocation: string, newProgress: number) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await supabase.from('reading_progress').upsert(
            {
              user_id: userId,
              ebook_id: ebookId,
              location: newLocation,
              progress_percentage: newProgress,
              last_read_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,ebook_id' }
          );
        } catch (error) {
          console.error('Failed to save reading progress:', error);
        }
      }, 2000); // Save 2 seconds after last change
    },
    [userId, ebookId]
  );

  const handleLocationChange = (epubcfi: string) => {
    setLocation(epubcfi);

    // Calculate progress
    if (renditionRef.current) {
      const percentageComplete = renditionRef.current.book?.locations?.percentageFromCfi(epubcfi);
      if (percentageComplete !== undefined) {
        const progressValue = percentageComplete * 100;
        setProgress(progressValue);
        saveProgress(epubcfi, progressValue);
      }
    }
  };

  const handleRenditionReady = (rendition: any) => {
    renditionRef.current = rendition;

    // Apply settings
    applyReaderSettings(rendition, settings);

    // Load table of contents
    rendition.book.loaded.navigation.then((nav: any) => {
      const tocItems: TocItem[] = nav.toc.map((item: any) => ({
        label: item.label,
        href: item.href,
        subitems: item.subitems?.map((sub: any) => ({
          label: sub.label,
          href: sub.href,
        })),
      }));
      setToc(tocItems);
    });
  };

  const handleSettingsChange = (newSettings: ReaderSettings) => {
    setSettings(newSettings);
    saveReaderSettings(newSettings);

    if (renditionRef.current) {
      applyReaderSettings(renditionRef.current, newSettings);
    }
  };

  const handlePrevPage = () => {
    if (renditionRef.current) {
      renditionRef.current.prev();
    }
  };

  const handleNextPage = () => {
    if (renditionRef.current) {
      renditionRef.current.next();
    }
  };

  const handleTocNavigate = (href: string) => {
    if (renditionRef.current) {
      renditionRef.current.display(href);
    }
  };

  return (
    <div className="fixed inset-0 bg-white" style={{ paddingBottom: '4rem' }}>
      <div className="h-full w-full">
        <ReactReader
          url={ebookUrl}
          location={location}
          locationChanged={handleLocationChange}
          getRendition={handleRenditionReady}
          epubOptions={{
            flow: 'paginated',
            manager: 'default',
          }}
        />
      </div>

      <ReaderControls
        currentLocation={location}
        progressPercentage={progress}
        toc={toc}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onLocationChange={handleLocationChange}
        onSettingsOpen={() => setSettingsOpen(true)}
        onTocOpen={() => setTocOpen(true)}
      />

      <ReaderSettingsPanel
        settings={settings}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSettingsChange={handleSettingsChange}
      />

      <TableOfContents
        toc={toc}
        isOpen={tocOpen}
        onClose={() => setTocOpen(false)}
        onNavigate={handleTocNavigate}
      />
    </div>
  );
}
