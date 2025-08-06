import { Database } from './database.types'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
  role: 'admin' | 'manager' | 'developer' | 'designer'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  status: 'active' | 'completed' | 'on-hold'
  priority: 'low' | 'medium' | 'high'
  progress: number
  due_date: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  teamMembers?: User[]
  creator?: User
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  project_id: string
  assignee_id: string | null
  due_date: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  project?: Project
  assignee?: User
  creator?: User
}

export interface ProjectMember {
  id: string
  project_id: string
  user_id: string
  role: string
  joined_at: string
  user?: User
}

export interface Document {
  id: string
  title: string
  content: string | null
  type: 'template' | 'report' | 'specification'
  project_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  project?: Project
  creator?: User
}

// Form types for creating/updating
export interface CreateProjectData {
  name: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  teamMemberIds?: string[]
}

export interface CreateTaskData {
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  project_id: string
  assignee_id?: string
  due_date?: string
}

export interface UpdateProjectData {
  name?: string
  description?: string
  status?: 'active' | 'completed' | 'on-hold'
  priority?: 'low' | 'medium' | 'high'
  progress?: number
  due_date?: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: 'pending' | 'in-progress' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  assignee_id?: string
  due_date?: string
}

export type CreateProject = Database['public']['Tables']['projects']['Insert']
export type UpdateProject = Database['public']['Tables']['projects']['Update']
export type CreateTask = Database['public']['Tables']['tasks']['Insert']
export type UpdateTask = Database['public']['Tables']['tasks']['Update']

export type ProjectWithMembers = Project & {
  members: (ProjectMember & { user: User })[]
}

export type TaskWithDetails = Task & {
  project: Project
  assignee: User | null
  creator: User
}
