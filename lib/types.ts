// Типы данных для приложения

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'manager' | 'developer' | 'designer'
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'on-hold' | 'archived'
  priority: 'low' | 'medium' | 'high'
  progress: number
  startDate: string
  dueDate: string
  createdAt: string
  updatedAt: string
  ownerId: string
  teamMembers: User[]
  tasks: Task[]
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  projectId: string
  assigneeId?: string
  assignee?: User
  createdById: string
  createdBy?: User
  startDate?: string
  dueDate?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
  tags: string[]
  attachments: Attachment[]
  comments: Comment[]
}

export interface Comment {
  id: string
  content: string
  taskId: string
  authorId: string
  author: User
  createdAt: string
  updatedAt: string
}

export interface Attachment {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  taskId: string
  uploadedById: string
  uploadedBy: User
  createdAt: string
}

export interface Document {
  id: string
  title: string
  content: string
  type: 'template' | 'report' | 'specification' | 'other'
  projectId?: string
  project?: Project
  authorId: string
  author: User
  createdAt: string
  updatedAt: string
  isPublic: boolean
  tags: string[]
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  userId: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Формы
export interface CreateProjectForm {
  name: string
  description: string
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  teamMemberIds: string[]
}

export interface CreateTaskForm {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  projectId: string
  assigneeId?: string
  dueDate?: string
  tags: string[]
}

export interface UpdateTaskForm extends Partial<CreateTaskForm> {
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled'
}

// Фильтры и сортировка
export interface ProjectFilters {
  status?: Project['status'][]
  priority?: Project['priority'][]
  ownerId?: string
  search?: string
}

export interface TaskFilters {
  status?: Task['status'][]
  priority?: Task['priority'][]
  projectId?: string
  assigneeId?: string
  search?: string
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}
