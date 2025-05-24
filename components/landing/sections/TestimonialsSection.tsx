"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Testimonial {
  name: string
  role: string
  content: string
  avatarInitials: string
  rating: number
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
  sectionAnimation: any
  itemAnimation: any
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  sectionAnimation,
  itemAnimation,
}) => {
  return (
    <motion.section
      id="testimonials-section"
      className="py-20 sm:py-28 px-4 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50"
      variants={sectionAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      <div className="container mx-auto">
        <motion.div variants={itemAnimation} className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-slate-800 tracking-tight">
            Amato da Freelancer e Agenzie come Te
          </h2>
          <p className="text-lg sm:text-xl text-slate-600">
            Scopri come EBITDA Dashboard sta trasformando il modo di lavorare (e guadagnare).
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemAnimation}
              className="h-full"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full bg-white/90 backdrop-blur-sm border-2 border-white/50 shadow-lg p-6 flex flex-col hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white font-semibold text-xl shadow-lg flex-shrink-0">
                    {testimonial.avatarInitials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex space-x-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 italic leading-relaxed flex-grow text-sm">"{testimonial.content}"</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default TestimonialsSection 