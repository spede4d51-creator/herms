import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { Project } from '@shared/schema';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectsList = await apiClient.getProjects();
      setProjects(projectsList);
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'lastActivity' | 'ownerId'>) => {
    try {
      setError(null);
      const newProject = await apiClient.createProject(projectData);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
      throw err;
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      setError(null);
      const updatedProject = await apiClient.updateProject(id, projectData);
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      return updatedProject;
    } catch (err: any) {
      setError(err.message || 'Failed to update project');
      throw err;
    }
  };

  const archiveProject = async (id: string) => {
    try {
      setError(null);
      await updateProject(id, { status: 'archived' });
    } catch (err: any) {
      setError(err.message || 'Failed to archive project');
      throw err;
    }
  };

  const leaveProject = async (id: string) => {
    try {
      setError(null);
      await apiClient.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to leave project');
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    archiveProject,
    leaveProject,
    refetch: loadProjects
  };
};