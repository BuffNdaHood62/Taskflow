import { Task, Project, User, Label } from '@/types';

export const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@taskflow.io', initials: 'JD', online: true },
  { id: '2', name: 'Sarah Chen', email: 'sarah@taskflow.io', initials: 'SC', online: true },
  { id: '3', name: 'Mike Rivera', email: 'mike@taskflow.io', initials: 'MR', online: false },
  { id: '4', name: 'Emily Watson', email: 'emily@taskflow.io', initials: 'EW', online: true },
];

export const labels: Label[] = [
  { id: '1', name: 'Design', color: '#8B5CF6' },
  { id: '2', name: 'Frontend', color: '#3B82F6' },
  { id: '3', name: 'Backend', color: '#10B981' },
  { id: '4', name: 'Bug', color: '#EF4444' },
  { id: '5', name: 'Feature', color: '#F59E0B' },
  { id: '6', name: 'UI', color: '#EC4899' },
  { id: '7', name: 'Documentation', color: '#6366F1' },
];

export const projects: Project[] = [
  { id: '1', name: 'Marketing Campaign', color: '#6366F1', taskCount: 12, isFavorite: true },
  { id: '2', name: 'Mobile App Redesign', color: '#EC4899', taskCount: 8, isFavorite: true },
  { id: '3', name: 'API Integration', color: '#10B981', taskCount: 5 },
  { id: '4', name: 'User Research', color: '#F59E0B', taskCount: 3 },
  { id: '5', name: 'Brand Identity', color: '#8B5CF6', taskCount: 7 },
  { id: '6', name: 'Q1 Planning', color: '#0EA5E9', taskCount: 4 },
];

const today = new Date();
const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date(today); twoDaysAgo.setDate(today.getDate() - 2);
const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);
const inTwoDays = new Date(today); inTwoDays.setDate(today.getDate() + 2);
const inThreeDays = new Date(today); inThreeDays.setDate(today.getDate() + 3);
const inFourDays = new Date(today); inFourDays.setDate(today.getDate() + 4);

