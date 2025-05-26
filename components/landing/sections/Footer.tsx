"use client"

import type React from "react"
import Image from "next/image"

interface FooterLink {
  label: string
  action?: () => void // Per i link che usano scrollToSection
  href?: string // Per i link esterni o pagine separate
  disabled?: boolean
}

interface FooterLinkCategory {
  title: string
  links: FooterLink[]
}

interface FooterProps {
  scrollToSection: (id: string) => void
}

const Footer: React.FC<FooterProps> = ({ scrollToSection }) => {
  const footerLinks: FooterLinkCategory[] = [
    {
      title: "Prodotto",
      links: [
        { label: "Funzionalità", action: () => scrollToSection("features-section") },
        { label: "Prezzi", action: () => scrollToSection("pricing") },
        { label: "Demo", action: () => scrollToSection("killer-combo-section") },
        { label: "API", disabled: true },
      ],
    },
    {
      title: "Risorse",
      links: [
        { label: "Blog", disabled: true },
        { label: "Guide per Freelancer", disabled: true },
        { label: "Centro Assistenza", href: "#" }, // Esempio link esterno/pagina
        { label: "System Status", disabled: true },
      ],
    },
    {
      title: "Azienda",
      links: [
        { label: "Chi Siamo", disabled: true },
        { label: "Lavora con Noi", disabled: true },
        { label: "Privacy Policy", href: "#" }, // Esempio link esterno/pagina
        { label: "Termini di Servizio", href: "#" }, // Esempio link esterno/pagina
      ],
    },
  ]

  return (
    <footer className="py-12 sm:py-16 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300 border-t border-slate-700">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-md">
                <Image src="/online-analytical.png" alt="EBITDA Dashboard Logo" width={28} height={28} className="sm:w-7 sm:h-7" />
              </div>
              <span className="font-bold text-lg text-white">Fatturato AI</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Il tool AI per freelancer e agenzie che vogliono massimizzare la profittabilità di ogni progetto.
            </p>
          </div>

          {footerLinks.map((category) => (
            <div key={category.title}>
              <h4 className="font-semibold text-white mb-4">{category.title}</h4>
              <ul className="space-y-2 text-sm">
                {category.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={link.action}
                      // href={link.href} // Se fosse un <a> tag
                      // target={link.href ? "_blank" : undefined}
                      // rel={link.href ? "noopener noreferrer" : undefined}
                      className={`hover:text-blue-400 transition-colors ${link.disabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      disabled={link.disabled}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Fatturato AI. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 