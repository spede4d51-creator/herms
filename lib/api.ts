import { Project, Task, User } from './types'

// Mock API client - replace with real API calls
export class ApiClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api'

  async getProjects(): Promise<Project[]> {
    // Mock implementation
    return []
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    // Mock implementation
    return {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date()
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    // Mock implementation
    throw new Error('Not implemented')
  }

  async deleteProject(id: string): Promise<void> {
    // Mock implementation
  }

  async getTasks(projectId?: string): Promise<Task[]> {
    // Mock implementation
    return []
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    // Mock implementation
    return {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date()
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    // Mock implementation
    throw new Error('Not implemented')
  }

  async deleteTask(id: string): Promise<void> {
    // Mock implementation
  }

  async getUsers(): Promise<User[]> {
    // Mock implementation
    return []
  }
}

export const apiClient = new ApiClient()
