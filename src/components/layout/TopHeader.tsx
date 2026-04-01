'use client';

import { Search, SlidersHorizontal, ArrowUpDown, LayoutList, Columns3, CalendarDays, ChevronRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewMode } from '@/types';

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  taskCount?: number;
  completedCount?: number;
  onMenuToggle?: () => void;
  isMobile?: boolean;
}

const viewModes: { id: ViewMode; icon: React.ElementType; label: string }[] = [
  { id: 'list', icon: LayoutList, label: 'List' },
  { id: 'board', icon: Columns3, label: 'Board' },
  { id: 'calendar', icon: CalendarDays, label: 'Calendar' },
];

export default function TopHeader({ title, subtitle, viewMode, onViewModeChange, taskCount, completedCount, onMenuToggle, isMobile }: TopHeaderProps) {
  return (
    <header className={cn(
      'sticky top-0 z-20 flex items-center justify-between h-14 border-b border-(--border-default)',
      isMobile ? 'px-3 gap-2' : 'px-6',
    )}
      style={{ background: 'var(--bg-secondary)', backdropFilter: 'blur(12px)' }}>
      {/* Left: Menu + Breadcrumb + Title */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={onMenuToggle}
            className="p-2 -ml-1 rounded-lg text-(--text-secondary) hover:bg-(--bg-hover) hover:text-(--text-primary) transition-colors shrink-0"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        )}

        <div className="flex items-center gap-1.5 text-small text-(--text-muted) min-w-0">
          {!isMobile && (
            <>
              <span className="hover:text-(--text-primary) cursor-pointer transition-colors">Projects</span>
              <ChevronRight size={14} />
            </>
          )}
          <span className="text-(--text-primary) font-medium truncate">{title}</span>
        </div>
        {taskCount !== undefined && !isMobile && (
          <span className="text-caption text-(--text-muted) text-mono ml-2 shrink-0">
            {taskCount} tasks{completedCount ? `, ${completedCount} completed` : ''}
          </span>
        )}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        {/* Search - icon only on mobile */}
        {!isMobile && (
          <button className="flex items-center gap-2 px-3 h-8 rounded-lg text-small text-(--text-muted) hover:bg-(--bg-hover) transition-colors">
            <Search size={15} />
          </button>
        )}

        {/* View Toggle */}
        <div className="flex items-center rounded-lg p-0.5 border border-(--border-default)" style={{ background: 'var(--bg-tertiary)' }}>
          {viewModes.map(mode => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => onViewModeChange(mode.id)}
                className={cn(
                  'flex items-center gap-1.5 h-7 rounded-md text-caption font-medium transition-all duration-200',
                  isMobile ? 'px-2' : 'px-2.5',
                  viewMode === mode.id
                    ? 'bg-(--bg-secondary) text-(--text-primary) shadow-sm'
                    : 'text-(--text-muted) hover:text-(--text-secondary)',
                )}
              >
                <Icon size={14} />
                {!isMobile && <span className="hidden sm:inline">{mode.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Filter - hidden on mobile */}
        {!isMobile && (
          <button className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-small text-(--text-muted) hover:bg-(--bg-hover) hover:text-(--text-primary) transition-colors border border-(--border-default)">
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        )}

        {/* Sort - hidden on mobile */}
        {!isMobile && (
          <button className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-small text-(--text-muted) hover:bg-(--bg-hover) hover:text-(--text-primary) transition-colors border border-(--border-default)">
            <ArrowUpDown size={14} />
            <span className="hidden sm:inline">Sort</span>
          </button>
        )}
      </div>
    </header>
  );
}
