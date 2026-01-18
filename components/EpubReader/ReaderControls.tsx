'use client';

import { ChevronLeft, ChevronRight, List, Settings } from 'lucide-react';
import { TocItem } from '@/types/reader';

interface ReaderControlsProps {
  currentLocation: string;
  progressPercentage: number;
  toc: TocItem[];
  onPrevPage: () => void;
  onNextPage: () => void;
  onLocationChange: (location: string) => void;
  onSettingsOpen: () => void;
  onTocOpen: () => void;
}

export default function ReaderControls({
  currentLocation,
  progressPercentage,
  toc,
  onPrevPage,
  onNextPage,
  onSettingsOpen,
  onTocOpen,
}: ReaderControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-border shadow-lg z-40">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-200">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onPrevPage}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded hover:bg-primary transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-crimson hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-crimson text-sm text-gray-600">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onTocOpen}
            className="p-2 border-2 border-accent text-accent rounded hover:bg-accent hover:text-white transition-colors"
            title="Table of Contents"
          >
            <List size={20} />
          </button>
          <button
            onClick={onSettingsOpen}
            className="p-2 border-2 border-accent text-accent rounded hover:bg-accent hover:text-white transition-colors"
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>

        <button
          onClick={onNextPage}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded hover:bg-primary transition-colors"
        >
          <span className="font-crimson hidden sm:inline">Next</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
