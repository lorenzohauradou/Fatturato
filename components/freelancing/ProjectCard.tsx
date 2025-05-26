"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, Trash2, CheckCircle, Circle, Edit2, Plus, Check, X, CheckCheck, Clock, Euro, PanelTopClose, PanelTopOpen, Download, FileText } from "lucide-react"
import { useConfetti } from "@/hooks/useConfetti"

interface Task {
  id: string
  name: string
  price: number
  completed: boolean
  hours: number
}

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
}

interface ProjectCardProps {
  project: Project
  onComplete: () => void
  onUpdateProject: (updates: Partial<Project>) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onAddTask: (newTask: Omit<Task, "id" | "completed"> & { hours: number }) => void
  onDeleteTask: (taskId: string) => void
  onDeleteProject: () => void
}

export default function ProjectCard({
  project,
  onComplete,
  onUpdateProject,
  onUpdateTask,
  onAddTask,
  onDeleteTask,
  onDeleteProject,
}: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [tempTitle, setTempTitle] = useState(project.title)
  const [tempClient, setTempClient] = useState(project.client)
  const [newTask, setNewTask] = useState({ name: "", price: "", hours: "" })
  const [showAddTask, setShowAddTask] = useState(false)
  const [previousProgress, setPreviousProgress] = useState(0)
  const [showDetailsForCompleted, setShowDetailsForCompleted] = useState(true)
  const [showEarnings, setShowEarnings] = useState(true)

  const { triggerProjectCompletion } = useConfetti()

  // Calcoli dinamici basati sui task attuali
  const stats = useMemo(() => {
    const completedTasks = project.tasks.filter((task) => task.completed).length
    const totalTasks = project.tasks.length
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    const earnedAmount = project.tasks.filter((task) => task.completed).reduce((sum, task) => sum + task.price, 0)
    const totalBudget = project.tasks.reduce((sum, task) => sum + task.price, 0)

    return {
      completedTasks,
      totalTasks,
      progressPercentage,
      earnedAmount,
      totalBudget,
    }
  }, [project.tasks])

  // Effetto per attivare confetti quando il progetto si completa e per aggiornare lo stato
  useEffect(() => {
    if (stats.progressPercentage === 100 && previousProgress < 100) {
      // Progetto appena completato!
      setTimeout(() => {
        triggerProjectCompletion()
      }, 500) // Piccolo delay per l'animazione

      // Aggiorna lo status se non è già completato
      if (project.status !== "completed") {
        onUpdateProject({ status: "completed" })
      }
    } else if (stats.progressPercentage < 100 && project.status === "completed") {
      // Progetto era completato, ma ora un task è stato deselezionato.
      // Riporta lo stato a "active" (o un altro stato appropriato per "in corso")
      onUpdateProject({ status: "active" })
    }
    setPreviousProgress(stats.progressPercentage)
  }, [stats.progressPercentage, previousProgress, project.status, triggerProjectCompletion, onUpdateProject])

  const toggleTask = (taskId: string) => {
    const task = project.tasks.find((t) => t.id === taskId)
    if (task) {
      onUpdateTask(taskId, { completed: !task.completed })
    }
  }

  // Funzione per completare tutti i task
  const completeAllTasks = () => {
    project.tasks.forEach((task) => {
      if (!task.completed) {
        onUpdateTask(task.id, { completed: true })
      }
    })
  }

  const handleTitleSave = () => {
    onUpdateProject({ title: tempTitle, client: tempClient })
    setEditingTitle(false)
  }

  const handleTitleCancel = () => {
    setTempTitle(project.title)
    setTempClient(project.client)
    setEditingTitle(false)
  }

  const handleTaskEdit = (taskId: string, field: "name" | "price" | "hours", value: string) => {
    const updates: Partial<Task> = {}
    if (field === "name") {
      updates.name = value
    } else if (field === "price") {
      updates.price = Number.parseFloat(value) || 0
    } else if (field === "hours") {
      updates.hours = Number.parseFloat(value) || 0
    }
    onUpdateTask(taskId, updates)
  }

  const handleAddTask = () => {
    if (newTask.name && newTask.price && newTask.hours) {
      onAddTask({
        name: newTask.name,
        price: Number.parseFloat(newTask.price),
        hours: Number.parseFloat(newTask.hours),
      })
      setNewTask({ name: "", price: "", hours: "" })
      setShowAddTask(false)
    }
  }

  const handleRequestActionPlan = (taskId: string, taskName: string) => {
    console.log(`Richiesta piano d'azione AI per task: "${taskName}" (ID: ${taskId})`);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 border-green-200 font-medium">Completato</Badge>
      case "active":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 font-medium">In corso</Badge>
      case "paused":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200 font-medium">In pausa</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200 font-medium">{status}</Badge>
    }
  }

  const isCompleted = project.status === "completed"

  const handleMainToggleClick = () => {
    setIsExpanded(!isExpanded);
  }

  // Determina se mostrare i task e la sezione footer
  const shouldShowFullDetails = !isCompleted || (isCompleted && showDetailsForCompleted);

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group">
      <Card
        className={`overflow-hidden border transition-all duration-300 hover:shadow-lg rounded-xl shadow-sm ${isCompleted
          ? "bg-white border-gray-200 hover:border-gray-300"
          : "bg-blue-50 border-blue-200 hover:border-blue-300"
          }`}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className={`w-3 h-3 rounded-full ${isCompleted ? "bg-green-500" : "bg-yellow-500"}`}></div>
              <div className="flex-1">
                {editingTitle ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        className="font-semibold text-lg"
                        placeholder="Titolo progetto"
                      />
                      <Input
                        value={tempClient}
                        onChange={(e) => setTempClient(e.target.value)}
                        className="font-semibold text-lg"
                        placeholder="Cliente"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" onClick={handleTitleSave} className="bg-green-500 hover:bg-green-600">
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleTitleCancel}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <h3 className="font-semibold text-lg">
                      {project.title} - {project.client}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTitle(true)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRequestActionPlan(project.id, project.title)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 
                        px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 hover:text-white
                        text-white border-none shadow-lg hover:shadow-xl transform
                        flex items-center space-x-2 rounded-full font-medium ml-14"
                      title="Genera Piano d'Azione con AI"
                    >
                      <FileText className="w-4 h-4 animate-pulse" />
                      <span className="text-sm">Piano d'Azione AI</span>
                    </Button>
                  </div>
                )}
                {getStatusBadge(project.status)}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isCompleted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetailsForCompleted(!showDetailsForCompleted)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    title={showDetailsForCompleted ? "Comprimi dettagli completati" : "Mostra dettagli completati"}
                  >
                    {showDetailsForCompleted ? <PanelTopClose className="w-4 h-4" /> : <PanelTopOpen className="w-4 h-4" />}
                  </Button>
                )}
                {(!isCompleted || showDetailsForCompleted) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMainToggleClick}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    title={isExpanded ? "Nascondi task" : "Mostra task"}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDeleteProject}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Improved project stats section */}
          <div className="mt-4 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <div className="grid grid-cols-3 gap-4 flex-1">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">BUDGET</p>
                  <p className="font-bold text-blue-700">€{stats.totalBudget}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">PROGRESS</p>
                  <p className="font-bold text-blue-700">
                    {stats.completedTasks}/{stats.totalTasks}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">COMPLETION</p>
                  <p className="font-bold text-blue-700">{Math.round(stats.progressPercentage)}%</p>
                </div>
              </div>

              {/* Pulsante Completa Tutto - visibile solo se ci sono task non completati */}
              {stats.progressPercentage < 100 && stats.totalTasks > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <Button
                    onClick={completeAllTasks}
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Completa Tutto
                  </Button>
                </motion.div>
              )}
            </div>

            <div className="mt-3">
              <Progress
                value={stats.progressPercentage}
                className="h-2.5 rounded-full [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-600"
              />
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && shouldShowFullDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="pt-0 space-y-3">
                {project.tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 shadow-xs ${task.completed
                      ? "bg-white border-gray-200"
                      : "bg-gray-50 border-gray-200 hover:border-blue-200"
                      } ${editingTask !== task.id && !isCompleted ? "cursor-pointer hover:shadow-md" : ""} ${isCompleted && task.completed ? "opacity-80" : ""}`
                    }
                    onClick={() => {
                      if (editingTask !== task.id) {
                        toggleTask(task.id)
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="p-0 h-auto">
                        {task.completed ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>

                      {editingTask === task.id ? (
                        <div className="flex items-center space-x-2 flex-1" onClick={(e) => e.stopPropagation()}>
                          <Input
                            value={task.name}
                            onChange={(e) => handleTaskEdit(task.id, "name", e.target.value)}
                            className="flex-1"
                          />
                          <div className="relative">
                            <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <Input
                              type="number"
                              value={task.hours}
                              onChange={(e) => handleTaskEdit(task.id, "hours", e.target.value)}
                              className="w-20 pl-7"
                              placeholder="Ore"
                              min="0"
                            />
                          </div>
                          <div className="relative">
                            <Euro className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <Input
                              type="number"
                              value={task.price}
                              onChange={(e) => handleTaskEdit(task.id, "price", e.target.value)}
                              className="w-20 pl-7"
                            />
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setEditingTask(null)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between flex-1">
                          <span className={`${task.completed ? "line-through text-gray-500" : "text-gray-800"} ${isCompleted && task.completed ? "font-normal" : "font-medium"}`}>{task.name}</span>
                          <div className={`flex items-center space-x-3 ${isCompleted ? "opacity-0 group-hover:opacity-100" : ""}`} onClick={(e) => e.stopPropagation()}>
                            {!isCompleted && (
                              <>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock size={14} className="mr-1" />
                                  {task.hours}h
                                </div>
                                <div className="flex items-center font-semibold">
                                  <Euro size={14} className="mr-1 text-gray-500" />
                                  {task.price}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingTask(task.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteTask(task.id)}
                              className={`transition-opacity text-red-500 hover:text-red-700 p-1 ${isCompleted ? "opacity-50 hover:opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Add New Task */}
                {showAddTask ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
                      placeholder="Nome task"
                      value={newTask.name}
                      onChange={(e) => setNewTask((prev) => ({ ...prev, name: e.target.value }))}
                      className="flex-1"
                    />
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        type="number"
                        placeholder="Ore"
                        value={newTask.hours}
                        onChange={(e) => setNewTask((prev) => ({ ...prev, hours: e.target.value }))}
                        className="w-24 pl-7"
                        min="0"
                      />
                    </div>
                    <div className="relative">
                      <Euro className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        type="number"
                        placeholder="Prezzo"
                        value={newTask.price}
                        onChange={(e) => setNewTask((prev) => ({ ...prev, price: e.target.value }))}
                        className="w-24 pl-7"
                        min="0"
                      />
                    </div>
                    <Button size="sm" onClick={handleAddTask} className="bg-blue-500 hover:bg-blue-600">
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAddTask(false)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </motion.div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddTask(true)}
                    className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Aggiungi Task
                  </Button>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>

        {shouldShowFullDetails && (
          <CardContent className="pt-0">
            {showEarnings ? (
              <div className="relative">
                <div className={`grid grid-cols-2 gap-4 mt-4 ${isCompleted ? "p-3 bg-slate-50 rounded-lg" : ""}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEarnings(false)}
                    className="absolute -top-1 -right-1 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </Button>
                  <div
                    className={`p-4 rounded-lg border ${isCompleted
                      ? "bg-emerald-50 border-emerald-200 text-center"
                      : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                      }`}
                  >
                    <p className={`text-xs font-medium mb-1 ${isCompleted ? "text-emerald-700 uppercase tracking-wider" : "text-gray-600"}`}>Guadagnato</p>
                    <p className={`text-xl font-bold ${isCompleted ? "text-emerald-600" : "text-blue-700"}`}>
                      €{stats.earnedAmount}
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-lg border ${isCompleted
                      ? "bg-white border-gray-200 text-center"
                      : "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200"}`}
                  >
                    <p className={`text-xs font-medium mb-1 ${isCompleted ? "text-gray-600 uppercase tracking-wider" : "text-gray-600"}`}>
                      {isCompleted ? "Completato!" : "Rimanente"}
                    </p>
                    <p className={`text-xl font-bold ${isCompleted ? "text-gray-700" : "text-gray-700"}`}>
                      €{isCompleted ? 0 : stats.totalBudget - stats.earnedAmount}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-end mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEarnings(true)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Euro className="w-3.5 h-3.5 mr-1.5" />
                  <span className="text-sm">Mostra statistiche</span>
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </motion.div>
  )
}
