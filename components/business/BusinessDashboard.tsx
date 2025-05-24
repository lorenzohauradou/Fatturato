"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, TrendingUp, DollarSign, Users } from "lucide-react"

export default function BusinessDashboard() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Building2 className="w-12 h-12 text-white" />
        </motion.div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">Business Dashboard</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Monitora i tuoi business SaaS, e-commerce e altre attività imprenditoriali. Tieni traccia di ricavi
          ricorrenti, crescita e metriche chiave.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-700">
                <TrendingUp className="w-5 h-5" />
                <span>SaaS Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-600">MRR, churn rate, customer lifetime value</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <DollarSign className="w-5 h-5" />
                <span>E-commerce</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600">Vendite, conversioni, inventory management</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-700">
                <Users className="w-5 h-5" />
                <span>Agency Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600">Acquisizione, retention, segmentazione</p>
            </CardContent>
          </Card>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-md mx-auto"
        >
          <p className="text-amber-700 text-sm">
            🚧 Sezione in sviluppo - Presto disponibile con AI insights per business scaling
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
