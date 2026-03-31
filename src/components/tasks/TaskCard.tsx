'use client';

import { useState } from 'react';
import { Check, GripVertical, MoreHorizontal, MessageSquare, Paperclip, Calendar as CalIcon } from 'lucide-react';
import { cn, priorityConfig, formatRelativeDate, getDueDateColor } from '@/lib/utils';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onClick: (task: Task) => void;
}

export default function TaskCard({ task, onToggleComplete, onClick }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const priorityCfg = priorityConfig[task.priority];
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <div
      className={cn(
        'group relative flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer border-l-[3px]',
        task.completed ? 'opacity-50' : '',
        isHovered ? 'bg-[var(--bg-hover)]' : 'bg-transparent',
        priorityCfg.border,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(task)}
    >
      {/* Drag handle */}
      <div className={cn('flex-shrink-0 mt-0.5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab')}>
        <GripVertical size={16} />
      </div>

      {/* Checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleComplete(task.id); }}
        className={cn(
          'flex-shrink-0 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-200',
          task.completed
            ? 'bg-[var(--brand)] border-[var(--brand)]'
            : 'border-[var(--border-hover)] hover:border-[var(--brand)] hover:bg-[var(--brand-light)]',
        )}
      >
        {task.completed && <Check size={12} className="text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn('text-body font-medium text-[var(--text-primary)] truncate', task.completed && 'line-through text-[var(--text-muted)]')}>
            {task.title}
          </span>
        </div>

        {task.description && (
          <p className="text-small text-[var(--text-muted)] truncate mt-0.5">{task.description}</p>
        )}

        {/* Metadata row */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {/* Priority badge */}
          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-caption font-medium', priorityCfg.bg, priorityCfg.text)}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: priorityCfg.color }} />
            {priorityCfg.label}
          </span>

          {/* Project */}
          {task.project && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-caption bg-[var(--bg-hover)] text-[var(--text-secondary)]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: task.project.color }} />
              {task.project.name}
            </span>
          )}

          {/* Due date */}
          {task.dueDate && (
            <span className={cn('inline-flex items-center gap-1 text-caption', getDueDateColor(task.dueDate))}>
              <CalIcon size={12} />
              {formatRelativeDate(task.dueDate)}
            </span>
          )}

          {/* Labels */}
          {task.labels.slice(0, 2).map(label => (
            <span key={label.id} className="px-2 py-0.5 rounded-full text-caption font-medium" style={{ backgroundColor: label.color + '20', color: label.color }}>
              {label.name}
            </span>
          ))}
        </div>

        {/* Bottom row: assignee, comments, attachments, subtasks */}
        <div className="flex items-center gap-3 mt-2">
          {/* Assignee */}
          {task.assignee && (
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366F1, #EC4899)' }}>
              {task.assignee.initials}
            </div>
          )}

          {task.comments.length > 0 && (
            <span className="inline-flex items-center gap-1 text-caption text-[var(--text-muted)]">
              <MessageSquare size={12} /> {task.comments.length}
            </span>
          )}
          {task.attachments > 0 && (
            <span className="inline-flex items-center gap-1 text-caption text-[var(--text-muted)]">
              <Paperclip size={12} /> {task.attachments}
            </span>
          )}
          {totalSubtasks > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1.5 rounded-full bg-[var(--bg-hover)] overflow-hidden">
                <div className="h-full rounded-full bg-[var(--brand)] transition-all duration-300" style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }} />
              </div>
              <span className="text-caption text-mono text-[var(--text-muted)]">{completedSubtasks}/{totalSubtasks}</span>
            </div>
          )}
        </div>
      </div>

      {/* More button */}
      <button
        onClick={(e) => e.stopPropagation()}
        className={cn('flex-shrink-0 p-1 rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-all opacity-0 group-hover:opacity-100')}
      >
        <MoreHorizontal size={16} />
      </button>
    </div>
  );
}
