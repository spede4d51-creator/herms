import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertProjectSchema, insertTaskSchema, insertTaskCommentSchema, insertDocumentSchema, insertDocumentTemplateSchema } from "@shared/schema";
import { z } from "zod";

// Extend session interface to include userId
declare module 'express-session' {
  interface SessionData {
    userId: string;
    profile: any;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // For now, create a simple session-based auth
      const profile = await storage.getProfileByEmail(email);
      if (!profile) {
        const newProfile = await storage.createProfile({ email, fullName: email.split('@')[0] });
        req.session.userId = newProfile.id;
        req.session.profile = newProfile;
        res.json({ user: newProfile, session: { user: newProfile } });
      } else {
        req.session.userId = profile.id;
        req.session.profile = profile;
        res.json({ user: profile, session: { user: profile } });
      }
    } catch (error: any) {
      res.status(500).json({ error: error?.message || 'An error occurred' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Could not log out' });
      }
      res.json({ success: true });
    });
  });

  app.get('/api/auth/user', async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.json({ user: null });
      }
      
      const profile = await storage.getProfile(req.session.userId);
      res.json({ user: profile });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Profile routes
  app.get('/api/profiles/:id', async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/profiles/:id', async (req, res) => {
    try {
      const profileData = insertProfileSchema.partial().parse(req.body);
      const profile = await storage.updateProfile(req.params.id, profileData);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Project routes
  app.get('/api/projects', async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const projects = await storage.getProjectsByOwner(req.session.userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/projects', async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const projectData = insertProjectSchema.parse({
        ...req.body,
        ownerId: req.session.userId
      });
      
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/projects/:id', async (req, res) => {
    try {
      const projectData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, projectData);
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/projects/:id', async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Task routes
  app.get('/api/projects/:projectId/tasks', async (req, res) => {
    try {
      const tasks = await storage.getTasks(req.params.projectId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/projects/:projectId/tasks', async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const taskData = insertTaskSchema.parse({
        ...req.body,
        projectId: req.params.projectId,
        createdBy: req.session.userId
      });
      
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/tasks/:id', async (req, res) => {
    try {
      const taskData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(req.params.id, taskData);
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/tasks/:id', async (req, res) => {
    try {
      await storage.deleteTask(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Task comment routes
  app.get('/api/tasks/:taskId/comments', async (req, res) => {
    try {
      const comments = await storage.getTaskComments(req.params.taskId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/tasks/:taskId/comments', async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const commentData = insertTaskCommentSchema.parse({
        ...req.body,
        taskId: req.params.taskId,
        userId: req.session.userId
      });
      
      const comment = await storage.createTaskComment(commentData);
      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Document routes
  app.get('/api/projects/:projectId/documents', async (req, res) => {
    try {
      const documents = await storage.getDocuments(req.params.projectId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/projects/:projectId/documents', async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const documentData = insertDocumentSchema.parse({
        ...req.body,
        projectId: req.params.projectId,
        createdBy: req.session.userId
      });
      
      const document = await storage.createDocument(documentData);
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/documents/:id', async (req, res) => {
    try {
      const documentData = insertDocumentSchema.partial().parse(req.body);
      const document = await storage.updateDocument(req.params.id, documentData);
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/documents/:id', async (req, res) => {
    try {
      await storage.deleteDocument(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Document template routes
  app.get('/api/document-templates', async (req, res) => {
    try {
      const templates = await storage.getDocumentTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/document-templates', async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const templateData = insertDocumentTemplateSchema.parse({
        ...req.body,
        createdBy: req.session.userId
      });
      
      const template = await storage.createDocumentTemplate(templateData);
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/document-templates/:id', async (req, res) => {
    try {
      const templateData = insertDocumentTemplateSchema.partial().parse(req.body);
      const template = await storage.updateDocumentTemplate(req.params.id, templateData);
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/document-templates/:id', async (req, res) => {
    try {
      await storage.deleteDocumentTemplate(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Project member routes
  app.get('/api/projects/:projectId/members', async (req, res) => {
    try {
      const members = await storage.getProjectMembers(req.params.projectId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/projects/:projectId/members', async (req, res) => {
    try {
      const { userId, role } = req.body;
      const member = await storage.addProjectMember({
        projectId: req.params.projectId,
        userId,
        role: role || 'member'
      });
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/projects/:projectId/members/:userId', async (req, res) => {
    try {
      await storage.removeProjectMember(req.params.projectId, req.params.userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
