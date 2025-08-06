import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Task, TaskInsert, TaskUpdate } from '@/lib/types'
import { toast } from 'sonner'

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [projectId])

  const fetchTasks = async () => {
    try {
      let query = supabase.from('tasks').select('*')
      
      if (projectId) {
        query = query.eq('project_id', projectId)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (task: Omit<TaskInsert, 'created_by'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...task, created_by: 'user-1' }])
        .select()
        .single()

      if (error) throw error
      setTasks(prev => [data, ...prev])
      toast.success('Task created successfully')
      return data
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error('Failed to create task')
      throw error
    }
  }

  const updateTask = async (id: string, updates: TaskUpdate) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setTasks(prev => prev.map(t => t.id === id ? data : t))
      toast.success('Task updated successfully')
      return data
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task')
      throw error
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTasks(prev => prev.filter(t => t.id !== id))
      toast.success('Task deleted successfully')
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task')
      throw error
    }
  }

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  }
}
