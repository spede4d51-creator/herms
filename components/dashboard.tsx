'use client'

import { useState } from 'react'
import { Plus, FolderOpen, CheckSquare, Users, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectDialog } from './project-dialog'
import { TaskDialog } from './task-dialog'
import { useProjects } from '@/hooks/use-projects'
import { useTasks } from '@/hooks/use-tasks'
import { useUsers } from '@/hooks/use-users'

export function Dashboard() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [showProjectDialog, setShowProjectDialog] = useState(false)
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  
  const { projects, loading: projectsLoading } = useProjects()
  const { tasks, loading: tasksLoading } = useTasks(selectedProject || undefined)
  const { users } = useUsers()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'todo':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
      case 'done':
        return 'bg-green-100 text-green-800'
      case 'on_hold':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const selectedProjectData = projects.find(p => p.id === selectedProject)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HERMS</h1>
              <p className="text-gray-600">Project Management Dashboard</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowProjectDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
              {selectedProject && (
                <Button variant="outline" onClick={() => setShowTaskDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.filter(t => t.status !== 'done').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.filter(t => {
                  if (!t.due_date) return false
                  const dueDate = new Date(t.due_date)
                  const weekFromNow = new Date()
                  weekFromNow.setDate(weekFromNow.getDate() + 7)
                  return dueDate <= weekFromNow && t.status !== 'done'
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsLoading ? (
                <div className="col-span-full text-center py-8">Loading projects...</div>
              ) : projects.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500 mb-4">No projects yet</p>
                  <Button onClick={() => setShowProjectDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first project
                  </Button>
                </div>
              ) : (
                projects.map((project) => (
                  <Card 
                    key={project.id} 
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedProject === project.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedProject(project.id)}
                  >
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
                      <div className="text-sm text-gray-500">
                        Created {new Date(project.created_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-4">
            {selectedProject ? (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">
                    Tasks for {selectedProjectData?.name}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tasksLoading ? (
                    <div className="col-span-full text-center py-8">Loading tasks...</div>
                  ) : tasks.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500 mb-4">No tasks yet</p>
                      <Button onClick={() => setShowTaskDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create your first task
                      </Button>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <Card key={task.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{task.title}</CardTitle>
                            <div className="flex gap-2">
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription>{task.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-gray-500">
                            {task.due_date && (
                              <div>Due: {new Date(task.due_date).toLocaleDateString()}</div>
                            )}
                            <div>Created {new Date(task.created_at).toLocaleDateString()}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Select a project to view its tasks</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ProjectDialog 
        open={showProjectDialog} 
        onOpenChange={setShowProjectDialog}
      />
      
      {selectedProject && (
        <TaskDialog 
          open={showTaskDialog} 
          onOpenChange={setShowTaskDialog}
          projectId={selectedProject}
        />
      )}
    </div>
  )
}
