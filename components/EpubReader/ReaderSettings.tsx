'use client';

import { ReaderSettings } from '@/types/reader';
import { X } from 'lucide-react';
import {
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
  LINE_HEIGHT_OPTIONS,
} from '@/lib/readerUtils';

interface ReaderSettingsPanelProps {
  settings: ReaderSettings;
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: ReaderSettings) => void;
}

export default function ReaderSettingsPanel({
  settings,
  isOpen,
  onClose,
  onSettingsChange,
}: ReaderSettingsPanelProps) {
  if (!isOpen) return null;

  const handleChange = (key: keyof ReaderSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-garamond text-primary">
            Reader Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Font Size */}
          <div>
            <label className="block font-crimson text-sm font-medium text-gray-700 mb-2">
              Font Size
            </label>
            <div className="flex gap-2 flex-wrap">
              {FONT_SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  onClick={() => handleChange('fontSize', size)}
                  className={`px-4 py-2 rounded border-2 transition-colors ${
                    settings.fontSize === size
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-accent'
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="block font-crimson text-sm font-medium text-gray-700 mb-2">
              Font Family
            </label>
            <select
              value={settings.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-accent focus:outline-none font-crimson"
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Line Height */}
          <div>
            <label className="block font-crimson text-sm font-medium text-gray-700 mb-2">
              Line Height
            </label>
            <div className="flex gap-2">
              {LINE_HEIGHT_OPTIONS.map((height) => (
                <button
                  key={height}
                  onClick={() => handleChange('lineHeight', height)}
                  className={`px-4 py-2 rounded border-2 transition-colors ${
                    settings.lineHeight === height
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-accent'
                  }`}
                >
                  {height}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block font-crimson text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => handleChange('theme', 'light')}
                className={`flex-1 py-3 rounded border-2 transition-colors ${
                  settings.theme === 'light'
                    ? 'bg-white text-gray-900 border-accent'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-accent'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => handleChange('theme', 'sepia')}
                className={`flex-1 py-3 rounded border-2 transition-colors ${
                  settings.theme === 'sepia'
                    ? 'bg-parchment text-primary border-accent'
                    : 'bg-parchment text-gray-700 border-gray-300 hover:border-accent'
                }`}
              >
                Sepia
              </button>
              <button
                onClick={() => handleChange('theme', 'dark')}
                className={`flex-1 py-3 rounded border-2 transition-colors ${
                  settings.theme === 'dark'
                    ? 'bg-gray-900 text-white border-accent'
                    : 'bg-gray-900 text-gray-300 border-gray-300 hover:border-accent'
                }`}
              >
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
