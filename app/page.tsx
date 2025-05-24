"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FreelancingDashboard from "@/components/freelancing/FreelancingDashboard"
import BusinessDashboard from "@/components/business/BusinessDashboard"
import AssetsDashboard from "@/components/networth/AssetsDashboard"
import { Briefcase, Building2, TrendingUp } from "lucide-react"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("freelancing")
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const SCROLL_THRESHOLD = 50; // Quanto scrollare prima che l'header scompaia
  const HIDE_THRESHOLD = 10;   // Differenza minima di scroll per triggerare cambio visibilità

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (Math.abs(currentScrollY - lastScrollY) < HIDE_THRESHOLD && currentScrollY > SCROLL_THRESHOLD) {
      // Non fare nulla se lo scroll è piccolo e non siamo in cima, per evitare scatti
      return;
    }

    if (currentScrollY <= SCROLL_THRESHOLD) {
      setIsHeaderVisible(true); // Sempre visibile vicino alla cima
    } else if (currentScrollY > lastScrollY) {
      setIsHeaderVisible(false); // Scroll verso il basso, nascondi
    } else {
      setIsHeaderVisible(true); // Scroll verso l'alto, mostra
    }
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AnimatePresence>
        {isHeaderVisible && (
          <motion.header
            key="main-header"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50"
          >
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <motion.div 
                  className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 text-center sm:text-left"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link href="/home" legacyBehavior>
                    <motion.div
                      className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-2 cursor-pointer mb-2 sm:mb-0"
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
                      className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Business Analytics Hub
                    </motion.h1>
                    <motion.p 
                      className="text-base sm:text-lg text-gray-600 font-medium mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Dashboard Professionale per il Controllo Finanziario
                    </motion.p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 sm:px-6 py-2 rounded-full shadow-lg text-sm sm:text-base"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">AI-Powered Analytics</span>
                </motion.div>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

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
