'use client';

import { X, Check, Calendar as CalIcon, User, FolderKanban, Tag, Clock, Plus, MessageSquare, Paperclip, ChevronDown } from 'lucide-react';
import { cn, priorityConfig, statusConfig, formatRelativeDate } from '@/lib/utils';
import { Task } from '@/types';

interface TaskDetailPanelProps {
  task: Task | null;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export default function TaskDetailPanel({ task, onClose, onToggleComplete, onToggleSubtask }: TaskDetailPanelProps) {
  if (!task) return null;

  const priorityCfg = priorityConfig[task.priority];
  const statusCfg = statusConfig[task.status];
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40 animate-fadeIn" onClick={onClose} style={{ backdropFilter: 'blur(4px)' }} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-[480px] z-50 overflow-y-auto animate-slideInRight"
        style={{ background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border-default)' }}>

        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 h-[56px] border-b border-[var(--border-default)] z-10"
          style={{ background: 'var(--bg-secondary)' }}>
          <span className="text-small font-medium text-[var(--text-secondary)]">Task Detail</span>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Checkbox + Title */}
          <div className="flex items-start gap-3 mb-6">
            <button
              onClick={() => onToggleComplete(task.id)}
              className={cn(
                'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 transition-all duration-200',
                task.completed ? 'bg-[var(--brand)] border-[var(--brand)]' : 'border-[var(--border-hover)] hover:border-[var(--brand)]',
              )}
            >
              {task.completed && <Check size={13} className="text-white" strokeWidth={3} />}
            </button>
            <h2 className={cn('text-h2 text-[var(--text-primary)]', task.completed && 'line-through opacity-60')}>
              {task.title}
            </h2>
          </div>

          {/* Properties */}
          <div className="rounded-xl border border-[var(--border-default)] overflow-hidden mb-6" style={{ background: 'var(--bg-tertiary)' }}>
            {/* Status */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-default)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer">
              <span className="text-small text-[var(--text-muted)] w-20">Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusCfg.color }} />
                <span className="text-small text-[var(--text-primary)]">{statusCfg.label}</span>
                <ChevronDown size={14} className="text-[var(--text-muted)]" />
              </div>
            </div>
            {/* Priority */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-default)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer">
              <span className="text-small text-[var(--text-muted)] w-20">Priority</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityCfg.color }} />
                <span className={cn('text-small', priorityCfg.text)}>{priorityCfg.label}</span>
                <ChevronDown size={14} className="text-[var(--text-muted)]" />
              </div>
            </div>
            {/* Due Date */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-default)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer">
              <span className="text-small text-[var(--text-muted)] w-20">Due Date</span>
              <div className="flex items-center gap-2">
                <CalIcon size={14} className="text-[var(--text-muted)]" />
                <span className="text-small text-[var(--text-primary)]">{task.dueDate ? formatRelativeDate(task.dueDate) : 'No date'}</span>
              </div>
            </div>
            {/* Assignee */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-default)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer">
              <span className="text-small text-[var(--text-muted)] w-20">Assignee</span>
              <div className="flex items-center gap-2">
                {task.assignee ? (
                  <>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-semibold text-white"
                      style={{ background: 'linear-gradient(135deg, #6366F1, #EC4899)' }}>
                      {task.assignee.initials}
                    </div>
                    <span className="text-small text-[var(--text-primary)]">{task.assignee.name}</span>
                  </>
                ) : (
                  <span className="text-small text-[var(--text-muted)]">Unassigned</span>
                )}
              </div>
            </div>
            {/* Project */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-default)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer">
              <span className="text-small text-[var(--text-muted)] w-20">Project</span>
              <div className="flex items-center gap-2">
                {task.project ? (
                  <>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: task.project.color }} />
                    <span className="text-small text-[var(--text-primary)]">{task.project.name}</span>
                  </>
                ) : (
                  <span className="text-small text-[var(--text-muted)]">No project</span>
                )}
              </div>
            </div>
            {/* Labels */}
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer">
              <span className="text-small text-[var(--text-muted)] w-20">Labels</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {task.labels.map(label => (
                  <span key={label.id} className="px-2 py-0.5 rounded-full text-caption font-medium"
                    style={{ backgroundColor: label.color + '20', color: label.color }}>
                    {label.name}
                  </span>
                ))}
                <button className="w-5 h-5 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors">
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-small font-semibold text-[var(--text-primary)] mb-2">Description</h4>
            <div className="text-body text-[var(--text-secondary)] leading-relaxed px-3 py-2 rounded-lg border border-transparent hover:border-[var(--border-default)] cursor-text transition-colors min-h-[60px]">
              {task.description || <span className="text-[var(--text-muted)] italic">Write a description...</span>}
            </div>
          </div>

          {/* Subtasks */}
          {task.subtasks.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-small font-semibold text-[var(--text-primary)]">Subtasks</h4>
                <span className="text-caption text-mono text-[var(--text-muted)]">{completedSubtasks}/{task.subtasks.length}</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-[var(--bg-hover)] mb-3 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(completedSubtasks / task.subtasks.length) * 100}%`, background: 'linear-gradient(90deg, #6366F1, #818CF8)' }} />
              </div>
              <div className="space-y-1">
                {task.subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors group">
                    <button onClick={() => onToggleSubtask(task.id, subtask.id)}
                      className={cn('w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0',
                        subtask.completed ? 'bg-[var(--brand)] border-[var(--brand)]' : 'border-[var(--border-hover)] hover:border-[var(--brand)]')}>
                      {subtask.completed && <Check size={10} className="text-white" strokeWidth={3} />}
                    </button>
                    <span className={cn('text-small', subtask.completed ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]')}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 px-3 py-2 mt-1 text-small text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
                <Plus size={14} /> Add subtask
              </button>
            </div>
          )}

          {/* Comments */}
          <div className="mb-6">
            <h4 className="text-small font-semibold text-[var(--text-primary)] mb-3">Activity</h4>
            {/* Comment input */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-semibold text-white flex-shrink-0 mt-0.5"
                style={{ background: 'linear-gradient(135deg, #6366F1, #EC4899)' }}>JD</div>
              <div className="flex-1 px-3 py-2 rounded-lg border border-[var(--border-default)] text-small text-[var(--text-muted)] cursor-text hover:border-[var(--border-hover)] transition-colors"
                style={{ background: 'var(--bg-tertiary)' }}>
                Write a comment...
              </div>
            </div>
            {/* Comments */}
            {task.comments.map(comment => (
              <div key={comment.id} className="flex items-start gap-3 mb-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-semibold text-white flex-shrink-0 mt-0.5"
                  style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6)' }}>
                  {comment.user.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-small font-medium text-[var(--text-primary)]">{comment.user.name}</span>
                    <span className="text-caption text-[var(--text-muted)]">{formatRelativeDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-small text-[var(--text-secondary)]">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Attachments */}
          {task.attachments > 0 && (
            <div>
              <h4 className="text-small font-semibold text-[var(--text-primary)] mb-2">Attachments</h4>
              <div className="flex items-center gap-2">
                <Paperclip size={14} className="text-[var(--text-muted)]" />
                <span className="text-small text-[var(--text-secondary)]">{task.attachments} file{task.attachments > 1 ? 's' : ''} attached</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
