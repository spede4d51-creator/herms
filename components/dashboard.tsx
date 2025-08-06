'use client'

import { useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProjects } from '@/hooks/use-projects'
import { useTasks } from '@/hooks/use-tasks'
import { useUsers } from '@/hooks/use-users'
import { formatDate, getStatusColor, getPriorityColor } from '@/lib/utils'
import ProjectDialog from './project-dialog'
import TaskDialog from './task-dialog'

export default function Dashboard() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [showProjectDialog, setShowProjectDialog] = useState(false)
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  
  const { projects, loading: projectsLoading } = useProjects()
  const { tasks, loading: tasksLoading } = useTasks(selectedProject || undefined)
  const { users } = useUsers()

  const getProjectProgress = (projectId: string) => {
    const projectTasks = tasks.filter(task => task.project_id === projectId)
    if (projectTasks.length === 0) return 0
    const completedTasks = projectTasks.filter(task => task.status === 'completed')
    return Math.round((completedTasks.length / projectTasks.length) * 100)
  }

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId)
  }

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">HERMS Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your projects and tasks efficiently</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button onClick={() => setShowProjectDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter(p => p.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Projects</h2>
              <Button onClick={() => setShowProjectDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedProject(project.id)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{getProjectProgress(project.id)}%</span>
                        </div>
                        <Progress value={getProjectProgress(project.id)} />
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Created {formatDate(project.created_at)}</span>
                        <div className="flex -space-x-2">
                          {users.slice(0, 3).map((user) => (
                            <Avatar key={user.id} className="h-6 w-6 border-2 border-white">
                              <AvatarImage src={user.avatar_url || undefined} />
                              <AvatarFallback className="text-xs">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Tasks</h2>
              <Button onClick={() => setShowTaskDialog(true)} disabled={!selectedProject}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>

            {!selectedProject ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <p className="text-gray-500 mb-4">Select a project to view its tasks</p>
                    <Button onClick={() => setSelectedProject(projects[0]?.id || null)}>
                      Select Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {tasksLoading ? (
                  <div className="text-center py-8">Loading tasks...</div>
                ) : tasks.length === 0 ? (
                  <Card>
                    <CardContent className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <p className="text-gray-500 mb-4">No tasks found for this project</p>
                        <Button onClick={() => setShowTaskDialog(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Task
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  tasks.map((task) => (
                    <Card key={task.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{task.title}</h3>
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Created {formatDate(task.created_at)}</span>
                              {task.due_date && (
                                <span>Due {formatDate(task.due_date)}</span>
                              )}
                            </div>
                          </div>
                          {task.assignee_id && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={getUserById(task.assignee_id)?.avatar_url || undefined} />
                                <AvatarFallback>
                                  {getUserById(task.assignee_id)?.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">
                                {getUserById(task.assignee_id)?.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Team Members</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          Joined {formatDate(user.created_at)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <ProjectDialog 
        open={showProjectDialog} 
        onOpenChange={setShowProjectDialog}
      />
      <TaskDialog 
        open={showTaskDialog} 
        onOpenChange={setShowTaskDialog}
        projectId={selectedProject}
      />
    </div>
  )
}
