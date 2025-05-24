"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react" // Importa il tipo LucideIcon

export interface Feature {
  icon: LucideIcon // Usa LucideIcon per una tipizzazione più precisa
  title: string
  description: string
  badge: string
  color: string // Questo potrebbe non essere più necessario se usiamo classi Tailwind dirette
  bgColorClass: string
  textColorClass: string
  borderColorClass: string // Potrebbe non essere più necessario
  iconColorClass: string
}

interface FeaturesSectionProps {
  features: Feature[]
  sectionAnimation: any
  itemAnimation: any
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features, sectionAnimation, itemAnimation }) => {
  return (
    <motion.section
      id="features-section"
      className="py-20 sm:py-28 px-4 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50"
      variants={sectionAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      <div className="container mx-auto">
        <motion.div variants={itemAnimation} className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-slate-800 tracking-tight">
            Funzionalità AI Progettate per Farti{" "}
            <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              Guadagnare di Più
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
            Non un semplice project manager. EBITDA Dashboard è il tuo copilota intelligente per la crescita finanziaria.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemAnimation}
              className="h-full"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full bg-white/90 backdrop-blur-sm border-2 border-white/50 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <motion.div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.bgColorClass} shadow-md`}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <feature.icon className={`w-6 h-6 ${feature.iconColorClass}`} />
                    </motion.div>
                    <Badge
                      className={`${feature.bgColorClass} ${feature.textColorClass} border-none text-xs font-semibold px-3 py-1 rounded-full shadow-sm`}
                    >
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow pt-0">
                  <p className="text-slate-600 leading-relaxed text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default FeaturesSection 