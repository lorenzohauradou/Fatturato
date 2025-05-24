"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
  color: "green" | "blue" | "emerald" | "orange" | "purple"
  trend?: string
}

export default function StatsCard({ title, value, subtitle, icon: Icon, color, trend }: StatsCardProps) {
  const getColorClasses = () => {
    const colors = {
      green: "from-green-500 to-emerald-500",
      blue: "from-blue-500 to-indigo-500",
      emerald: "from-emerald-500 to-teal-500",
      orange: "from-orange-500 to-amber-500",
      purple: "from-purple-500 to-violet-500",
    }
    return colors[color]
  }

  const getIconBg = () => {
    const colors = {
      green: "bg-green-100 text-green-600",
      blue: "bg-blue-100 text-blue-600",
      emerald: "bg-emerald-100 text-emerald-600",
      orange: "bg-orange-100 text-orange-600",
      purple: "bg-purple-100 text-purple-600",
    }
    return colors[color]
  }

  return (
    <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ duration: 0.2 }}>
      <Card
        className={`bg-gradient-to-br ${getColorClasses()} text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-white/80 text-sm font-medium">{title}</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold">{value}</p>
                {trend && <span className="text-sm bg-white/20 px-2 py-1 rounded-full">{trend}</span>}
              </div>
              <p className="text-white/70 text-sm">{subtitle}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl ${getIconBg()} flex items-center justify-center bg-white/20`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
