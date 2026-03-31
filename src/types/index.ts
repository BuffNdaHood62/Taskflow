export type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none';
export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done';
export type ViewMode = 'list' | 'board' | 'calendar';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  online?: boolean;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  taskCount: number;
  isFavorite?: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
  assignee?: User;
  project?: Project;
  labels: Label[];
  subtasks: Subtask[];
  comments: Comment[];
  attachments: number;
  completed: boolean;
  createdAt: Date;
  order: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  count?: number;
  shortcut?: string;
  active?: boolean;
}

export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
}
