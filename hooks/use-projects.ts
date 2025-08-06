import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Project, ProjectInsert, ProjectUpdate } from '@/lib/types'
import { toast } from 'sonner'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (project: Omit<ProjectInsert, 'created_by'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...project, created_by: 'user-1' }])
        .select()
        .single()

      if (error) throw error
      setProjects(prev => [data, ...prev])
      toast.success('Project created successfully')
      return data
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project')
      throw error
    }
  }

  const updateProject = async (id: string, updates: ProjectUpdate) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setProjects(prev => prev.map(p => p.id === id ? data : p))
      toast.success('Project updated successfully')
      return data
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project')
      throw error
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      setProjects(prev => prev.filter(p => p.id !== id))
      toast.success('Project deleted successfully')
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
      throw error
    }
  }

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects
  }
}
