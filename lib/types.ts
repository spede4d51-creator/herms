export interface User {
  id: string
  name: string
  email?: string
  avatar?: string
  role?: 'admin' | 'manager' | 'member'
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'planning' | 'active' | 'on-hold' | 'completed'
  priority: 'low' | 'medium' | 'high'
  progress: number
  dueDate: Date
  teamMembers: User[]
  createdAt: Date
  updatedAt?: Date
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  projectId: string
  assigneeId?: string
  dueDate: Date
  createdAt: Date
  updatedAt?: Date
}

export interface Comment {
  id: string
  content: string
  authorId: string
  taskId: string
  createdAt: Date
}

export interface Attachment {
  id: string
  name: string
  url: string
  size: number
  type: string
  taskId: string
  uploadedBy: string
  createdAt: Date
}