export const tasks: Task[] = [
  {
    id: '1', title: 'Design new landing page hero section', description: 'Create a compelling hero section with animated gradients and clear CTA.',
    status: 'in-progress', priority: 'high', dueDate: today, assignee: users[0], project: projects[0],
    labels: [labels[0], labels[5]], subtasks: [
      { id: 's1', title: 'Research competitor landing pages', completed: true },
      { id: 's2', title: 'Create wireframe in Figma', completed: true },
      { id: 's3', title: 'Design high-fidelity mockup', completed: false },
      { id: 's4', title: 'Get stakeholder approval', completed: false },
    ], comments: [
      { id: 'c1', user: users[1], content: 'Love the direction! Can we add more contrast to the CTA button?', createdAt: yesterday },
    ], attachments: 3, completed: false, createdAt: twoDaysAgo, order: 1,
  },
  {
    id: '2', title: 'Fix authentication token refresh bug', description: 'Users are being logged out unexpectedly when token expires.',
    status: 'todo', priority: 'urgent', dueDate: yesterday, assignee: users[2], project: projects[2],
    labels: [labels[3], labels[2]], subtasks: [
      { id: 's5', title: 'Reproduce the issue', completed: true },
      { id: 's6', title: 'Implement token refresh logic', completed: false },
      { id: 's7', title: 'Write unit tests', completed: false },
    ], comments: [], attachments: 1, completed: false, createdAt: twoDaysAgo, order: 2,
  },
  {
    id: '3', title: 'Write API documentation for v2 endpoints', description: 'Document all new REST endpoints with request/response examples.',
    status: 'todo', priority: 'medium', dueDate: tomorrow, assignee: users[1], project: projects[2],
    labels: [labels[6]], subtasks: [], comments: [], attachments: 0, completed: false, createdAt: yesterday, order: 3,
  },
  {
    id: '4', title: 'Implement dark mode for mobile app', description: 'Add dark theme support following Material Design 3 guidelines.',
    status: 'in-progress', priority: 'medium', dueDate: inTwoDays, assignee: users[3], project: projects[1],
    labels: [labels[0], labels[1]], subtasks: [
      { id: 's8', title: 'Define dark color palette', completed: true },
      { id: 's9', title: 'Update component styles', completed: false },
      { id: 's10', title: 'Test on iOS and Android', completed: false },
    ], comments: [
      { id: 'c2', user: users[0], content: 'Make sure to test OLED-friendly true black option.', createdAt: today },
    ], attachments: 2, completed: false, createdAt: twoDaysAgo, order: 4,
  },
  {
    id: '5', title: 'Create social media content calendar', description: 'Plan and schedule posts for next quarter across all platforms.',
    status: 'todo', priority: 'low', dueDate: nextWeek, assignee: users[0], project: projects[0],
    labels: [labels[4]], subtasks: [], comments: [], attachments: 0, completed: false, createdAt: today, order: 5,
  },
  {
    id: '6', title: 'User interview synthesis report', description: 'Compile findings from 12 user interviews into actionable insights.',
    status: 'in-review', priority: 'high', dueDate: today, assignee: users[1], project: projects[3],
    labels: [labels[6]], subtasks: [
      { id: 's11', title: 'Transcribe interviews', completed: true },
      { id: 's12', title: 'Identify key themes', completed: true },
      { id: 's13', title: 'Create insight cards', completed: true },
      { id: 's14', title: 'Write executive summary', completed: false },
    ], comments: [], attachments: 5, completed: false, createdAt: twoDaysAgo, order: 6,
  },
  {
    id: '7', title: 'Set up CI/CD pipeline for staging', description: 'Configure GitHub Actions for automated deployments to staging.',
    status: 'done', priority: 'high', dueDate: yesterday, assignee: users[2], project: projects[2],
    labels: [labels[2]], subtasks: [
      { id: 's15', title: 'Write workflow file', completed: true },
      { id: 's16', title: 'Configure environment secrets', completed: true },
      { id: 's17', title: 'Test deployment', completed: true },
    ], comments: [], attachments: 1, completed: true, createdAt: twoDaysAgo, order: 7,
  },
  {
    id: '8', title: 'Design email notification templates', description: 'Create responsive HTML email templates for transactional emails.',
    status: 'todo', priority: 'medium', dueDate: inThreeDays, assignee: users[3], project: projects[4],
    labels: [labels[0]], subtasks: [], comments: [], attachments: 0, completed: false, createdAt: today, order: 8,
  },
  {
    id: '9', title: 'Optimize database queries for dashboard', description: 'Improve load time for the main dashboard by optimizing slow queries.',
    status: 'in-progress', priority: 'high', dueDate: tomorrow, assignee: users[2], project: projects[2],
    labels: [labels[2]], subtasks: [
      { id: 's18', title: 'Profile slow queries', completed: true },
      { id: 's19', title: 'Add missing indexes', completed: false },
      { id: 's20', title: 'Implement query caching', completed: false },
    ], comments: [], attachments: 0, completed: false, createdAt: yesterday, order: 9,
  },
  {
    id: '10', title: 'Review brand style guide updates', description: 'Review and approve the updated brand guidelines document.',
    status: 'todo', priority: 'low', dueDate: inFourDays, assignee: users[0], project: projects[4],
    labels: [labels[0], labels[6]], subtasks: [], comments: [], attachments: 2, completed: false, createdAt: today, order: 10,
  },
  {
    id: '11', title: 'Migrate user analytics to new provider', description: 'Switch from legacy analytics to the new event-based tracking system.',
    status: 'todo', priority: 'medium', dueDate: nextWeek, assignee: users[2], project: projects[5],
    labels: [labels[2], labels[4]], subtasks: [], comments: [], attachments: 0, completed: false, createdAt: today, order: 11,
  },
  {
    id: '12', title: 'Implement onboarding flow redesign', description: 'Build the new 3-step onboarding experience with progress indicators.',
    status: 'done', priority: 'urgent', dueDate: twoDaysAgo, assignee: users[3], project: projects[1],
    labels: [labels[1], labels[5]], subtasks: [
      { id: 's21', title: 'Step 1: Account setup', completed: true },
      { id: 's22', title: 'Step 2: Team invite', completed: true },
      { id: 's23', title: 'Step 3: First project wizard', completed: true },
    ], comments: [
      { id: 'c3', user: users[1], content: 'This looks amazing! Great work on the animations.', createdAt: yesterday },
    ], attachments: 4, completed: true, createdAt: twoDaysAgo, order: 12,
  },
];

export const commandPaletteItems = [
  { id: 'cmd1', category: 'Tasks', title: 'Create new task', description: 'Add a new task to your list', icon: 'Plus', shortcut: '⌘N' },
  { id: 'cmd2', category: 'Tasks', title: 'Search tasks', description: 'Find tasks by title or content', icon: 'Search', shortcut: '⌘F' },
  { id: 'cmd3', category: 'Navigation', title: 'Go to Inbox', description: 'View all incoming tasks', icon: 'Inbox', shortcut: '⌘1' },
  { id: 'cmd4', category: 'Navigation', title: 'Go to Today', description: "View today's tasks", icon: 'Calendar', shortcut: '⌘2' },
  { id: 'cmd5', category: 'Navigation', title: 'Go to Board', description: 'Switch to Kanban board view', icon: 'Columns', shortcut: '⌘3' },
  { id: 'cmd6', category: 'Actions', title: 'Toggle sidebar', description: 'Show or hide the sidebar', icon: 'PanelLeft', shortcut: '⌘B' },
  { id: 'cmd7', category: 'Actions', title: 'Toggle theme', description: 'Switch between dark and light mode', icon: 'Sun', shortcut: '⌘D' },
  { id: 'cmd8', category: 'Settings', title: 'Preferences', description: 'Manage your account settings', icon: 'Settings', shortcut: '' },
];
