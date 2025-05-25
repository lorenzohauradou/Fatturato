"use client"

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ProjectCard from "./ProjectCard"
import CreateProjectModal from "./CreateProjectModal"
import StatsCard from "@/components/shared/StatsCard"
import GoalsSection from "./GoalsSection"
import { Plus, TrendingUp, Target, Calculator, Briefcase, Zap } from "lucide-react"
import { useConfetti } from "@/hooks/useConfetti"
import AIFeatureIndicator from "@/components/ui/AIFeatureIndicator"

interface Project {
  id: string
  title: string
  client: string
  budget: number
  progress: number
  completion: number
  status: "active" | "completed" | "paused"
  tasks: Task[]
  earned: number
  createdAt: Date
}

interface Task {
  id: string
  name: string
  price: number
  completed: boolean
}

export default function FreelancingDashboard() {
  const [projects, setProjects] = useState<Project[]>([])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { triggerConfetti } = useConfetti()

  // Calcoli dinamici e reattivi
  const stats = useMemo(() => {
    const totalRevenue = projects.reduce((sum, project) => {
      const projectEarned = project.tasks.filter((t) => t.completed).reduce((taskSum, task) => taskSum + task.price, 0)
      return sum + projectEarned
    }, 0)

    const completedProjects = projects.filter((p) => p.status === "completed").length
    const activeProjects = projects.filter((p) => p.status === "active").length
    const averageProjectValue = projects.length > 0 ? totalRevenue / projects.length : 0
    const totalCompletedTasks = projects.reduce((sum, p) => sum + p.tasks.filter((t) => t.completed).length, 0)
    const totalTasks = projects.reduce((sum, p) => sum + p.tasks.length, 0)
    const completionRate = totalTasks > 0 ? Math.round((completedProjects / projects.length) * 100) : 0

    return {
      totalRevenue,
      completedProjects,
      activeProjects,
      averageProjectValue,
      totalCompletedTasks,
      totalTasks,
      completionRate,
    }
  }, [projects])

  // Funzione per aggiornare un progetto
  const updateProject = useCallback(
    (projectId: string, updates: Partial<Project>) => {
      setProjects((prev) =>
        prev.map((project) => {
          if (project.id === projectId) {
            const updatedProject = { ...project, ...updates }

            // Ricalcola automaticamente budget, progress e completion
            if (updatedProject.tasks) {
              const totalBudget = updatedProject.tasks.reduce((sum, task) => sum + task.price, 0)
              const completedTasks = updatedProject.tasks.filter((task) => task.completed).length
              const totalTasks = updatedProject.tasks.length
              const completion = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
              const earned = updatedProject.tasks
                .filter((task) => task.completed)
                .reduce((sum, task) => sum + task.price, 0)

              updatedProject.budget = totalBudget
              updatedProject.progress = completedTasks
              updatedProject.completion = completion
              updatedProject.earned = earned

              // Auto-complete project se tutti i task sono completati
              if (completion === 100 && updatedProject.status !== "completed") {
                updatedProject.status = "completed"
                triggerConfetti()
              } else if (completion < 100 && updatedProject.status === "completed") {
                updatedProject.status = "active"
              }
            }

            return updatedProject
          }
          return project
        }),
      )
    },
    [triggerConfetti],
  )

  // Funzione per aggiornare un task
  const updateTask = useCallback((projectId: string, taskId: string, updates: Partial<Task>) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          const updatedTasks = project.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
          return { ...project, tasks: updatedTasks }
        }
        return project
      }),
    )
  }, [])

  // Funzione per aggiungere un task
  const addTask = useCallback((projectId: string, newTask: Omit<Task, "id">) => {
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
    }

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          return { ...project, tasks: [...project.tasks, task] }
        }
        return project
      }),
    )
  }, [])

  // Funzione per eliminare un task
  const deleteTask = useCallback((projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          return { ...project, tasks: project.tasks.filter((task) => task.id !== taskId) }
        }
        return project
      }),
    )
  }, [])

  // Funzione per eliminare un progetto
  const deleteProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== projectId))
  }, [])

  const handleProjectComplete = (projectId: string) => {
    updateProject(projectId, { status: "completed", completion: 100 })
  }

  const handleCreateProject = (projectData: any) => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: projectData.title,
      client: projectData.client || "Cliente",
      budget: projectData.budget,
      progress: 0,
      completion: 0,
      status: "active",
      earned: 0,
      tasks: projectData.tasks || [],
      createdAt: new Date(),
    }
    // Aggiungi il nuovo progetto in cima alla lista
    setProjects((prev) => [newProject, ...prev])
    setIsCreateModalOpen(false)
  }

  // Ordina i progetti: prima i progetti attivi, poi i completati, ordinati per data di creazione (più recenti in cima)
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      // Prima ordina per stato (attivi in cima)
      if (a.status === "active" && b.status === "completed") return -1
      if (a.status === "completed" && b.status === "active") return 1

      // Poi per data di creazione (più recenti in cima)
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
  }, [projects])

  return (
    <div className="space-y-6">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Fatturato Totale"
          value={`€${stats.totalRevenue}`}
          subtitle={`${stats.totalCompletedTasks} task completati`}
          icon={TrendingUp}
          color="green"
          trend="+12%"
        />

        <StatsCard
          title="Progetti Attivi"
          value={stats.activeProjects.toString()}
          subtitle="In corso"
          icon={Zap}
          color="blue"
        />

        <StatsCard
          title="Completati"
          value={stats.completedProjects.toString()}
          subtitle="Progetti finiti"
          icon={Target}
          color="emerald"
        />

        <StatsCard
          title="Media per Progetto"
          value={`€${Math.round(stats.averageProjectValue)}`}
          subtitle="Valore medio"
          icon={Calculator}
          color="orange"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sezione Titolo Progetti e Pulsante Nuovo Progetto - Resa Responsive */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm space-y-3 md:space-y-0">
            {/* Titolo e Descrizione */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-800">Progetti</h2>
                <p className="text-sm text-blue-600">Gestisci i tuoi progetti freelance</p>
              </div>
            </div>

            {/* Gruppo per Pulsante Nuovo Progetto e Indicatore AI - Allineato a destra su schermi medi+, sotto e a destra/centro su mobile */}
            <div className="relative flex items-center space-x-3 self-center md:self-auto"> {/* self-center su mobile, auto su md+ */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 pl-8 pr-4 py-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuovo Progetto
                </Button>
              </motion.div>
              <AIFeatureIndicator className="absolute -top-2 -left-6 transform -translate-x-1/5 -translate-y-1/5" />
            </div>
          </div>

          <AnimatePresence>
            {sortedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard
                  project={project}
                  onComplete={() => handleProjectComplete(project.id)}
                  onUpdateProject={(updates) => updateProject(project.id, updates)}
                  onUpdateTask={(taskId, updates) => updateTask(project.id, taskId, updates)}
                  onAddTask={(newTask) => addTask(project.id, newTask)}
                  onDeleteTask={(taskId) => deleteTask(project.id, taskId)}
                  onDeleteProject={() => deleteProject(project.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {projects.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun progetto</h3>
              <p className="text-gray-500 mb-4">Inizia creando il tuo primo progetto</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crea Progetto
              </Button>
            </motion.div>
          )}
        </div>

        {/* Goals and Stats Sidebar */}
        <div className="space-y-6">
          <GoalsSection currentRevenue={stats.totalRevenue} />

          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-700">
                <Target className="w-5 h-5" />
                <span>Statistiche</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Task Completati</span>
                <span className="font-semibold text-purple-700">{stats.totalCompletedTasks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tasso Completamento</span>
                <span className="font-semibold text-purple-700">{stats.completionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Task Totali</span>
                <span className="font-semibold text-purple-700">{stats.totalTasks}</span>
              </div>
            </CardContent>
          </Card>

          {/* AI Features Preview */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-700">
                <Zap className="w-5 h-5" />
                <span>AI Features</span>
                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                  Coming Soon
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-amber-700">🤖 PDF Task Extraction</div>
              <div className="text-sm text-amber-700">📊 Smart Project Estimation</div>
              <div className="text-sm text-amber-700">🔮 Predictive Analytics</div>
              <div className="text-sm text-amber-700">💡 AI Project Assistant</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  )
}
