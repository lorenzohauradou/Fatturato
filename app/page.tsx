"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FreelancingDashboard from "@/components/freelancing/FreelancingDashboard"
import BusinessDashboard from "@/components/business/BusinessDashboard"
import AssetsDashboard from "@/components/networth/AssetsDashboard"
import { Briefcase, Building2, TrendingUp } from "lucide-react"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("freelancing")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header
        className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link href="/home" legacyBehavior>
                <motion.div
                  className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-1.5 sm:p-2 cursor-pointer"
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src="/online-analytical.png"
                    alt="Dashboard Analytics"
                    fill
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </Link>
              <div className="text-center sm:text-left">
                <motion.h1 
                  className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Business Analytics Hub
                </motion.h1>
                <p className="hidden md:block text-gray-600">Dashboard per il Controllo Finanziario</p>

              </div>
            </motion.div>

            <motion.div
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg text-xs sm:text-sm"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">AI-Powered Analytics</span>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-md border border-white/20">
            <TabsTrigger
              value="freelancing"
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r from-blue-500 to-blue-700 data-[state=active]:text-white text-black shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <Briefcase className="w-4 h-4" />
              <span>Freelancing</span>
            </TabsTrigger>
            <TabsTrigger
              value="business"
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r from-purple-500 to-purple-700 data-[state=active]:text-white text-black shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <Building2 className="w-4 h-4" />
              <span>Business</span>
            </TabsTrigger>
            <TabsTrigger
              value="assets"
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r from-green-500 to-green-700 data-[state=active]:text-white text-black shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Assets</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="freelancing" className="mt-6">
            <FreelancingDashboard />
          </TabsContent>

          <TabsContent value="business" className="mt-6">
            <BusinessDashboard />
          </TabsContent>

          <TabsContent value="assets" className="mt-6">
            <AssetsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
