'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { tasks as mockTasks } from '@/constants/mockData';
import { Task, ViewMode, TaskStatus as TStatus } from '@/types';
import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';
import TaskListView from '@/components/tasks/TaskListView';
import TaskDetailPanel from '@/components/tasks/TaskDetailPanel';
import BoardView from '@/components/tasks/BoardView';
import CalendarView from '@/components/tasks/CalendarView';
import CommandPalette from '@/components/ui/CommandPalette';

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState('today');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarCollapsed(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '1') { e.preventDefault(); setViewMode('list'); }
      if ((e.metaKey || e.ctrlKey) && e.key === '2') { e.preventDefault(); setViewMode('board'); }
      if ((e.metaKey || e.ctrlKey) && e.key === '3') { e.preventDefault(); setViewMode('calendar'); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleToggleComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed, status: !t.completed ? 'done' as TStatus : 'todo' as TStatus } : t
    ));
    setSelectedTask(prev => prev?.id === id ? { ...prev, completed: !prev.completed } : prev);
  }, []);

  const handleToggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? {
        ...t, subtasks: t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s)
      } : t
    ));
    setSelectedTask(prev => {
      if (!prev || prev.id !== taskId) return prev;
      return {
        ...prev,
        subtasks: prev.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s),
      };
    });
  }, []);

  const handleAddTask = useCallback((title: string) => {
    const newTask: Task = {
      id: Date.now().toString(), title, description: '', status: 'todo', priority: 'none',
      dueDate: new Date(), labels: [], subtasks: [], comments: [], attachments: 0,
      completed: false, createdAt: new Date(), order: tasks.length + 1,
    };
    setTasks(prev => [newTask, ...prev]);
  }, [tasks.length]);

  const handleMoveTask = useCallback((taskId: string, newStatus: TStatus) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus, completed: newStatus === 'done' } : t
    ));
  }, []);

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  const getTitle = () => {
    switch (activeNav) {
      case 'inbox': return 'Inbox';
      case 'today': return 'Today';
      case 'upcoming': return 'Upcoming';
      case 'filters': return 'Filters & Labels';
      default: return 'Tasks';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(prev => !prev)}
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* Main Content */}
      <main
        className={cn('flex-1 flex flex-col transition-all duration-300 ease-in-out')}
        style={{ marginLeft: sidebarCollapsed ? '68px' : '260px' }}
      >
        <TopHeader
          title={getTitle()}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          taskCount={activeTasks.length}
          completedCount={completedTasks.length}
        />

        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none bg-dots" style={{ zIndex: 0 }} />

        {/* View content */}
        <div className="relative z-10">
          {viewMode === 'list' && (
            <TaskListView
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onTaskClick={handleTaskClick}
              onAddTask={handleAddTask}
            />
          )}
          {viewMode === 'board' && (
            <BoardView
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onTaskClick={handleTaskClick}
              onMoveTask={handleMoveTask}
            />
          )}
          {viewMode === 'calendar' && (
            <CalendarView
              tasks={tasks}
              onTaskClick={handleTaskClick}
            />
          )}
        </div>
      </main>

      {/* Task Detail Panel */}
      <TaskDetailPanel
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onToggleComplete={handleToggleComplete}
        onToggleSubtask={handleToggleSubtask}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}
