"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, DollarSign, BarChart3 } from "lucide-react"

interface Problem {
  icon: React.ElementType
  title: string
  description: string
  gradient: string
  bgGradient: string
}

interface ProblemSectionProps {
  sectionAnimation: any
  itemAnimation: any
}

const ProblemSection: React.FC<ProblemSectionProps> = ({ sectionAnimation, itemAnimation }) => {
  const problems: Problem[] = [
    {
      icon: Clock,
      title: "Tempo Perso in Task Manuali",
      description: "Ore sprecate a creare preventivi, tracciare ore e calcolare margini a fine mese, invece di concentrarti sul lavoro che ami.",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
    },
    {
      icon: DollarSign,
      title: "Prezzi Basati sull'Istinto",
      description: "Sottovalutare il tuo lavoro o sparare prezzi troppo alti per paura. Entrambi ti danneggiano.",
      gradient: "from-red-500 to-pink-500",
      bgGradient: "from-red-50 to-pink-50",
    },
    {
      icon: BarChart3,
      title: "Mancanza di Controllo Reale",
      description: "Navigare a vista senza sapere quali progetti sono davvero profittevoli e quali ti stanno facendo perdere tempo e denaro.",
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50",
    },
  ]

  return (
    <motion.section
      id="problem-section"
      className="py-20 sm:py-28 px-4 bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/30"
      variants={sectionAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container mx-auto">
        <motion.div variants={itemAnimation} className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-slate-800 tracking-tight">
            Il Problema Silenzioso che{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Costa Caro
            </span>{" "}
            ai Freelancer
          </h2>
          <p className="text-lg sm:text-xl text-slate-600">
            Lavori sodo, ma la mancanza di chiarezza su tempi, costi e margini reali ti fa perdere soldi e opportunità.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={itemAnimation}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card
                className={`h-full bg-gradient-to-br ${problem.bgGradient} border-2 border-white/50 shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <CardHeader>
                  <motion.div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${problem.gradient} mb-4 shadow-md`}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <problem.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <CardTitle className="text-xl font-semibold text-slate-800">{problem.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">{problem.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default ProblemSection 