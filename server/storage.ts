import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, desc, and, or } from 'drizzle-orm';
import { 
  profiles, 
  projects, 
  tasks, 
  taskComments, 
  documents, 
  documentTemplates, 
  projectMembers,
  activityLogs,
  users,
  type Profile, 
  type InsertProfile,
  type Project, 
  type InsertProject,
  type Task, 
  type InsertTask,
  type TaskComment, 
  type InsertTaskComment,
  type Document, 
  type InsertDocument,
  type DocumentTemplate, 
  type InsertDocumentTemplate,
  type ProjectMember,
  type ActivityLog,
  type User, 
  type InsertUser 
} from "@shared/schema";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile management
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<Profile>): Promise<Profile>;
  
  // Project management
  getProjects(userId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  
  // Project members
  getProjectMembers(projectId: string): Promise<ProjectMember[]>;
  addProjectMember(member: Omit<ProjectMember, 'id' | 'joinedAt'>): Promise<ProjectMember>;
  removeProjectMember(projectId: string, userId: string): Promise<void>;
  
  // Task management
  getTasks(projectId: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  
  // Task comments
  getTaskComments(taskId: string): Promise<TaskComment[]>;
  createTaskComment(comment: InsertTaskComment): Promise<TaskComment>;
  
  // Document management
  getDocuments(projectId: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: string, document: Partial<Document>): Promise<Document>;
  deleteDocument(id: string): Promise<void>;
  
  // Document templates
  getDocumentTemplates(): Promise<DocumentTemplate[]>;
  createDocumentTemplate(template: InsertDocumentTemplate): Promise<DocumentTemplate>;
  updateDocumentTemplate(id: string, template: Partial<DocumentTemplate>): Promise<DocumentTemplate>;
  deleteDocumentTemplate(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Profile methods
  async getProfile(id: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
    return result[0];
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.email, email)).limit(1);
    return result[0];
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const result = await db.insert(profiles).values(insertProfile).returning();
    return result[0];
  }

  async updateProfile(id: string, profile: Partial<Profile>): Promise<Profile> {
    const result = await db.update(profiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(profiles.id, id))
      .returning();
    return result[0];
  }

  // Project methods
  async getProjects(userId: string): Promise<Project[]> {
    const result = await db.select().from(projects)
      .where(
        or(
          eq(projects.ownerId, userId),
          eq(projects.id, 
            db.select({ projectId: projectMembers.projectId })
              .from(projectMembers)
              .where(eq(projectMembers.userId, userId))
          )
        )
      )
      .orderBy(desc(projects.lastActivity));
    return result;
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(insertProject).returning();
    return result[0];
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const result = await db.update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Project member methods
  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const result = await db.select().from(projectMembers)
      .where(eq(projectMembers.projectId, projectId));
    return result;
  }

  async addProjectMember(member: Omit<ProjectMember, 'id' | 'joinedAt'>): Promise<ProjectMember> {
    const result = await db.insert(projectMembers).values(member).returning();
    return result[0];
  }

  async removeProjectMember(projectId: string, userId: string): Promise<void> {
    await db.delete(projectMembers)
      .where(
        and(
          eq(projectMembers.projectId, projectId),
          eq(projectMembers.userId, userId)
        )
      );
  }

  // Task methods
  async getTasks(projectId: string): Promise<Task[]> {
    const result = await db.select().from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(desc(tasks.createdAt));
    return result;
  }

  async getTask(id: string): Promise<Task | undefined> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    return result[0];
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const result = await db.insert(tasks).values(insertTask).returning();
    return result[0];
  }

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    const result = await db.update(tasks)
      .set({ ...task, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return result[0];
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Task comment methods
  async getTaskComments(taskId: string): Promise<TaskComment[]> {
    const result = await db.select().from(taskComments)
      .where(eq(taskComments.taskId, taskId))
      .orderBy(desc(taskComments.createdAt));
    return result;
  }

  async createTaskComment(insertComment: InsertTaskComment): Promise<TaskComment> {
    const result = await db.insert(taskComments).values(insertComment).returning();
    return result[0];
  }

  // Document methods
  async getDocuments(projectId: string): Promise<Document[]> {
    const result = await db.select().from(documents)
      .where(eq(documents.projectId, projectId))
      .orderBy(desc(documents.createdAt));
    return result;
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const result = await db.insert(documents).values(insertDocument).returning();
    return result[0];
  }

  async updateDocument(id: string, document: Partial<Document>): Promise<Document> {
    const result = await db.update(documents)
      .set({ ...document, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return result[0];
  }

  async deleteDocument(id: string): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }

  // Document template methods
  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    const result = await db.select().from(documentTemplates)
      .orderBy(desc(documentTemplates.createdAt));
    return result;
  }

  async createDocumentTemplate(insertTemplate: InsertDocumentTemplate): Promise<DocumentTemplate> {
    const result = await db.insert(documentTemplates).values(insertTemplate).returning();
    return result[0];
  }

  async updateDocumentTemplate(id: string, template: Partial<DocumentTemplate>): Promise<DocumentTemplate> {
    const result = await db.update(documentTemplates)
      .set({ ...template, updatedAt: new Date() })
      .where(eq(documentTemplates.id, id))
      .returning();
    return result[0];
  }

  async deleteDocumentTemplate(id: string): Promise<void> {
    await db.delete(documentTemplates).where(eq(documentTemplates.id, id));
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private profiles: Map<string, Profile>;
  private projects: Map<string, Project>;
  private tasks: Map<string, Task>;
  private taskComments: Map<string, TaskComment>;
  private documents: Map<string, Document>;
  private documentTemplates: Map<string, DocumentTemplate>;
  private projectMembers: Map<string, ProjectMember>;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.projects = new Map();
    this.tasks = new Map();
    this.taskComments = new Map();
    this.documents = new Map();
    this.documentTemplates = new Map();
    this.projectMembers = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Profile methods
  async getProfile(id: string): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(profile => profile.email === email);
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = crypto.randomUUID();
    const now = new Date();
    const profile: Profile = { 
      ...insertProfile, 
      id, 
      createdAt: now, 
      updatedAt: now,
      role: insertProfile.role || 'member',
      telegramId: null,
      telegramUsername: null
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfile(id: string, profileUpdate: Partial<Profile>): Promise<Profile> {
    const existing = this.profiles.get(id);
    if (!existing) throw new Error('Profile not found');
    
    const updated = { ...existing, ...profileUpdate, updatedAt: new Date() };
    this.profiles.set(id, updated);
    return updated;
  }

  // Project methods
  async getProjects(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => 
      project.ownerId === userId || 
      Array.from(this.projectMembers.values()).some(member => 
        member.projectId === project.id && member.userId === userId
      )
    );
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = crypto.randomUUID();
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: now, 
      updatedAt: now,
      lastActivity: now,
      description: insertProject.description || '',
      color: insertProject.color || '#3B82F6',
      status: insertProject.status || 'active'
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, projectUpdate: Partial<Project>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) throw new Error('Project not found');
    
    const updated = { ...existing, ...projectUpdate, updatedAt: new Date() };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    this.projects.delete(id);
  }

  // Project member methods
  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    return Array.from(this.projectMembers.values()).filter(member => member.projectId === projectId);
  }

  async addProjectMember(member: Omit<ProjectMember, 'id' | 'joinedAt'>): Promise<ProjectMember> {
    const id = crypto.randomUUID();
    const newMember: ProjectMember = { 
      ...member, 
      id, 
      joinedAt: new Date(),
      role: member.role || 'member'
    };
    this.projectMembers.set(id, newMember);
    return newMember;
  }

  async removeProjectMember(projectId: string, userId: string): Promise<void> {
    for (const [id, member] of this.projectMembers.entries()) {
      if (member.projectId === projectId && member.userId === userId) {
        this.projectMembers.delete(id);
        break;
      }
    }
  }

  // Task methods
  async getTasks(projectId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.projectId === projectId);
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = crypto.randomUUID();
    const now = new Date();
    const task: Task = { 
      ...insertTask, 
      id, 
      createdAt: now, 
      updatedAt: now,
      description: insertTask.description || '',
      status: insertTask.status || 'todo',
      priority: insertTask.priority || 'medium',
      category: insertTask.category || 'General'
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, taskUpdate: Partial<Task>): Promise<Task> {
    const existing = this.tasks.get(id);
    if (!existing) throw new Error('Task not found');
    
    const updated = { ...existing, ...taskUpdate, updatedAt: new Date() };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: string): Promise<void> {
    this.tasks.delete(id);
  }

  // Task comment methods
  async getTaskComments(taskId: string): Promise<TaskComment[]> {
    return Array.from(this.taskComments.values()).filter(comment => comment.taskId === taskId);
  }

  async createTaskComment(insertComment: InsertTaskComment): Promise<TaskComment> {
    const id = crypto.randomUUID();
    const now = new Date();
    const comment: TaskComment = { 
      ...insertComment, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.taskComments.set(id, comment);
    return comment;
  }

  // Document methods
  async getDocuments(projectId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.projectId === projectId);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = crypto.randomUUID();
    const now = new Date();
    const document: Document = { 
      ...insertDocument, 
      id, 
      createdAt: now, 
      updatedAt: now,
      description: insertDocument.description || '',
      status: insertDocument.status || 'draft'
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: string, documentUpdate: Partial<Document>): Promise<Document> {
    const existing = this.documents.get(id);
    if (!existing) throw new Error('Document not found');
    
    const updated = { ...existing, ...documentUpdate, updatedAt: new Date() };
    this.documents.set(id, updated);
    return updated;
  }

  async deleteDocument(id: string): Promise<void> {
    this.documents.delete(id);
  }

  // Document template methods
  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    return Array.from(this.documentTemplates.values());
  }

  async createDocumentTemplate(insertTemplate: InsertDocumentTemplate): Promise<DocumentTemplate> {
    const id = crypto.randomUUID();
    const now = new Date();
    const template: DocumentTemplate = { 
      ...insertTemplate, 
      id, 
      createdAt: now, 
      updatedAt: now,
      description: insertTemplate.description || '',
      category: insertTemplate.category || 'Прочее',
      fields: insertTemplate.fields || [],
      isCustom: insertTemplate.isCustom || false
    };
    this.documentTemplates.set(id, template);
    return template;
  }

  async updateDocumentTemplate(id: string, templateUpdate: Partial<DocumentTemplate>): Promise<DocumentTemplate> {
    const existing = this.documentTemplates.get(id);
    if (!existing) throw new Error('Document template not found');
    
    const updated = { ...existing, ...templateUpdate, updatedAt: new Date() };
    this.documentTemplates.set(id, updated);
    return updated;
  }

  async deleteDocumentTemplate(id: string): Promise<void> {
    this.documentTemplates.delete(id);
  }
}

export const storage = new MemStorage();
