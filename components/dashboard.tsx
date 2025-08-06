'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Calendar, Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { ProjectDialog } from './project-dialog'
import { TaskDialog } from './task-dialog'
import { Project, Task } from '@/lib/types'

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Веб-приложение для управления проектами',
    description: 'Разработка современного веб-приложения для управления проектами и задачами',
    status: 'active',
    priority: 'high',
    progress: 75,
    dueDate: new Date('2024-12-15'),
    teamMembers: [
      { id: '1', name: 'Анна Иванова', avatar: '/diverse-woman-portrait.png' },
      { id: '2', name: 'Михаил Петров', avatar: '/thoughtful-man.png' }
    ],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Мобильное приложение',
    description: 'Создание мобильного приложения для iOS и Android',
    status: 'planning',
    priority: 'medium',
    progress: 25,
    dueDate: new Date('2024-11-30'),
    teamMembers: [
      { id: '3', name: 'Елена Сидорова', avatar: '/diverse-woman-portrait.png' }
    ],
    createdAt: new Date('2024-02-01')
  },
  {
    id: '3',
    name: 'Система аналитики',
    description: 'Внедрение системы аналитики и отчетности',
    status: 'completed',
    priority: 'low',
    progress: 100,
    dueDate: new Date('2024-10-15'),
    teamMembers: [
      { id: '4', name: 'Дмитрий Козлов', avatar: '/thoughtful-man.png' },
      { id: '5', name: 'Ольга Морозова', avatar: '/diverse-woman-portrait.png' }
    ],
    createdAt: new Date('2024-01-01')
  }
]

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Создать дизайн главной страницы',
    description: 'Разработать макет главной страницы приложения',
    status: 'in-progress',
    priority: 'high',
    projectId: '1',
    assigneeId: '1',
    dueDate: new Date('2024-09-15'),
    createdAt: new Date('2024-08-01')
  },
  {
    id: '2',
    title: 'Настроить базу данных',
    description: 'Создать схему базы данных и настроить подключение',
    status: 'pending',
    priority: 'medium',
    projectId: '1',
    assigneeId: '2',
    dueDate: new Date('2024-09-20'),
    createdAt: new Date('2024-08-05')
  },
  {
    id: '3',
    title: 'Провести тестирование',
    description: 'Выполнить полное тестирование функциональности',
    status: 'completed',
    priority: 'high',
    projectId: '3',
    assigneeId: '4',
    dueDate: new Date('2024-08-30'),
    createdAt: new Date('2024-08-15')
  }
]

export default function Dashboard() {
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [tasks, setTasks] = useState<Task[]>(mockTasks)

  const activeProjects = projects.filter(p => p.status === 'active').length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const totalTasks = tasks.length
  const overdueTasks = tasks.filter(t => t.dueDate < new Date() && t.status !== 'completed').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'planning': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'on-hold': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-orange-100 text-orange-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    setProjects([...projects, newProject])
  }

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    setTasks([...tasks, newTask])
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>
          <p className="text-gray-600 mt-1">Добро пожаловать в систему управления проектами HERMS</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsTaskDialogOpen(true)} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Новая задача
          </Button>
          <Button onClick={() => setIsProjectDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Новый проект
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные проекты</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              из {projects.length} всего
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Завершенные проекты</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
            <p className="text-xs text-muted-foreground">
              успешно завершено
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего задач</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              в работе
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Просроченные</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              требуют внимания
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Проекты</TabsTrigger>
          <TabsTrigger value="tasks">Задачи</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Редактировать</DropdownMenuItem>
                        <DropdownMenuItem>Архивировать</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Удалить</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status === 'active' ? 'Активный' : 
                       project.status === 'planning' ? 'Планирование' :
                       project.status === 'completed' ? 'Завершен' : 'На паузе'}
                    </Badge>
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority === 'high' ? 'Высокий' :
                       project.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Прогресс</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {project.teamMembers.map((member) => (
                        <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {project.dueDate.toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="space-y-4">
            {tasks.map((task) => {
              const project = projects.find(p => p.id === task.projectId)
              const assignee = project?.teamMembers.find(m => m.id === task.assigneeId)
              
              return (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{task.title}</h3>
                          <Badge className={getTaskStatusColor(task.status)}>
                            {task.status === 'pending' ? 'Ожидает' :
                             task.status === 'in-progress' ? 'В работе' : 'Завершена'}
                          </Badge>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority === 'high' ? 'Высокий' :
                             task.priority === 'medium' ? 'Средний' : 'Низкий'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{task.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Проект: {project?.name}</span>
                          {assignee && (
                            <div className="flex items-center gap-1">
                              <Avatar className="w-5 h-5">
                                <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                                <AvatarFallback>{assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <span>{assignee.name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{task.dueDate.toLocaleDateString('ru-RU')}</span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Редактировать</DropdownMenuItem>
                          <DropdownMenuItem>Изменить статус</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Удалить</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ProjectDialog 
        open={isProjectDialogOpen} 
        onOpenChange={setIsProjectDialogOpen}
        onSubmit={handleCreateProject}
      />
      <TaskDialog 
        open={isTaskDialogOpen} 
        onOpenChange={setIsTaskDialogOpen}
        onSubmit={handleCreateTask}
        projects={projects}
      />
    </div>
  )
}
