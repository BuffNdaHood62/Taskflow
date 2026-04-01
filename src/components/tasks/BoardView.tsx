'use client';

import { useState } from 'react';
import { Plus, GripVertical, MoreHorizontal, Check } from 'lucide-react';
import { cn, priorityConfig, statusConfig, formatRelativeDate, getDueDateColor } from '@/lib/utils';
import { Task, TaskStatus as TStatus, Column } from '@/types';

interface BoardViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onTaskClick: (task: Task) => void;
  onMoveTask: (taskId: string, newStatus: TStatus) => void;
}

const columnDefs: { id: TStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'in-review', title: 'In Review' },
  { id: 'done', title: 'Done' },
];

export default function BoardView({ tasks, onToggleComplete, onTaskClick, onMoveTask }: BoardViewProps) {
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const columns: Column[] = columnDefs.map(col => ({
    ...col,
    color: statusConfig[col.id].color,
    tasks: tasks.filter(t => t.status === col.id),
  }));

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    setDragOverColumn(colId);
  };

  const handleDrop = (e: React.DragEvent, colId: TStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) onMoveTask(taskId, colId);
    setDragOverColumn(null);
    setDraggedTask(null);
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden px-3 sm:px-6 py-4" style={{ maxHeight: 'calc(100vh - 56px)' }}>
      <div className="flex gap-3 sm:gap-4 h-full min-w-max">
        {columns.map(column => (
          <div
            key={column.id}
            className={cn(
              'flex flex-col w-65 sm:w-75 rounded-xl transition-all duration-200',
              dragOverColumn === column.id && 'ring-2 ring-(--brand) ring-opacity-50',
            )}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-3 py-2.5 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
                <span className="text-small font-semibold text-(--text-primary)">{column.title}</span>
                <span className="text-caption text-mono px-1.5 py-0.5 rounded-full bg-(--bg-hover) text-(--text-muted)">
                  {column.tasks.length}
                </span>
              </div>
              <button className="p-1 rounded-md text-(--text-muted) hover:bg-(--bg-hover) transition-colors">
                <Plus size={16} />
              </button>
            </div>

            {/* Cards */}
            <div className="flex-1 space-y-2 overflow-y-auto px-1 pb-4" style={{ scrollbarWidth: 'none' }}>
              {column.tasks.map(task => {
                const pc = priorityConfig[task.priority];
                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={() => onTaskClick(task)}
                    className={cn(
                      'p-3 rounded-xl border border-(--border-default) cursor-pointer transition-all duration-150 group',
                      'hover:border-(--border-hover) hover:shadow-md hover:-translate-y-0.5',
                      'active:scale-[0.98]',
                      draggedTask === task.id && 'opacity-50 scale-[0.98]',
                    )}
                    style={{ background: 'var(--bg-secondary)' }}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleComplete(task.id); }}
                        className={cn(
                          'shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all',
                          task.completed ? 'bg-(--brand) border-(--brand)' : 'border-(--border-hover) hover:border-(--brand)',
                        )}
                      >
                        {task.completed && <Check size={10} className="text-white" strokeWidth={3} />}
                      </button>
                      <span className={cn('text-small font-medium text-(--text-primary) line-clamp-2', task.completed && 'line-through opacity-60')}>
                        {task.title}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn('inline-flex items-center gap-1 text-caption', pc.text)}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pc.color }} />
                        {pc.label}
                      </span>

                      {task.dueDate && (
                        <span className={cn('text-caption', getDueDateColor(task.dueDate))}>
                          {formatRelativeDate(task.dueDate)}
                        </span>
                      )}
                    </div>

                    {/* Bottom */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-(--border-default)">
                      <div className="flex items-center gap-1.5">
                        {task.labels.slice(0, 2).map(l => (
                          <div key={l.id} className="w-4 h-1.5 rounded-full" style={{ backgroundColor: l.color }} />
                        ))}
                      </div>
                      {task.assignee && (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-semibold text-white"
                          style={{ background: 'linear-gradient(135deg, #6366F1, #EC4899)' }}>
                          {task.assignee.initials}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Drop placeholder */}
              {dragOverColumn === column.id && (
                <div className="h-16 rounded-xl border-2 border-dashed border-(--brand) bg-(--brand-light) transition-all animate-pulse" />
              )}

              {column.tasks.length === 0 && !dragOverColumn && (
                <div className="flex flex-col items-center py-8 text-center">
                  <p className="text-caption text-(--text-muted)">No tasks</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add column */}
        <div className="flex items-start pt-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-small text-(--text-muted) hover:bg-(--bg-hover) hover:text-(--text-primary) transition-colors border border-dashed border-(--border-default)">
            <Plus size={16} />
            Add column
          </button>
        </div>
      </div>
    </div>
  );
}
