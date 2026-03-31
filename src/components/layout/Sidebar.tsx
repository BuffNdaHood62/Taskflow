'use client';

import { useState } from 'react';
import {
  Inbox, CalendarDays, CalendarRange, Filter, ChevronLeft, ChevronRight, Search,
  Plus, Star, Settings, Bell, MoreHorizontal, Hash, FolderKanban, Sun, Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { projects as mockProjects } from '@/constants/mockData';
import { useTheme } from './ThemeProvider';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeNav: string;
  onNavChange: (id: string) => void;
  onOpenCommandPalette: () => void;
}

const navItems = [
  { id: 'inbox', label: 'Inbox', icon: Inbox, count: 5, shortcut: '⌘1' },
  { id: 'today', label: 'Today', icon: CalendarDays, count: 8, shortcut: '⌘2' },
  { id: 'upcoming', label: 'Upcoming', icon: CalendarRange, shortcut: '⌘3' },
  { id: 'filters', label: 'Filters & Labels', icon: Filter, shortcut: '' },
];

export default function Sidebar({ collapsed, onToggle, activeNav, onNavChange, onOpenCommandPalette }: SidebarProps) {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const displayedProjects = showAllProjects ? mockProjects : mockProjects.slice(0, 5);
  const favorites = mockProjects.filter(p => p.isFavorite);

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-screen flex flex-col z-30',
        'transition-all duration-300 ease-in-out',
        'border-r border-[var(--border-default)]',
        collapsed ? 'w-[68px]' : 'w-[260px]',
      )}
      style={{
        background: 'var(--bg-secondary)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Inner highlight */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 120px)' }} />

      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-[56px] flex-shrink-0 relative">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}>
          <FolderKanban size={18} className="text-white" />
        </div>
        {!collapsed && (
          <span className="text-h4 text-[var(--text-primary)] font-bold tracking-tight">TaskFlow</span>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 mb-2">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center gap-2 px-3 h-9 rounded-lg text-small text-[var(--text-muted)] glass interactive"
          >
            <Search size={15} />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="text-caption px-1.5 py-0.5 rounded bg-[var(--bg-hover)] text-[var(--text-muted)] border border-[var(--border-default)]">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* Primary Navigation */}
      <nav className="px-2 pb-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 h-9 rounded-lg text-small transition-all duration-150 relative group',
                isActive
                  ? 'bg-[var(--bg-active)] text-[var(--brand)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
                collapsed && 'justify-center px-0',
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-[var(--brand)]" />
              )}
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count !== undefined && (
                    <span className="text-caption text-mono px-1.5 py-0.5 rounded-full bg-[var(--bg-hover)] text-[var(--text-muted)]">
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      <div className="divider-gradient mx-3 my-1" />

      {/* Scrollable middle */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2" style={{ scrollbarWidth: 'none' }}>
        {/* Favorites */}
        {!collapsed && favorites.length > 0 && (
          <div className="mb-3">
            <div className="text-overline text-[var(--text-muted)] px-3 mb-1.5 flex items-center justify-between">
              <span>Favorites</span>
            </div>
            {favorites.map(project => (
              <button
                key={project.id}
                className="w-full flex items-center gap-3 px-3 h-8 rounded-lg text-small text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all duration-150 group"
              >
                <Star size={14} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                <span className="flex-1 text-left truncate">{project.name}</span>
                <span className="text-caption text-mono text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.taskCount}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Projects */}
        <div className="mb-3">
          {!collapsed && (
            <div className="text-overline text-[var(--text-muted)] px-3 mb-1.5 flex items-center justify-between">
              <span>Projects</span>
              <button className="p-0.5 rounded hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <Plus size={14} />
              </button>
            </div>
          )}
          {displayedProjects.map(project => (
            <button
              key={project.id}
              className={cn(
                'w-full flex items-center gap-3 px-3 h-8 rounded-lg text-small text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all duration-150 group',
                collapsed && 'justify-center px-0'
              )}
            >
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left truncate">{project.name}</span>
                  <span className="text-caption text-mono text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
                    {project.taskCount}
                  </span>
                  <MoreHorizontal size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>
          ))}
          {!collapsed && mockProjects.length > 5 && (
            <button
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="w-full px-3 h-7 text-caption text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-left"
            >
              {showAllProjects ? 'Show less' : `Show ${mockProjects.length - 5} more`}
            </button>
          )}
        </div>
      </div>

      <div className="divider-gradient mx-3" />

      {/* Bottom section */}
      <div className="p-2 flex-shrink-0">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-small font-semibold text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366F1, #EC4899)' }}>
                JD
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-small font-medium text-[var(--text-primary)] truncate">John Doe</div>
                <div className="text-caption text-[var(--text-muted)] truncate">john@taskflow.io</div>
              </div>
            </div>
            <div className="flex items-center gap-1 px-1 mt-1">
              <button className="flex-1 flex items-center justify-center gap-2 h-8 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all text-caption">
                <Settings size={15} />
              </button>
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="flex-1 flex items-center justify-center gap-2 h-8 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all text-caption"
              >
                {resolvedTheme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 h-8 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all text-caption relative">
                <Bell size={15} />
                <div className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-[var(--brand)]" style={{ animation: 'pulse-dot 2s infinite' }} />
              </button>
              <button
                onClick={onToggle}
                className="flex-1 flex items-center justify-center gap-2 h-8 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all text-caption"
              >
                <ChevronLeft size={15} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <button onClick={onToggle} className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
