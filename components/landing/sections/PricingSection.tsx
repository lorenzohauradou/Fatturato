"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export interface Plan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  popular: boolean
  borderColor: string // Potrebbe essere gestito diversamente
  buttonClass: string
  textColor: string // Potrebbe essere gestito diversamente
  popularTextColor: string // Potrebbe essere gestito diversamente
}

interface PricingSectionProps {
  plans: Plan[]
}

const PricingSection: React.FC<PricingSectionProps> = ({ plans }) => {
  return (
    <section
      id="pricing"
      className="py-20 sm:py-28 px-4 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-slate-800 tracking-tight">
            Prezzi Semplici e Trasparenti. Valore Immenso.
          </h2>
          <p className="text-lg sm:text-xl text-slate-600">
            Inizia gratis. Scala quando sei pronto. Nessun costo nascosto.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col ${plan.popular ? "lg:scale-105 z-10" : ""} group`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 z-20">
                  <Badge className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-1.5 text-xs sm:text-sm font-semibold shadow-lg border-none rounded-full">
                    Più Popolare
                  </Badge>
                </div>
              )}

              <Card
                className={`h-full flex flex-col bg-white/90 backdrop-blur-sm border-2 ${plan.popular ? "border-blue-500 shadow-2xl group-hover:shadow-2xl" : "border-white/50 shadow-lg group-hover:shadow-xl"} rounded-2xl overflow-hidden transition-shadow duration-300`}
              >
                <CardHeader
                  className={`text-center pt-8 pb-6 ${plan.popular ? "bg-gradient-to-br from-blue-50 to-purple-50" : ""}`}
                >
                  <CardTitle
                    className={`text-2xl font-semibold ${plan.popular ? plan.popularTextColor : plan.textColor}`}
                  >
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span
                      className={`text-4xl sm:text-5xl font-extrabold ${plan.popular ? "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" : "text-slate-800"}`}
                    >
                      €{plan.price}
                    </span>
                    <span className="text-slate-500">/{plan.period}</span>
                  </div>
                  <p className="text-slate-500 mt-3 text-sm px-2">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6 flex-grow flex flex-col justify-between px-6 pb-8 pt-4">
                  <ul className="space-y-3 text-sm">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span
                          className="text-slate-600"
                          dangerouslySetInnerHTML={{
                            __html: feature.replace(
                              /✨|🧠|📊|🤖|📈|📧/g,
                              (match) => `<span class="mr-1.5">${match}</span>`,
                            ),
                          }}
                        />
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    className={`w-full mt-8 py-3 text-base font-semibold ${plan.buttonClass} shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-105`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection 