"use client"

import type React from "react"
import { useState, useEffect } from "react"

// Importa i nuovi componenti di sezione e helper
import Header from "@/components/landing/sections/Header"
import HeroSection from "@/components/landing/sections/HeroSection"
import StatsSection from "@/components/landing/sections/StatsSection"
import KillerComboSection from "@/components/landing/sections/KillerComboSection"
import ProblemSection from "@/components/landing/sections/ProblemSection"
import FeaturesSection, { type Feature } from "@/components/landing/sections/FeaturesSection"
import TestimonialsSection from "@/components/landing/sections/TestimonialsSection"
import PricingSection, { type Plan } from "@/components/landing/sections/PricingSection"
import CtaSection from "@/components/landing/sections/CtaSection"
import Footer from "@/components/landing/sections/Footer"
import FaqSection, { type FaqItem } from "@/components/landing/sections/FaqSection"

// Importa le icone necessarie
import {
  TrendingUp,
  FileText,
  Brain,
  Zap,
  Mail,
  UploadCloud,
  Wand2,
  BarChart3,
} from "lucide-react"

// Definizioni dei dati spostate fuori dal componente per referenze stabili
const navLinks = [
  { href: "features-section", label: "Funzionalità" },
  { href: "pricing", label: "Prezzi" },
  { href: "testimonials-section", label: "Testimonianze" },
  { href: "faq-section", label: "FAQ" },
];

const statsData = [
  { number: 2500, label: "Freelancer e Agenzie" },
  { number: 459750, label: "Fatturato Tracciato (€)" },
  { number: 15000, label: "Progetti Gestiti" },
  { number: 4.9, label: "Rating Medio Utenti", isRating: true },
];

const featuresData: Feature[] = [
  {
    icon: UploadCloud,
    title: "PDF Task Extraction",
    description: "Carica un contratto PDF e l'AI estrae task, milestone e budget in secondi.",
    badge: "AI Game Changer",
    color: "blue",
    bgColorClass: "bg-blue-100",
    textColorClass: "text-blue-600",
    borderColorClass: "hover:border-blue-400",
    iconColorClass: "text-blue-600",
  },
  {
    icon: Wand2,
    title: "Smart Project Estimation",
    description: "L'AI analizza progetti simili e suggerisce prezzi e tempi realistici per il tuo mercato.",
    badge: "Intelligenza Artificiale",
    color: "emerald",
    bgColorClass: "bg-emerald-100",
    textColorClass: "text-emerald-600",
    borderColorClass: "hover:border-emerald-400",
    iconColorClass: "text-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description: "Previsioni di cash flow, potenziali ritardi e performance del progetto in tempo reale.",
    badge: "Visione Strategica",
    color: "green",
    bgColorClass: "bg-green-100",
    textColorClass: "text-green-700",
    borderColorClass: "hover:border-green-400",
    iconColorClass: "text-green-600",
  },
  {
    icon: Zap,
    title: "AI Project Assistant",
    description: "Suggerimenti automatici per ottimizzare prezzi, scadenze e gestire i progetti proattivamente.",
    badge: "Efficienza Massima",
    color: "amber",
    bgColorClass: "bg-amber-100",
    textColorClass: "text-amber-700",
    borderColorClass: "hover:border-amber-400",
    iconColorClass: "text-amber-600",
  },
  {
    icon: TrendingUp,
    title: "Market Intelligence",
    description: "Benchmark con altri freelancer e trend di mercato per il tuo settore, per prezzi sempre competitivi.",
    badge: "Dati di Mercato",
    color: "orange",
    bgColorClass: "bg-orange-100",
    textColorClass: "text-orange-700",
    borderColorClass: "hover:border-orange-400",
    iconColorClass: "text-orange-600",
  },
  {
    icon: Mail,
    title: "Auto-Communication",
    description: "Email automatiche ai clienti su avanzamenti, report personalizzati e promemoria pagamenti.",
    badge: "Comunicazione Pro",
    color: "cyan",
    bgColorClass: "bg-cyan-100",
    textColorClass: "text-cyan-700",
    borderColorClass: "hover:border-cyan-400",
    iconColorClass: "text-cyan-600",
  },
];

const testimonialsData = [
  {
    name: "Marco R.",
    role: "Web Developer Freelance",
    content: "Da quando uso EBITDA Dashboard, ho aumentato i miei margini del 20%! Il PDF parsing è una magia, mi fa risparmiare ore ogni settimana.",
    avatarInitials: "MR",
    rating: 5,
  },
  {
    name: "Laura B.",
    role: "Consulente Marketing",
    content: "Finalmente so quanto chiedo e quanto guadagno per ogni attività. La Smart Estimation mi dà una sicurezza incredibile nei preventivi.",
    avatarInitials: "LB",
    rating: 5,
  },
  {
    name: "Studio Flow",
    role: "Agenzia Digitale",
    content: "Gestire più progetti e collaboratori era un incubo. Ora abbiamo tutto sotto controllo e le predictive analytics ci aiutano a pianificare meglio il cashflow.",
    avatarInitials: "SF",
    rating: 5,
  },
];

