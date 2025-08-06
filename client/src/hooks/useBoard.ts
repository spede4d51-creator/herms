import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { Task, TaskComment } from '@shared/schema';

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface Board {
  columns: Column[];
}

export const useBoard = (projectId?: string) => {
  const [board, setBoard] = useState<Board>({
    columns: [
      { id: 'todo', title: 'To Do', tasks: [] },
      { id: 'inprogress', title: 'In Progress', tasks: [] },
      { id: 'inprogress2', title: 'Review', tasks: [] },
      { id: 'done', title: 'Done', tasks: [] }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const tasks = await apiClient.getTasks(projectId);
      
      // Group tasks by status
      const tasksByStatus = tasks.reduce((acc, task) => {
        if (!acc[task.status]) {
          acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
      }, {} as Record<string, Task[]>);

      setBoard(prev => ({
        columns: prev.columns.map(column => ({
          ...column,
          tasks: tasksByStatus[column.id] || []
        }))
      }));
    } catch (err: any) {
      console.error('Error loading tasks:', err);
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const moveTask = async (taskId: string, newStatus: string) => {
    try {
      setError(null);
      const updatedTask = await apiClient.updateTask(taskId, { status: newStatus });
      
      setBoard(prev => ({
        columns: prev.columns.map(column => ({
          ...column,
          tasks: column.id === newStatus 
            ? [...column.tasks.filter(t => t.id !== taskId), updatedTask]
            : column.tasks.filter(t => t.id !== taskId)
        }))
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to move task');
      throw err;
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'projectId' | 'createdBy'>) => {
    if (!projectId) return;

    try {
      setError(null);
      const newTask = await apiClient.createTask(projectId, taskData);
      
      setBoard(prev => ({
        columns: prev.columns.map(column => 
          column.id === newTask.status 
            ? { ...column, tasks: [...column.tasks, newTask] }
            : column
        )
      }));
      
      return newTask;
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (taskId: string, taskData: Partial<Task>) => {
    try {
      setError(null);
      const updatedTask = await apiClient.updateTask(taskId, taskData);
      
      setBoard(prev => ({
        columns: prev.columns.map(column => ({
          ...column,
          tasks: column.tasks.map(task => 
            task.id === taskId ? updatedTask : task
          )
        }))
      }));
      
      return updatedTask;
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setError(null);
      await apiClient.deleteTask(taskId);
      
      setBoard(prev => ({
        columns: prev.columns.map(column => ({
          ...column,
          tasks: column.tasks.filter(task => task.id !== taskId)
        }))
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
      throw err;
    }
  };

  const addComment = async (taskId: string, content: string) => {
    try {
      setError(null);
      const comment = await apiClient.createTaskComment(taskId, { content });
      return comment;
    } catch (err: any) {
      setError(err.message || 'Failed to add comment');
      throw err;
    }
  };

  const getTaskComments = async (taskId: string): Promise<TaskComment[]> => {
    try {
      setError(null);
      return await apiClient.getTaskComments(taskId);
    } catch (err: any) {
      setError(err.message || 'Failed to load comments');
      return [];
    }
  };

  return {
    board,
    loading,
    error,
    moveTask,
    addTask,
    updateTask,
    deleteTask,
    addComment,
    getTaskComments,
    refetch: loadTasks
  };
};
