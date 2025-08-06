import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Task, CreateTask, UpdateTask } from '@/lib/types'
import { toast } from 'sonner'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Ошибка загрузки задач')
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (task: CreateTask) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single()

      if (error) throw error
      
      setTasks(prev => [data, ...prev])
      toast.success('Задача создана успешно')
      return data
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error('Ошибка создания задачи')
      throw error
    }
  }

  const updateTask = async (id: string, updates: UpdateTask) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setTasks(prev => prev.map(t => t.id === id ? data : t))
      toast.success('Задача обновлена')
      return data
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Ошибка обновления задачи')
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
      toast.success('Задача удалена')
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Ошибка удаления задачи')
      throw error
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  }
}