const plansData: Plan[] = [
  {
    name: "Gratuito",
    price: "0",
    period: "per sempre",
    description: "Inizia a tracciare i tuoi primi progetti.",
    features: ["Max 3 progetti attivi", "Analytics base", "Task manuali", "Dashboard intuitiva"],
    cta: "Inizia Gratis",
    popular: false,
    borderColor: "border-slate-300",
    buttonClass: "bg-slate-600 hover:bg-slate-700 text-white",
    textColor: "text-slate-800",
    popularTextColor: "text-blue-600",
  },
  {
    name: "Premium",
    price: "9.99",
    period: "al mese",
    description: "Per freelancer che vogliono crescere.",
    features: [
      "Progetti illimitati",
      "✨ Estrazione tasks da PDF",
      "🧠 Stima automatica del preventivo",
      "📊 Piano d'azione",
      "Export avanzati",
      "Supporto prioritario",
    ],
    cta: "Prova 14 Giorni Gratis",
    popular: true,
    borderColor: "border-blue-500",
    buttonClass: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white",
    textColor: "text-slate-800",
    popularTextColor: "text-blue-600",
  },
  {
    name: "Pro",
    price: "19.99",
    period: "al mese",
    description: "Per professionisti e piccole agenzie.",
    features: [
      "Tutto Premium +",
      "🤖 AI Assistant",
      "📈 Market Intelligence",
      "📧 Auto-Communication: email, whatsapp",
      "Multi-workspace",
      "Accesso API",
    ],
    cta: "Scegli Pro",
    popular: false,
    borderColor: "border-slate-300",
    buttonClass: "bg-slate-600 hover:bg-slate-700 text-white",
    textColor: "text-slate-800",
    popularTextColor: "text-blue-600",
  },
  {
    name: "Enterprise",
    price: "49.99",
    period: "utente/mese",
    description: "Per team e aziende strutturate.",
    features: [
      "Tutto Pro +",
      "Team collaboration avanzata",
      "White-label e personalizzazioni",
      "Integrazioni dedicate",
      "Custom AI training (opzionale)",
      "Supporto enterprise dedicato",
    ],
    cta: "Contattaci",
    popular: false,
    borderColor: "border-slate-300",
    buttonClass: "bg-slate-600 hover:bg-slate-700 text-white",
    textColor: "text-slate-800",
    popularTextColor: "text-blue-600",
  },
];

// Dati per la sezione FAQ
const faqData: FaqItem[] = [
  {
    question: "Come funziona l'estrazione automatica dei task dai PDF?",
    answer: "Utilizziamo algoritmi di Natural Language Processing (NLP) e Machine Learning per analizzare la struttura e il contenuto dei tuoi contratti PDF. Il sistema identifica sezioni chiave come deliverable, scadenze, e menzioni di budget per pre-compilare il tuo progetto. Più contratti analizzi, più diventa preciso!"
  },
  {
    question: "I miei dati sono al sicuro?",
    answer: "Assolutamente. La sicurezza dei tuoi dati è la nostra massima priorità. Utilizziamo crittografia end-to-end per i dati in transito e a riposo, e i nostri server sono ospitati in data center sicuri e conformi agli standard più elevati. Non condividiamo mai i tuoi dati con terze parti."
  },
  {
    question: "Cosa succede se il mio PDF non viene letto correttamente?",
    answer: "Anche se la nostra AI è molto avanzata, nessun sistema è perfetto. Se un PDF non viene analizzato come previsto, hai sempre la possibilità di inserire o modificare manualmente i dati del progetto. Inoltre, il nostro team di supporto è pronto ad assisterti per casi particolari."
  },
  {
    question: "Posso integrare Fatturato.app con altri tool?",
    answer: "Stiamo lavorando attivamente per espandere le nostre integrazioni. Attualmente offriamo alcune integrazioni dirette e la possibilità di esportare i dati in formati comuni. I piani Pro ed Enterprise includono anche l'accesso API per integrazioni personalizzate."
  },
  {
    question: "Come funziona il periodo di prova gratuita?",
    answer: "Il piano Premium offre 14 giorni di prova gratuita senza necessità di inserire una carta di credito. Avrai accesso a tutte le funzionalità Premium per testare a fondo il prodotto. Al termine della prova, potrai decidere se sottoscrivere un piano a pagamento o continuare con il piano Gratuito con funzionalità limitate."
  },
];

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [animateCtaButton, setAnimateCtaButton] = useState(false)
  const [heroWord, setHeroWord] = useState<"soldi" | "tempo">("soldi")

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroWord((prev) => (prev === "soldi" ? "tempo" : "soldi"))
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (e.target.value.length > 2 && !animateCtaButton) {
      setAnimateCtaButton(true)
      setTimeout(() => setAnimateCtaButton(false), 1200)
    }
  }

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  const heroAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 },
    },
  }

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const sectionAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.7, ease: "easeOut", staggerChildren: 0.15 },
    }),
  }
  
  // Le definizioni dei dati sono state spostate sopra, fuori dal componente.

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 text-slate-800 overflow-x-hidden antialiased">
      <Header navLinks={navLinks} scrollToSection={scrollToSection} />
      <HeroSection
        heroWord={heroWord}
        heroAnimation={heroAnimation}
        itemAnimation={itemAnimation}
        scrollToSection={scrollToSection}
      />
      <StatsSection stats={statsData} sectionAnimation={sectionAnimation} itemAnimation={itemAnimation} />
      <KillerComboSection sectionAnimation={sectionAnimation} itemAnimation={itemAnimation} />
      <ProblemSection sectionAnimation={sectionAnimation} itemAnimation={itemAnimation} />
      <FeaturesSection features={featuresData} sectionAnimation={sectionAnimation} itemAnimation={itemAnimation} />
      <PricingSection plans={plansData} />
      <FaqSection faqs={faqData} sectionAnimation={sectionAnimation} itemAnimation={itemAnimation} />
      <TestimonialsSection testimonials={testimonialsData} sectionAnimation={sectionAnimation} itemAnimation={itemAnimation} />
      <CtaSection email={email} handleEmailChange={handleEmailChange} animateCtaButton={animateCtaButton} />
      <Footer scrollToSection={scrollToSection} />
    </div>
  )
}