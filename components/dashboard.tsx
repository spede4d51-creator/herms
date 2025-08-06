'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Users, Calendar, CheckCircle, Clock, AlertCircle, MoreHorizontal, Filter, Search } from 'lucide-react'
import { ProjectDialog } from './project-dialog'
import { TaskDialog } from './task-dialog'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
  priority: 'low' | 'medium' | 'high'
  progress: number
  dueDate: string
  team: Array<{ name: string; avatar: string }>
  tasksCount: number
  completedTasks: number
}

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  assignee: string
  dueDate: string
  project: string
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Веб-приложение HERMS',
    description: 'Система управления проектами с современным интерфейсом',
    status: 'active',
    priority: 'high',
    progress: 75,
    dueDate: '2024-02-15',
    team: [
      { name: 'Анна', avatar: '/diverse-woman-portrait.png' },
      { name: 'Михаил', avatar: '/thoughtful-man.png' }
    ],
    tasksCount: 12,
    completedTasks: 9
  },
  {
    id: '2',
    name: 'Мобильное приложение',
    description: 'React Native приложение для управления задачами',
    status: 'active',
    priority: 'medium',
    progress: 45,
    dueDate: '2024-03-01',
    team: [
      { name: 'Елена', avatar: '/diverse-woman-portrait.png' }
    ],
    tasksCount: 8,
    completedTasks: 4
  },
  {
    id: '3',
    name: 'API Документация',
    description: 'Создание подробной документации для REST API',
    status: 'completed',
    priority: 'low',
    progress: 100,
    dueDate: '2024-01-20',
    team: [
      { name: 'Дмитрий', avatar: '/thoughtful-man.png' }
    ],
    tasksCount: 5,
    completedTasks: 5
  }
]

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Создать компонент Dashboard',
    description: 'Разработать главную панель управления',
    status: 'completed',
    priority: 'high',
    assignee: 'Анна',
    dueDate: '2024-01-25',
    project: 'Веб-приложение HERMS'
  },
  {
    id: '2',
    title: 'Настроить базу данных',
    description: 'Создать схему БД и настроить подключение',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Михаил',
    dueDate: '2024-01-30',
    project: 'Веб-приложение HERMS'
  },
  {
    id: '3',
    title: 'Дизайн мобильного интерфейса',
    description: 'Создать макеты для мобильного приложения',
    status: 'pending',
    priority: 'medium',
    assignee: 'Елена',
    dueDate: '2024-02-05',
    project: 'Мобильное приложение'
  }
]

export function Dashboard() {
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'on-hold':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-orange-100 text-orange-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const activeProjects = mockProjects.filter(p => p.status === 'active').length
  const completedProjects = mockProjects.filter(p => p.status === 'completed').length
  const totalTasks = mockTasks.length
  const completedTasks = mockTasks.filter(t => t.status === 'completed').length

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>
          <p className="text-gray-600 mt-1">Добро пожаловать в систему управления проектами HERMS</p>
        </div>
        <div className="flex gap-3">
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

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные проекты</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              из {mockProjects.length} всего
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Завершенные проекты</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
            <p className="text-xs text-muted-foreground">
              +2 за этот месяц
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего задач</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} выполнено
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Просроченные</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              требуют внимания
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Основной контент */}
      <Tabs defaultValue="projects" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="projects">Проекты</TabsTrigger>
            <TabsTrigger value="tasks">Задачи</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Фильтр
            </Button>
          </div>
        </div>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Редактировать</DropdownMenuItem>
                        <DropdownMenuItem>Архивировать</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Удалить</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status === 'active' ? 'Активный' : 
                       project.status === 'completed' ? 'Завершен' : 'Приостановлен'}
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

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(project.dueDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {project.completedTasks}/{project.tasksCount}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.team.map((member, index) => (
                        <Avatar key={index} className="w-8 h-8 border-2 border-white">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <Button variant="outline" size="sm">
                      Открыть
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="space-y-4">
            {mockTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status === 'pending' ? 'Ожидает' :
                           task.status === 'in-progress' ? 'В работе' : 'Выполнено'}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority === 'high' ? 'Высокий' :
                           task.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Проект: {task.project}</span>
                        <span>Исполнитель: {task.assignee}</span>
                        <span>Срок: {formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Редактировать</DropdownMenuItem>
                        <DropdownMenuItem>Изменить статус</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Удалить</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Диалоги */}
      <ProjectDialog 
        open={isProjectDialogOpen} 
        onOpenChange={setIsProjectDialogOpen}
      />
      <TaskDialog 
        open={isTaskDialogOpen} 
        onOpenChange={setIsTaskDialogOpen}
      />
    </div>
  )
}
