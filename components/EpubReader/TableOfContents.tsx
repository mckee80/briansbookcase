'use client';

import { X } from 'lucide-react';
import { TocItem } from '@/types/reader';

interface TableOfContentsProps {
  toc: TocItem[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}

export default function TableOfContents({
  toc,
  isOpen,
  onClose,
  onNavigate,
}: TableOfContentsProps) {
  if (!isOpen) return null;

  const renderTocItem = (item: TocItem, level: number = 0) => (
    <div key={item.href} className={`ml-${level * 4}`}>
      <button
        onClick={() => {
          onNavigate(item.href);
          onClose();
        }}
        className="w-full text-left py-2 px-4 hover:bg-gray-100 rounded font-crimson text-gray-700 hover:text-accent transition-colors"
      >
        {item.label}
      </button>
      {item.subitems?.map((subitem) => renderTocItem(subitem, level + 1))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold font-garamond text-primary">
            Table of Contents
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {toc.length === 0 ? (
            <p className="text-center text-gray-500 font-crimson py-8">
              No table of contents available
            </p>
          ) : (
            <div className="space-y-1">
              {toc.map((item) => renderTocItem(item))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
