'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, priorityConfig } from '@/lib/utils';
import { Task } from '@/types';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function CalendarView({ tasks, onTaskClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week'>('month');

  const today = new Date(); today.setHours(0, 0, 0, 0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const weeks: Date[][] = [];
  const current = new Date(startDate);
  while (current <= lastDay || weeks.length < 6) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
    if (weeks.length >= 6) break;
  }

  const getTasksForDate = (date: Date) => {
    return tasks.filter(t => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
    });
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Detect mobile via window width (SSR-safe)
  const [isMobileView, setIsMobileView] = useState(false);
  if (typeof window !== 'undefined') {
    const checkMobile = () => window.innerWidth < 640;
    if (isMobileView !== checkMobile()) {
      // We only do this once on client mount effectively
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4" style={{ maxHeight: 'calc(100vh - 56px)' }}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-h3 sm:text-h2 text-(--text-primary)">{monthNames[month]} {year}</h2>
          <button onClick={goToday} className="px-2 sm:px-3 h-7 rounded-lg text-caption font-medium text-(--text-muted) hover:bg-(--bg-hover) transition-colors border border-(--border-default)">
            Today
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="p-1.5 rounded-lg text-(--text-muted) hover:bg-(--bg-hover) transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={nextMonth} className="p-1.5 rounded-lg text-(--text-muted) hover:bg-(--bg-hover) transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-1 mb-4">
        {(['month', 'week'] as const).map(v => (
          <button
            key={v}
            onClick={() => setViewType(v)}
            className={cn(
              'px-3 h-7 rounded-lg text-caption font-medium transition-all',
              viewType === v
                ? 'bg-(--brand-light) text-(--brand)'
                : 'text-(--text-muted) hover:bg-(--bg-hover)',
            )}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl border border-(--border-default) overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        {/* Day names header */}
        <div className="grid grid-cols-7 border-b border-(--border-default)">
          {dayNames.map((day, i) => (
            <div key={day} className="px-1 sm:px-3 py-2 text-center text-overline text-(--text-muted)">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{dayNamesShort[i]}</span>
            </div>
          ))}
        </div>

        {/* Weeks */}
        {(viewType === 'week' ? [weeks.find(w => w.some(d => d.getDate() === today.getDate() && d.getMonth() === today.getMonth())) || weeks[0]] : weeks).map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b border-(--border-default) last:border-b-0">
            {week.map((day, di) => {
              const isToday = day.getTime() === today.getTime();
              const isCurrentMonth = day.getMonth() === month;
              const dayTasks = getTasksForDate(day);
              const isWeekend = di === 0 || di === 6;

              return (
                <div
                  key={di}
                  className={cn(
                    'min-h-15 sm:min-h-25 p-1 sm:p-2 border-r border-(--border-default) last:border-r-0 transition-colors hover:bg-(--bg-hover)',
                    !isCurrentMonth && 'opacity-40',
                    isWeekend && 'bg-(--bg-primary)/30',
                  )}
                >
                  <div className={cn(
                    'w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-caption sm:text-small font-medium mb-0.5 sm:mb-1',
                    isToday ? 'bg-(--brand) text-white' : 'text-(--text-primary)',
                  )}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    {dayTasks.slice(0, typeof window !== 'undefined' && window.innerWidth < 640 ? 2 : 3).map(task => {
                      const pc = priorityConfig[task.priority];
                      return (
                        <button
                          key={task.id}
                          onClick={() => onTaskClick(task)}
                          className={cn(
                            'w-full text-left px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-caption truncate transition-colors hover:opacity-80',
                            task.completed && 'line-through opacity-50',
                          )}
                          style={{ backgroundColor: pc.color + '20', color: pc.color }}
                        >
                          {task.title}
                        </button>
                      );
                    })}
                    {dayTasks.length > (typeof window !== 'undefined' && window.innerWidth < 640 ? 2 : 3) && (
                      <span className="text-[10px] sm:text-caption text-(--text-muted) px-1 sm:px-1.5">
                        +{dayTasks.length - (typeof window !== 'undefined' && window.innerWidth < 640 ? 2 : 3)} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
