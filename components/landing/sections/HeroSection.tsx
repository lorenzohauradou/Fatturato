"use client"

import type React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Check, PlayCircle, Rocket, Play, FileText, Target } from "lucide-react"

interface HeroSectionProps {
  heroWord: "soldi" | "tempo"
  heroAnimation: any
  itemAnimation: any
  scrollToSection: (id: string) => void
}

const HeroSection: React.FC<HeroSectionProps> = ({
  heroWord,
  heroAnimation,
  itemAnimation,
  scrollToSection,
}) => {
  return (
    <motion.section
      id="hero-section"
      className="relative py-20 sm:py-28 md:py-32 px-4 overflow-hidden bg-white"
      variants={heroAnimation}
      initial="hidden"
      animate="visible"
    >
      {/* Background minimal con forme sottili */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-30" />
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-green-100 rounded-full blur-xl opacity-30" />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-orange-100 rounded-full blur-lg opacity-30" />
      </div>
      {/* Pattern sottile */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenuto testuale */}
          <motion.div variants={itemAnimation} className="text-center lg:text-left">
            <Badge className="mb-6 md:w-1/3 justify-center md:justify-start bg-white/90 border hover:bg-blue-100 border-blue-200 text-blue-800 px-3 py-1.5 text-sm font-semibold flex items-center gap-2 shadow-md rounded-full">
              <Brain className="w-5 h-5 text-blue-500 mr-1" />
              AI powered
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent leading-tight tracking-tight">
              Smetti di Perdere{" "}
              <motion.span
                key={heroWord}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="inline-block mx-1 text-orange-400 bg-none w-32 text-center"
              >
                {heroWord}
              </motion.span>
              <br className="hidden sm:block" />
              <span className="bg-none text-slate-800">Massimizza i Guadagni</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
              <strong>Importa un PDF</strong> del lavoro per il <strong>tuo cliente</strong> ottieni: il <strong>preventivo</strong> da offrirgli, <strong>piano d'azione, tasks e budget.</strong><br /><br />Mantieni il controllo di tutte le <strong>tue attività</strong> in un <strong>unico posto</strong> dove tutto avviene in maniera <strong>automatica!</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all group font-semibold"
                onClick={() => window.location.href = "/"}
              >
                <Rocket className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Inizia la Prova Gratuita
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-blue-600 border-blue-300 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-400 px-8 py-4 text-lg group transform hover:scale-105 transition-all"
              >
                <PlayCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Guarda la Demo
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Nessuna carta richiesta
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Setup in 2 minuti
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Cancella quando vuoi
              </div>
            </div>
          </motion.div>

          {/* Area video/demo - Design minimal */}
          <motion.div variants={itemAnimation} className="relative">
            <div className="relative bg-white rounded-2xl p-6 border border-slate-200 shadow-xl">
              {/* Placeholder per video */}
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden group cursor-pointer border border-slate-200">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
                <motion.div
                  className="relative z-10 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:shadow-lg transition-shadow">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <p className="text-slate-800 font-semibold text-lg">Guarda EBITDA Dashboard in Azione</p>
                  <p className="text-slate-500 text-sm mt-2">
                    2 minuti di demo che cambieranno il tuo modo di lavorare
                  </p>
                </motion.div>

                {/* Elementi decorativi minimal */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-red-400 rounded-full opacity-80"></div>
                <div className="absolute top-4 right-12 w-3 h-3 bg-yellow-400 rounded-full opacity-80"></div>
                <div className="absolute top-4 right-20 w-3 h-3 bg-green-400 rounded-full opacity-80"></div>
              </div>

              {/* Indicatori di funzionalità - Design pulito */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2 border border-blue-100">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-slate-600 text-xs font-medium">PDF Upload</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2 border border-purple-100">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-slate-600 text-xs font-medium">AI Analysis</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2 border border-green-100">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-slate-600 text-xs font-medium">Smart Pricing</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default HeroSection 