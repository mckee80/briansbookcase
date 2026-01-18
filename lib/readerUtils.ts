import { ReaderSettings, ReaderTheme } from '@/types/reader';

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  fontSize: 18,
  fontFamily: 'Georgia',
  lineHeight: 1.6,
  theme: 'sepia',
};

export const THEME_COLORS: Record<'light' | 'sepia' | 'dark', ReaderTheme> = {
  light: {
    background: '#ffffff',
    color: '#000000',
  },
  sepia: {
    background: '#f5f1e8', // Matches parchment color
    color: '#2c1810',      // Matches primary color
  },
  dark: {
    background: '#1a1a1a',
    color: '#e0e0e0',
  },
};

export const FONT_OPTIONS = [
  'Georgia',
  'EB Garamond',
  'Crimson Pro',
  'Libre Baskerville',
  'Arial',
  'Times New Roman',
];

export const FONT_SIZE_OPTIONS = [14, 16, 18, 20, 22, 24];

export const LINE_HEIGHT_OPTIONS = [1.4, 1.6, 1.8, 2.0];

// Load reader settings from localStorage
export function loadReaderSettings(): ReaderSettings {
  if (typeof window === 'undefined') return DEFAULT_READER_SETTINGS;

  try {
    const stored = localStorage.getItem('reader_settings');
    if (stored) {
      return { ...DEFAULT_READER_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load reader settings:', error);
  }

  return DEFAULT_READER_SETTINGS;
}

// Save reader settings to localStorage
export function saveReaderSettings(settings: ReaderSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('reader_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save reader settings:', error);
  }
}

// Apply settings to epub.js rendition
export function applyReaderSettings(
  rendition: any,
  settings: ReaderSettings
): void {
  if (!rendition) return;

  const theme = THEME_COLORS[settings.theme];

  // Apply theme
  rendition.themes.default({
    'body': {
      'background': theme.background,
      'color': theme.color,
      'font-size': `${settings.fontSize}px`,
      'font-family': settings.fontFamily,
      'line-height': settings.lineHeight.toString(),
    },
    'p': {
      'margin-top': '0.5em',
      'margin-bottom': '0.5em',
    },
    'a': {
      'color': settings.theme === 'dark' ? '#60a5fa' : '#3b82f6',
    },
  });
}
