import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
  if (diffDays === -1) return 'Yesterday';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7) return `In ${diffDays} days`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getDueDateColor(date: Date | undefined): string {
  if (!date) return 'text-(--text-muted)';
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  if (d < now) return 'text-red-400';
  if (d.getTime() === now.getTime()) return 'text-amber-400';
  return 'text-(--text-secondary)';
}

export const priorityConfig = {
  urgent: { label: 'Urgent', color: '#EF4444', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-l-red-500' },
  high: { label: 'High', color: '#F97316', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-l-orange-500' },
  medium: { label: 'Medium', color: '#EAB308', bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-l-yellow-500' },
  low: { label: 'Low', color: '#6366F1', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-l-indigo-500' },
  none: { label: 'None', color: '#6B7280', bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-l-gray-500' },
} as const;

export const statusConfig = {
  'todo': { label: 'To Do', color: '#6B7280' },
  'in-progress': { label: 'In Progress', color: '#3B82F6' },
  'in-review': { label: 'In Review', color: '#F59E0B' },
  'done': { label: 'Done', color: '#10B981' },
} as const;
