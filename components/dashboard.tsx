'use client'

import { useState } from 'react'
import { Plus, Calendar, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectDialog } from '@/components/project-dialog'
import { TaskDialog } from '@/components/task-dialog'
import { useProjects } from '@/hooks/use-projects'
import { useTasks } from '@/hooks/use-tasks'
import { useUsers } from '@/hooks/use-users'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export default function Dashboard() {
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  const { projects, loading: projectsLoading } = useProjects()
  const { tasks, loading: tasksLoading } = useTasks()
  const { users } = useUsers()

  // Статистика
  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.status === 'active').length
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
  const todoTasks = tasks.filter(t => t.status === 'todo').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in_progress': return 'bg-blue-500'
      case 'todo': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершено'
      case 'in_progress': return 'В работе'
      case 'todo': return 'К выполнению'
      default: return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'default'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий'
      case 'medium': return 'Средний'
      case 'low': return 'Низкий'
      default: return priority
    }
  }

  if (projectsLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HERMS</h1>
              <p className="text-gray-600">Система управления проектами</p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={() => setIsTaskDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Новая задача
              </Button>
              <Button onClick={() => setIsProjectDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Новый проект
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего проектов</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {activeProjects} активных
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего задач</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                {completedTasks} завершено
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">В работе</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTasks}</div>
              <p className="text-xs text-muted-foreground">
                задач в процессе
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">К выполнению</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todoTasks}</div>
              <p className="text-xs text-muted-foreground">
                новых задач
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Основной контент */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Проекты</TabsTrigger>
            <TabsTrigger value="tasks">Задачи</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const projectTasks = tasks.filter(t => t.project_id === project.id)
                const completedProjectTasks = projectTasks.filter(t => t.status === 'completed')
                const progress = projectTasks.length > 0 ? (completedProjectTasks.length / projectTasks.length) * 100 : 0

                return (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <CardDescription className="mt-2">
                            {project.description}
                          </CardDescription>
                        </div>
                        <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                          {project.status === 'active' ? 'Активный' : 'Завершен'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Прогресс</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Задач: {projectTasks.length}</span>
                          <span>Завершено: {completedProjectTasks.length}</span>
                        </div>

                        {project.due_date && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {format(new Date(project.due_date), 'dd MMMM yyyy', { locale: ru })}
                          </div>
                        )}

                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setSelectedProjectId(project.id)
                            setIsTaskDialogOpen(true)
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Добавить задачу
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* К выполнению */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                  К выполнению ({todoTasks})
                </h3>
                <div className="space-y-3">
                  {tasks.filter(t => t.status === 'todo').map((task) => {
                    const project = projects.find(p => p.id === task.project_id)
                    const assignee = users.find(u => u.id === task.assignee_id)
                    
                    return (
                      <Card key={task.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <Badge variant={getPriorityColor(task.priority)}>
                                {getPriorityText(task.priority)}
                              </Badge>
                              {assignee && (
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={assignee.avatar_url || ''} />
                                    <AvatarFallback className="text-xs">
                                      {assignee.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-gray-600">{assignee.name}</span>
                                </div>
                              )}
                            </div>

                            {project && (
                              <div className="text-xs text-gray-500">
                                Проект: {project.name}
                              </div>
                            )}

                            {task.due_date && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {format(new Date(task.due_date), 'dd MMM', { locale: ru })}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* В работе */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  В работе ({inProgressTasks})
                </h3>
                <div className="space-y-3">
                  {tasks.filter(t => t.status === 'in_progress').map((task) => {
                    const project = projects.find(p => p.id === task.project_id)
                    const assignee = users.find(u => u.id === task.assignee_id)
                    
                    return (
                      <Card key={task.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <Badge variant={getPriorityColor(task.priority)}>
                                {getPriorityText(task.priority)}
                              </Badge>
                              {assignee && (
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={assignee.avatar_url || ''} />
                                    <AvatarFallback className="text-xs">
                                      {assignee.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-gray-600">{assignee.name}</span>
                                </div>
                              )}
                            </div>

                            {project && (
                              <div className="text-xs text-gray-500">
                                Проект: {project.name}
                              </div>
                            )}

                            {task.due_date && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {format(new Date(task.due_date), 'dd MMM', { locale: ru })}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Завершено */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Завершено ({completedTasks})
                </h3>
                <div className="space-y-3">
                  {tasks.filter(t => t.status === 'completed').map((task) => {
                    const project = projects.find(p => p.id === task.project_id)
                    const assignee = users.find(u => u.id === task.assignee_id)
                    
                    return (
                      <Card key={task.id} className="hover:shadow-md transition-shadow border-l-4 border-l-green-500 opacity-75">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium line-through">{task.title}</h4>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Завершено
                              </Badge>
                              {assignee && (
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={assignee.avatar_url || ''} />
                                    <AvatarFallback className="text-xs">
                                      {assignee.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-gray-600">{assignee.name}</span>
                                </div>
                              )}
                            </div>

                            {project && (
                              <div className="text-xs text-gray-500">
                                Проект: {project.name}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Диалоги */}
      <ProjectDialog 
        open={isProjectDialogOpen} 
        onOpenChange={setIsProjectDialogOpen}
      />
      <TaskDialog 
        open={isTaskDialogOpen} 
        onOpenChange={setIsTaskDialogOpen}
        projectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
      />
    </div>
  )
}
