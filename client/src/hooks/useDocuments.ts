import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { Document, DocumentTemplate, Project } from '@shared/schema';

export const useDocuments = (projects: Project[]) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load documents for all projects
      const allDocuments: Document[] = [];
      for (const project of projects) {
        const projectDocs = await apiClient.getDocuments(project.id);
        allDocuments.push(...projectDocs);
      }
      
      setDocuments(allDocuments);
    } catch (err: any) {
      console.error('Error loading documents:', err);
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      setError(null);
      const templatesList = await apiClient.getDocumentTemplates();
      setTemplates(templatesList);
    } catch (err: any) {
      console.error('Error loading templates:', err);
      setError(err.message || 'Failed to load templates');
    }
  };

  useEffect(() => {
    if (projects.length > 0) {
      loadDocuments();
    }
    loadTemplates();
  }, [projects]);

  const createDocument = async (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    try {
      setError(null);
      const newDocument = await apiClient.createDocument(documentData.projectId, documentData);
      setDocuments(prev => [newDocument, ...prev]);
      return newDocument;
    } catch (err: any) {
      setError(err.message || 'Failed to create document');
      throw err;
    }
  };

  const updateDocument = async (id: string, documentData: Partial<Document>) => {
    try {
      setError(null);
      const updatedDocument = await apiClient.updateDocument(id, documentData);
      setDocuments(prev => prev.map(d => d.id === id ? updatedDocument : d));
      return updatedDocument;
    } catch (err: any) {
      setError(err.message || 'Failed to update document');
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      setError(null);
      await apiClient.deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete document');
      throw err;
    }
  };

  const createTemplate = async (templateData: Omit<DocumentTemplate, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    try {
      setError(null);
      const newTemplate = await apiClient.createDocumentTemplate(templateData);
      setTemplates(prev => [newTemplate, ...prev]);
      return newTemplate;
    } catch (err: any) {
      setError(err.message || 'Failed to create template');
      throw err;
    }
  };

  const updateTemplate = async (id: string, templateData: Partial<DocumentTemplate>) => {
    try {
      setError(null);
      const updatedTemplate = await apiClient.updateDocumentTemplate(id, templateData);
      setTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t));
      return updatedTemplate;
    } catch (err: any) {
      setError(err.message || 'Failed to update template');
      throw err;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      setError(null);
      await apiClient.deleteDocumentTemplate(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete template');
      throw err;
    }
  };

  return {
    documents,
    templates,
    loading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetchDocuments: loadDocuments,
    refetchTemplates: loadTemplates
  };
};