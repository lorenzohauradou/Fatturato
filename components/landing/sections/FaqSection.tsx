"use client"

import type React from "react"
import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

export interface FaqItem {
  question: string
  answer: string
}

interface FaqSectionProps {
  faqs: FaqItem[]
  sectionAnimation?: any // Opzionale, se vuoi animare l'intera sezione
  itemAnimation?: any    // Opzionale, per animare i singoli item
}

const FaqSection: React.FC<FaqSectionProps> = ({ faqs, sectionAnimation, itemAnimation }) => {
  return (
    <motion.section
      id="faq-section"
      className="py-20 sm:py-28 px-4 bg-white"
      variants={sectionAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      <div className="container mx-auto max-w-3xl">
        <motion.div variants={itemAnimation} className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-100 to-green-100 p-3 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-800 tracking-tight">
            Domande Frequenti
          </h2>
          <p className="text-lg sm:text-xl text-slate-600">
            Trova risposte rapide alle domande più comuni sul nostro servizio.
          </p>
        </motion.div>

        <motion.div variants={itemAnimation}>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="bg-slate-50/70 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <AccordionTrigger className="text-left font-medium text-slate-700 hover:text-blue-600 px-6 py-4 text-base sm:text-lg rounded-t-xl">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 text-slate-600 text-base leading-relaxed bg-white rounded-b-xl">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default FaqSection 