"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, ArrowRight } from "lucide-react"

interface NavLink {
  href: string
  label: string
}

interface HeaderProps {
  navLinks: NavLink[]
  scrollToSection: (id: string) => void
}

const Header: React.FC<HeaderProps> = ({ navLinks, scrollToSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-md"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => scrollToSection("hero-section")}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-md">
              <Image src="/online-analytical.png" alt="EBITDA Dashboard Logo" width={28} height={28} className="sm:w-7 sm:h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Fatturato AI
              </h1>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                onClick={() => scrollToSection(link.href)}
                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2"
              >
                {link.label}
              </Button>
            ))}
            <Button
              variant="outline"
              className="text-slate-600 border-slate-300 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 ml-2"
            >
              Accedi
            </Button>
            <Button
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all ml-2 group"
              onClick={() => window.location.href = "/"}
            >
              Inizia Gratis <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-700"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t border-slate-200 z-40"
        >
          <nav className="flex flex-col space-y-2 p-4">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                onClick={() => {
                  scrollToSection(link.href)
                  setIsMobileMenuOpen(false) // Chiude il menu dopo il click
                }}
                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 justify-start py-3"
              >
                {link.label}
              </Button>
            ))}
            <Button
              variant="outline"
              className="text-slate-600 border-slate-300 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 w-full justify-center py-3 mt-2"
            >
              Accedi
            </Button>
            <Button
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all w-full py-3 mt-2 group"
              onClick={() => {
                window.location.href = "/"
                setIsMobileMenuOpen(false)
              }}
            >
              Inizia Gratis <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}

export default Header 