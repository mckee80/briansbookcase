export interface ReaderSettings {
  fontSize: number;        // 14, 16, 18, 20, 22, 24
  fontFamily: string;      // 'Georgia', 'EB Garamond', 'Crimson Pro', etc.
  lineHeight: number;      // 1.4, 1.6, 1.8, 2.0
  theme: 'light' | 'sepia' | 'dark';
}

export interface ReaderTheme {
  background: string;
  color: string;
}

export interface ReadingProgress {
  id: number;
  user_id: string;
  ebook_id: number;
  location: string;        // EPUB CFI location
  progress_percentage: number;
  last_read_at: string;
  created_at: string;
}

export interface TocItem {
  label: string;
  href: string;
  subitems?: TocItem[];
}
