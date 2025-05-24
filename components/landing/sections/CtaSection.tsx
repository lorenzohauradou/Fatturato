"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface CtaSectionProps {
  email: string
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  animateCtaButton: boolean
}

const CtaSection: React.FC<CtaSectionProps> = ({ email, handleEmailChange, animateCtaButton }) => {
  return (
    <motion.section
      id="cta-section"
      className="py-20 sm:py-28 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-pink-300 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-5 sm:mb-6">
          Pronto a Trasformare il Tuo Lavoro (e i Tuoi Guadagni)?
        </h2>
        <p className="text-lg sm:text-xl mb-8 sm:mb-10 opacity-90 max-w-2xl mx-auto">
          Unisciti a migliaia di freelancer e agenzie che hanno scelto EBITDA Dashboard per una gestione finanziaria più
          intelligente.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto">
          <Input
            type="email"
            placeholder="La tua email migliore"
            value={email}
            onChange={handleEmailChange}
            className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 h-12 text-base flex-grow focus:ring-2 focus:ring-white/80 rounded-xl shadow-sm w-full"
          />
          <motion.div
            animate={animateCtaButton ? { scale: [1, 1.05, 1], transition: { duration: 0.6, ease: "easeInOut", repeat: 1 } } : { scale: 1 }}
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 py-3 px-6 sm:px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all w-full whitespace-nowrap transform hover:scale-105 rounded-xl"
            >
              Inizia Gratis Ora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>

        <p className="text-sm opacity-80 mt-6">
          14 giorni di prova gratuita • Nessuna carta richiesta • Cancella in qualsiasi momento
        </p>
      </div>
    </motion.section>
  )
}

export default CtaSection 