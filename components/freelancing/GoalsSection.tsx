"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, Trophy, Rocket, Crown, Star, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react"
import { useConfetti } from "@/hooks/useConfetti"

interface Goal {
  id: string
  name: string
  target: number
  current: number
  icon: any
  color: string
  reward: string
}

interface GoalsSectionProps {
  currentRevenue: number
}

export default function GoalsSection({ currentRevenue }: GoalsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [goals] = useState<Goal[]>([
    {
      id: "1",
      name: "Primo Obiettivo",
      target: 1000,
      current: currentRevenue,
      icon: Target,
      color: "blue",
      reward: "🎯 Iniziato!",
    },
    {
      id: "2",
      name: "Decollo",
      target: 3000,
      current: currentRevenue,
      icon: Rocket,
      color: "purple",
      reward: "🚀 In crescita!",
    },
    {
      id: "3",
      name: "Qualità",
      target: 5000,
      current: currentRevenue,
      icon: Star,
      color: "yellow",
      reward: "⭐ Esperto!",
    },
    {
      id: "4",
      name: "Campione",
      target: 10000,
      current: currentRevenue,
      icon: Trophy,
      color: "orange",
      reward: "🏆 Campione!",
    },
    {
      id: "5",
      name: "Maestro",
      target: 20000,
      current: currentRevenue,
      icon: Crown,
      color: "gold",
      reward: "👑 Maestro!",
    },
  ])

  const [previousRevenue, setPreviousRevenue] = useState(currentRevenue)
  const [achievedGoals, setAchievedGoals] = useState<Set<string>>(new Set())

  const { triggerGoalAchievement, triggerSideExplosion } = useConfetti()

  // Effetto per controllare obiettivi raggiunti
  useEffect(() => {
    goals.forEach((goal) => {
      const wasAchieved = achievedGoals.has(goal.id)
      const isNowAchieved = currentRevenue >= goal.target
      
      // Se l'obiettivo è stato appena raggiunto
      if (!wasAchieved && isNowAchieved && previousRevenue < goal.target) {
        setAchievedGoals(prev => new Set([...prev, goal.id]))
        
        // Attiva confetti specifici in base al tipo di obiettivo
        setTimeout(() => {
          if (goal.color === "gold") {
            // Obiettivo finale: confetti speciali
            triggerGoalAchievement()
          } else {
            // Obiettivi intermedi: esplosione laterale
            triggerSideExplosion(Math.random() > 0.5 ? 'left' : 'right')
          }
        }, 300)
      }
    })
    
    setPreviousRevenue(currentRevenue)
  }, [currentRevenue, previousRevenue, goals, achievedGoals, triggerGoalAchievement, triggerSideExplosion])

  // Aggiorna i goal con il fatturato corrente
  const updatedGoals = goals.map(goal => ({
    ...goal,
    current: currentRevenue
  }))

  // Trova il prossimo obiettivo attivo
  const nextActiveGoal = updatedGoals.find(goal => goal.current < goal.target)
  const completedGoalsCount = updatedGoals.filter(goal => goal.current >= goal.target).length

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 text-blue-700",
      purple: "bg-purple-50 border-purple-200 text-purple-700",
      yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
      orange: "bg-orange-50 border-orange-200 text-orange-700",
      gold: "bg-amber-50 border-amber-200 text-amber-700",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getProgressColor = (color: string) => {
    const colors = {
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      yellow: "bg-yellow-500",
      orange: "bg-orange-500",
      gold: "bg-amber-500",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-amber-700">
            <Trophy className="w-5 h-5" />
            <span>Obiettivi di Fatturato</span>
          </CardTitle>
          
          <motion.div className="flex items-center space-x-2">
            {/* Statistiche compatte quando collassato */}
            {!isExpanded && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 text-xs"
              >
                <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300 mr-4">
                  {completedGoalsCount}/5 ✨
                </Badge>
                {nextActiveGoal && (
                  <span className="text-amber-600 font-medium">
                    €{currentRevenue.toLocaleString()} / €{nextActiveGoal.target.toLocaleString()}
                  </span>
                )}
              </motion.div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-amber-600 hover:bg-amber-100 transition-all duration-200"
            >
              <div className="flex items-center space-x-1">
                {isExpanded ? (
                  <>
                    <EyeOff className="w-3 h-3" />
                    <span className="text-xs">Comprimi</span>
                    <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    <span className="text-xs">Espandi</span>
                    <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </div>
            </Button>
          </motion.div>
        </div>

        {/* Progress overview quando collassato */}
        {!isExpanded && nextActiveGoal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-700 font-medium">{nextActiveGoal.name}</span>
              <span className="text-amber-600 font-bold">
                {Math.round((nextActiveGoal.current / nextActiveGoal.target) * 100)}%
              </span>
            </div>
            <Progress 
              value={(nextActiveGoal.current / nextActiveGoal.target) * 100} 
              className="h-2"
            />
          </motion.div>
        )}
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <CardContent className="space-y-4 pt-0">
              {updatedGoals.map((goal, index) => {
                const progress = Math.min((goal.current / goal.target) * 100, 100)
                const isCompleted = goal.current >= goal.target
                const isActive = !isCompleted && (index === 0 || updatedGoals[index - 1].current >= updatedGoals[index - 1].target)
                const wasJustAchieved = achievedGoals.has(goal.id) && isCompleted

                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      scale: wasJustAchieved ? [1, 1.05, 1] : 1
                    }}
                    transition={{ 
                      delay: index * 0.1,
                      scale: { duration: 0.5, ease: "easeInOut" }
                    }}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-50 border-green-200 shadow-lg"
                        : isActive
                          ? getColorClasses(goal.color)
                          : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <goal.icon
                          className={`w-4 h-4 ${
                            isCompleted ? "text-green-600" : isActive ? `text-${goal.color}-600` : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            isCompleted ? "text-green-700" : isActive ? `text-${goal.color}-700` : "text-gray-500"
                          }`}
                        >
                          {goal.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-bold ${
                            isCompleted ? "text-green-600" : isActive ? `text-${goal.color}-600` : "text-gray-400"
                          }`}
                        >
                          {Math.round(progress)}%
                        </span>
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              Completato! ✨
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <Progress value={progress} className="h-2" />

                    <div className="flex justify-between items-center text-xs mt-2">
                      <span className="text-gray-600 font-medium">
                        €{goal.current.toLocaleString()} / €{goal.target.toLocaleString()}
                      </span>
                      <span className={isCompleted ? "text-green-600 font-semibold" : "text-gray-500"}>
                        {goal.reward}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
