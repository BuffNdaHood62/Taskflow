'use client';

import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/types';
import TaskCard from './TaskCard';

interface TaskListViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (title: string) => void;
}

export default function TaskListView({ tasks, onToggleComplete, onTaskClick, onAddTask }: TaskListViewProps) {
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const today = new Date(); today.setHours(0, 0, 0, 0);

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const overdueTasks = activeTasks.filter(t => t.dueDate && new Date(t.dueDate) < today);
  const todayTasks = activeTasks.filter(t => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate); d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
  const upcomingTasks = activeTasks.filter(t => {
    if (!t.dueDate) return t.priority !== 'none';
    const d = new Date(t.dueDate); d.setHours(0, 0, 0, 0);
    return d.getTime() > today.getTime();
  });
  const noDueDateTasks = activeTasks.filter(t => !t.dueDate && t.priority === 'none');

  const toggleSection = (id: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle('');
      setAddingTask(false);
    }
  };

  const sections = [
    { id: 'overdue', title: 'Overdue', tasks: overdueTasks, accentColor: '#EF4444', show: overdueTasks.length > 0 },
    { id: 'today', title: 'Today', tasks: todayTasks, accentColor: 'var(--brand)', show: todayTasks.length > 0 },
    { id: 'upcoming', title: 'Upcoming', tasks: upcomingTasks, accentColor: 'var(--text-secondary)', show: upcomingTasks.length > 0 },
    { id: 'no-date', title: 'No due date', tasks: noDueDateTasks, accentColor: 'var(--text-muted)', show: noDueDateTasks.length > 0 },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(100vh - 56px)' }}>
      {/* Add task */}
      <div className="mb-4">
        {addingTask ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border-focus)] bg-[var(--bg-tertiary)] animate-fadeIn">
            <div className="w-[18px] h-[18px] rounded-full border-2 border-[var(--border-hover)] flex-shrink-0" />
            <input
              autoFocus
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddTask(); if (e.key === 'Escape') { setAddingTask(false); setNewTaskTitle(''); } }}
              placeholder="Task name"
              className="flex-1 bg-transparent outline-none text-body text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
            <button onClick={handleAddTask} className="px-3 h-7 rounded-lg text-caption font-medium text-white transition-colors" style={{ background: 'var(--brand)' }}>
              Add
            </button>
            <button onClick={() => { setAddingTask(false); setNewTaskTitle(''); }} className="px-3 h-7 rounded-lg text-caption font-medium text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors">
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAddingTask(true)}
            className="flex items-center gap-2 px-4 py-2 text-small text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors group w-full rounded-xl hover:bg-[var(--bg-hover)]"
          >
            <Plus size={16} className="text-[var(--brand)]" />
            <span>Add task</span>
          </button>
        )}
      </div>

      {/* Task Sections */}
      {sections.filter(s => s.show).map(section => {
        const isCollapsed = collapsedSections.has(section.id);
        return (
          <div key={section.id} className="mb-4">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex items-center gap-2 px-2 py-1.5 w-full text-left group mb-1"
            >
              {isCollapsed ? <ChevronRight size={16} className="text-[var(--text-muted)]" /> : <ChevronDown size={16} className="text-[var(--text-muted)]" />}
              <span className="text-small font-semibold" style={{ color: section.accentColor }}>{section.title}</span>
              <span className="text-caption text-mono text-[var(--text-muted)]">{section.tasks.length}</span>
            </button>
            {!isCollapsed && (
              <div className="space-y-0.5">
                {section.tasks.map(task => (
                  <TaskCard key={task.id} task={task} onToggleComplete={onToggleComplete} onClick={onTaskClick} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Completed */}
      {completedTasks.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 px-2 py-1.5 w-full text-left mb-1"
          >
            {showCompleted ? <ChevronDown size={16} className="text-[var(--text-muted)]" /> : <ChevronRight size={16} className="text-[var(--text-muted)]" />}
            <CheckCircle2 size={16} className="text-[var(--success)]" />
            <span className="text-small font-semibold text-[var(--text-muted)]">Completed</span>
            <span className="text-caption text-mono text-[var(--text-muted)]">{completedTasks.length}</span>
          </button>
          {showCompleted && (
            <div className="space-y-0.5">
              {completedTasks.map(task => (
                <TaskCard key={task.id} task={task} onToggleComplete={onToggleComplete} onClick={onTaskClick} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {activeTasks.length === 0 && completedTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-[var(--brand-light)] flex items-center justify-center mb-4">
            <CheckCircle2 size={32} className="text-[var(--brand)]" />
          </div>
          <h3 className="text-h3 text-[var(--text-primary)] mb-2">No tasks yet</h3>
          <p className="text-body text-[var(--text-muted)] mb-4">Create your first task to get started</p>
          <button
            onClick={() => setAddingTask(true)}
            className="px-4 h-9 rounded-lg text-small font-medium text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}
          >
            <Plus size={16} className="inline mr-1.5" />
            Create task
          </button>
        </div>
      )}
    </div>
  );
}
