'use client';

import { Search, SlidersHorizontal, ArrowUpDown, LayoutList, Columns3, CalendarDays, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewMode } from '@/types';

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  taskCount?: number;
  completedCount?: number;
}

const viewModes: { id: ViewMode; icon: React.ElementType; label: string }[] = [
  { id: 'list', icon: LayoutList, label: 'List' },
  { id: 'board', icon: Columns3, label: 'Board' },
  { id: 'calendar', icon: CalendarDays, label: 'Calendar' },
];

export default function TopHeader({ title, subtitle, viewMode, onViewModeChange, taskCount, completedCount }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 h-[56px] border-b border-[var(--border-default)]"
      style={{ background: 'var(--bg-secondary)', backdropFilter: 'blur(12px)' }}>
      {/* Left: Breadcrumb + Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 text-small text-[var(--text-muted)]">
          <span className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Projects</span>
          <ChevronRight size={14} />
          <span className="text-[var(--text-primary)] font-medium">{title}</span>
        </div>
        {taskCount !== undefined && (
          <span className="text-caption text-[var(--text-muted)] text-mono ml-2">
            {taskCount} tasks{completedCount ? `, ${completedCount} completed` : ''}
          </span>
        )}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="flex items-center gap-2 px-3 h-8 rounded-lg text-small text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors">
          <Search size={15} />
        </button>

        {/* View Toggle */}
        <div className="flex items-center rounded-lg p-0.5 border border-[var(--border-default)]" style={{ background: 'var(--bg-tertiary)' }}>
          {viewModes.map(mode => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => onViewModeChange(mode.id)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 h-7 rounded-md text-caption font-medium transition-all duration-200',
                  viewMode === mode.id
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
                )}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter */}
        <button className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-small text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-default)]">
          <SlidersHorizontal size={14} />
          <span className="hidden sm:inline">Filter</span>
        </button>

        {/* Sort */}
        <button className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-small text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-default)]">
          <ArrowUpDown size={14} />
          <span className="hidden sm:inline">Sort</span>
        </button>
      </div>
    </header>
  );
}
