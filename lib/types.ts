import { Database } from './database.types'

export type Project = Database['public']['Tables']['projects']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type User = Database['public']['Tables']['users']['Row']

export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type UserInsert = Database['public']['Tables']['users']['Insert']

export type ProjectUpdate = Database['public']['Tables']['projects']['Update']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type ProjectStatus = 'planning' | 'active' | 'completed' | 'on_hold'
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
export type Priority = 'low' | 'medium' | 'high'
export type UserRole = 'admin' | 'manager' | 'member'
