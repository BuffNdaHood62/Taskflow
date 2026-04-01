'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Search, Plus, Inbox, Calendar, Columns3, PanelLeft, Sun, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { commandPaletteItems } from '@/constants/mockData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: (actionId: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Plus, Search, Inbox, Calendar, Columns: Columns3, PanelLeft, Sun, Settings,
};

export default function CommandPalette({ isOpen, onClose, onAction }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = commandPaletteItems.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );

  const categories = Array.from(new Set(filtered.map(i => i.category)));

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filtered[selectedIndex]) onAction?.(filtered[selectedIndex].id);
        onClose();
        break;
      case 'Escape':
        onClose();
        break;
    }
  }, [isOpen, filtered, selectedIndex, onAction, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Global ⌘K handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={onClose}
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)', backdropFilter: 'blur(8px)' }}>

        {/* Modal */}
        <div
          onClick={e => e.stopPropagation()}
          className="w-full max-w-160 mx-3 sm:mx-0 rounded-2xl overflow-hidden animate-scaleIn"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 16px 70px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.1)',
          }}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-5 h-14 border-b border-(--border-default)">
            <Search size={20} className="text-(--text-muted) shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent outline-none text-body text-(--text-primary) placeholder:text-(--text-muted)"
            />
            <kbd className="text-caption px-1.5 py-0.5 rounded bg-(--bg-hover) text-(--text-muted) border border-(--border-default)">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-90 overflow-y-auto py-2" style={{ scrollbarWidth: 'none' }}>
            {categories.map(category => {
              const items = filtered.filter(i => i.category === category);
              return (
                <div key={category}>
                  <div className="text-overline text-(--text-muted) px-5 py-1.5">{category}</div>
                  {items.map(item => {
                    const globalIndex = filtered.indexOf(item);
                    const Icon = iconMap[item.icon] || Search;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { onAction?.(item.id); onClose(); }}
                        className={cn(
                          'w-full flex items-center gap-3 px-5 py-2.5 transition-all duration-100 text-left',
                          globalIndex === selectedIndex
                            ? 'bg-(--brand-light) text-(--text-primary)'
                            : 'text-(--text-secondary) hover:bg-(--bg-hover)',
                        )}
                      >
                        <Icon size={18} className={globalIndex === selectedIndex ? 'text-(--brand)' : 'text-(--text-muted)'} />
                        <div className="flex-1 min-w-0">
                          <div className="text-small font-medium">{item.title}</div>
                          <div className="text-caption text-(--text-muted) truncate">{item.description}</div>
                        </div>
                        {item.shortcut && (
                          <kbd className="text-caption text-(--text-muted) px-1.5 py-0.5 rounded bg-(--bg-hover) border border-(--border-default) hidden sm:inline">
                            {item.shortcut}
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-8 text-center">
                <Search size={32} className="text-(--text-muted) mb-3 opacity-50" />
                <p className="text-small text-(--text-muted)">No results found</p>
                <p className="text-caption text-(--text-muted) mt-1">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="hidden sm:flex items-center gap-4 px-5 py-2.5 border-t border-(--border-default)">
            <span className="text-caption text-(--text-muted)">
              <kbd className="px-1 py-0.5 rounded bg-(--bg-hover) border border-(--border-default) mr-1">↑↓</kbd>
              Navigate
            </span>
            <span className="text-caption text-(--text-muted)">
              <kbd className="px-1 py-0.5 rounded bg-(--bg-hover) border border-(--border-default) mr-1">↵</kbd>
              Select
            </span>
            <span className="text-caption text-(--text-muted)">
              <kbd className="px-1 py-0.5 rounded bg-(--bg-hover) border border-(--border-default) mr-1">Esc</kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
