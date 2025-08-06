import { Database } from './database.types'

export type User = Database['public']['Tables']['users']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type ProjectMember = Database['public']['Tables']['project_members']['Row'];

export type CreateProject = Database['public']['Tables']['projects']['Insert'];
export type UpdateProject = Database['public']['Tables']['projects']['Update'];
export type CreateTask = Database['public']['Tables']['tasks']['Insert'];
export type UpdateTask = Database['public']['Tables']['tasks']['Update'];
export type CreateUser = Database['public']['Tables']['users']['Insert'];
export type UpdateUser = Database['public']['Tables']['users']['Update'];

export type ProjectWithMembers = Project & {
  members: (ProjectMember & { user: User })[]
}

export type TaskWithDetails = Task & {
  project: Project
  assignee: User | null
  creator: User
}
