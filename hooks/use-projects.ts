import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Project, CreateProject, UpdateProject } from '@/lib/types'
import { toast } from 'sonner'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

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
      toast.error('Ошибка загрузки проектов')
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (project: CreateProject) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single()

      if (error) throw error
      
      setProjects(prev => [data, ...prev])
      toast.success('Проект создан успешно')
      return data
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Ошибка создания проекта')
      throw error
    }
  }

  const updateProject = async (id: string, updates: UpdateProject) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setProjects(prev => prev.map(p => p.id === id ? data : p))
      toast.success('Проект обновлен')
      return data
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Ошибка обновления проекта')
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
      toast.success('Проект удален')
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Ошибка удаления проекта')
      throw error
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects
  }
}
