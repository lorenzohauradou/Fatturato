"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Star, FileText, Brain, Target } from "lucide-react"

interface KillerComboStep {
  icon: React.ElementType // Per icone Lucide
  title: string
  description: string
  gradient: string
}

interface KillerComboSectionProps {
  sectionAnimation: any
  itemAnimation: any
}

const KillerComboSection: React.FC<KillerComboSectionProps> = ({ sectionAnimation, itemAnimation }) => {
  const steps: KillerComboStep[] = [
    {
      icon: FileText,
      title: "1. Carica il PDF",
      description: "Trascina il contratto, brief o capitolato del tuo cliente.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Brain,
      title: "2. L'AI Analizza Tutto",
      description: "Estrae task, milestone, requisiti e calcola un primo budget.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Target,
      title: "3. Progetto Ottimizzato",
      description: "Ricevi una stima dei costi e tempi, confrontata con i dati di mercato. Pronto per iniziare!",
      gradient: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <motion.section
      id="killer-combo-section"
      className="py-20 sm:py-28 px-4 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30"
      variants={sectionAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container mx-auto">
        <motion.div variants={itemAnimation} className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-sm font-medium rounded-full shadow-lg">
            La Combo Vincente <Star className="w-4 h-4 inline-block ml-2 fill-white" />
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-slate-800 tracking-tight">
            Da Brief a Progetto Pronto in{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              30 Secondi
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 mb-6 sm:mb-8">
            Immagina: carichi il brief del cliente. La nostra AI estrae task, scadenze e dettagli. Poi, ti suggerisce
            prezzi basati su dati reali e progetti simili.
          </p>
          <p className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Questo è il potere del PDF Parsing + Smart Estimation. Vale da solo l'abbonamento.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 items-start">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemAnimation}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50 text-center hover:shadow-2xl transition-all duration-300 transform:-translate-y-2"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <step.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default KillerComboSection 