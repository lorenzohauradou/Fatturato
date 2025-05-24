"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import CountUp from "@/components/landing/CountUp"

interface Stat {
  number: number
  label: string
  isRating?: boolean
}

interface StatsSectionProps {
  stats: Stat[]
  sectionAnimation: any
  itemAnimation: any
}

const revenueStatLabel = "Fatturato Tracciato (€)";

const StatsSection: React.FC<StatsSectionProps> = ({ stats, sectionAnimation, itemAnimation }) => {
  const [dynamicRevenue, setDynamicRevenue] = useState<number | null>(null);

  useEffect(() => {
    const revenueStatDetails = stats.find(s => s.label === revenueStatLabel);
    if (revenueStatDetails) {
      setDynamicRevenue(revenueStatDetails.number);

      const incrementAmount = 13;
      const intervalDuration = 1700;

      const intervalId = setInterval(() => {
        setDynamicRevenue(prevRevenue => 
          prevRevenue !== null ? prevRevenue + incrementAmount : revenueStatDetails.number
        );
      }, intervalDuration);

      return () => clearInterval(intervalId);
    }
  }, [stats]);

  return (
    <motion.section
      id="stats-section"
      className="py-16 sm:py-20 px-4 bg-gradient-to-r from-slate-50 via-blue-50 to-purple-50"
      variants={sectionAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemAnimation}
              className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-xl hover:scale-105 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                {
                  stat.label === revenueStatLabel
                    ? (dynamicRevenue !== null
                        ? dynamicRevenue.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 })
                        : stats.find(s => s.label === revenueStatLabel)?.number.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 })
                      )
                    : stat.isRating
                    ? stat.number.toFixed(1)
                    : <CountUp end={stat.number} />
                }
                {stat.label.includes("€") ? "" : "+"}
              </div>
              <div className="text-slate-600 text-xs sm:text-sm font-medium">
                {stat.label.replace(" (€)", "")}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default StatsSection 