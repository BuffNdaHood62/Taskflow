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
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(100vh - 56px)' }}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-h2 text-[var(--text-primary)]">{monthNames[month]} {year}</h2>
          <button onClick={goToday} className="px-3 h-7 rounded-lg text-caption font-medium text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors border border-[var(--border-default)]">
            Today
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={nextMonth} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors">
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
                ? 'bg-[var(--brand-light)] text-[var(--brand)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)]',
            )}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl border border-[var(--border-default)] overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        {/* Day names header */}
        <div className="grid grid-cols-7 border-b border-[var(--border-default)]">
          {dayNames.map(day => (
            <div key={day} className="px-3 py-2 text-center text-overline text-[var(--text-muted)]">
              {day}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {(viewType === 'week' ? [weeks.find(w => w.some(d => d.getDate() === today.getDate() && d.getMonth() === today.getMonth())) || weeks[0]] : weeks).map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b border-[var(--border-default)] last:border-b-0">
            {week.map((day, di) => {
              const isToday = day.getTime() === today.getTime();
              const isCurrentMonth = day.getMonth() === month;
              const dayTasks = getTasksForDate(day);
              const isWeekend = di === 0 || di === 6;

              return (
                <div
                  key={di}
                  className={cn(
                    'min-h-[100px] p-2 border-r border-[var(--border-default)] last:border-r-0 transition-colors hover:bg-[var(--bg-hover)]',
                    !isCurrentMonth && 'opacity-40',
                    isWeekend && 'bg-[var(--bg-primary)]/30',
                  )}
                >
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-small font-medium mb-1',
                    isToday ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-primary)]',
                  )}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map(task => {
                      const pc = priorityConfig[task.priority];
                      return (
                        <button
                          key={task.id}
                          onClick={() => onTaskClick(task)}
                          className={cn(
                            'w-full text-left px-1.5 py-0.5 rounded text-caption truncate transition-colors hover:opacity-80',
                            task.completed && 'line-through opacity-50',
                          )}
                          style={{ backgroundColor: pc.color + '20', color: pc.color }}
                        >
                          {task.title}
                        </button>
                      );
                    })}
                    {dayTasks.length > 3 && (
                      <span className="text-caption text-[var(--text-muted)] px-1.5">+{dayTasks.length - 3} more</span>
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
