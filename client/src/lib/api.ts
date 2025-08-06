import { 
  Profile, 
  Project, 
  Task, 
  TaskComment, 
  Document, 
  DocumentTemplate, 
  ProjectMember 
} from '@shared/schema';

// API client for communicating with the backend
class ApiClient {
  private baseUrl = '';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include session cookies
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string): Promise<{ user: Profile; session: { user: Profile } }> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<{ success: boolean }> {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<{ user: Profile | null }> {
    return this.request('/api/auth/user');
  }

  // Profile methods
  async getProfile(id: string): Promise<Profile> {
    return this.request(`/api/profiles/${id}`);
  }

  async updateProfile(id: string, profile: Partial<Profile>): Promise<Profile> {
    return this.request(`/api/profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return this.request('/api/projects');
  }

  async getProject(id: string): Promise<Project> {
    return this.request(`/api/projects/${id}`);
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'lastActivity' | 'ownerId'>): Promise<Project> {
    return this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    return this.request(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  }

  async deleteProject(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Task methods
  async getTasks(projectId: string): Promise<Task[]> {
    return this.request(`/api/projects/${projectId}/tasks`);
  }

  async createTask(projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'projectId' | 'createdBy'>): Promise<Task> {
    return this.request(`/api/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    return this.request(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async deleteTask(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Task comment methods
  async getTaskComments(taskId: string): Promise<TaskComment[]> {
    return this.request(`/api/tasks/${taskId}/comments`);
  }

  async createTaskComment(taskId: string, comment: Omit<TaskComment, 'id' | 'createdAt' | 'updatedAt' | 'taskId' | 'userId'>): Promise<TaskComment> {
    return this.request(`/api/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  // Document methods
  async getDocuments(projectId: string): Promise<Document[]> {
    return this.request(`/api/projects/${projectId}/documents`);
  }

  async createDocument(projectId: string, document: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'projectId' | 'createdBy'>): Promise<Document> {
    return this.request(`/api/projects/${projectId}/documents`, {
      method: 'POST',
      body: JSON.stringify(document),
    });
  }

  async updateDocument(id: string, document: Partial<Document>): Promise<Document> {
    return this.request(`/api/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(document),
    });
  }

  async deleteDocument(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/documents/${id}`, {
      method: 'DELETE',
    });
  }

  // Document template methods
  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    return this.request('/api/document-templates');
  }

  async createDocumentTemplate(template: Omit<DocumentTemplate, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<DocumentTemplate> {
    return this.request('/api/document-templates', {
      method: 'POST',
      body: JSON.stringify(template),
    });
  }

  async updateDocumentTemplate(id: string, template: Partial<DocumentTemplate>): Promise<DocumentTemplate> {
    return this.request(`/api/document-templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(template),
    });
  }

  async deleteDocumentTemplate(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/document-templates/${id}`, {
      method: 'DELETE',
    });
  }

  // Project member methods
  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    return this.request(`/api/projects/${projectId}/members`);
  }

  async addProjectMember(projectId: string, userId: string, role?: string): Promise<ProjectMember> {
    return this.request(`/api/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId, role }),
    });
  }

  async removeProjectMember(projectId: string, userId: string): Promise<{ success: boolean }> {
    return this.request(`/api/projects/${projectId}/members/${userId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
