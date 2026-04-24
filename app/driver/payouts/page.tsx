"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  ChevronLeft, DollarSign, CreditCard, Building, Wallet, 
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle, AlertCircle,
  Plus, ChevronRight, Calendar, Zap, Shield, Info, X, 
  Landmark, BanknoteIcon, Smartphone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface PayoutMethod {
  id: string
  type: "bank" | "debit" | "instant"
  name: string
  last4: string
  isDefault: boolean
  icon: React.ReactNode
}

interface PayoutHistory {
  id: string
  date: string
  amount: number
  method: string
  status: "completed" | "pending" | "failed"
  fee: number
}

export default function DriverPayoutsPage() {
  const [showCashOut, setShowCashOut] = useState(false)
  const [cashOutAmount, setCashOutAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState<string>("1")

  const availableBalance = 487.25
  const pendingBalance = 156.80
  const totalEarnings = 42580.00

  const payoutMethods: PayoutMethod[] = [
    { id: "1", type: "bank", name: "Chase Checking", last4: "4829", isDefault: true, icon: <Building className="w-5 h-5" /> },
    { id: "2", type: "debit", name: "Visa Debit", last4: "7234", isDefault: false, icon: <CreditCard className="w-5 h-5" /> },
  ]

  const payoutHistory: PayoutHistory[] = [
    { id: "1", date: "Jan 22, 2024", amount: 892.40, method: "Chase ••4829", status: "completed", fee: 0 },
    { id: "2", date: "Jan 15, 2024", amount: 756.80, method: "Chase ••4829", status: "completed", fee: 0 },
    { id: "3", date: "Jan 8, 2024", amount: 945.20, method: "Chase ••4829", status: "completed", fee: 0 },
    { id: "4", date: "Jan 5, 2024", amount: 50.00, method: "Instant ••7234", status: "completed", fee: 0.50 },
    { id: "5", date: "Jan 1, 2024", amount: 823.15, method: "Chase ••4829", status: "completed", fee: 0 },
  ]

  const handleCashOut = () => {
    // Handle cash out logic
    setShowCashOut(false)
    setCashOutAmount("")
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/driver/app" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-lg font-semibold text-white">Payouts</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="p-4 space-y-6 pb-24">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border-emerald-800/50 overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <p className="text-emerald-400 text-sm mb-1">Available Balance</p>
              <h2 className="text-4xl font-bold text-white mb-4">${availableBalance.toFixed(2)}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-2 text-yellow-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">Pending</span>
                  </div>
                  <p className="text-lg font-semibold text-white">${pendingBalance.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-400 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs">Lifetime</span>
                  </div>
                  <p className="text-lg font-semibold text-white">${totalEarnings.toLocaleString()}</p>
                </div>
              </div>

              <Button 
                onClick={() => setShowCashOut(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                disabled={availableBalance <= 0}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Cash Out Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payout Options */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Payout Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-emerald-900/20 rounded-xl border border-emerald-800/50 cursor-pointer hover:bg-emerald-900/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-medium">Instant Cashout</p>
                  <p className="text-xs text-slate-400">Get paid in minutes</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-medium">1% fee</p>
                <p className="text-xs text-slate-400">Max $0.50</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-medium">Weekly Direct Deposit</p>
                  <p className="text-xs text-slate-400">Every Monday</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-medium">Free</p>
                <p className="text-xs text-slate-400">1-2 business days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-400" />
                Payment Methods
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 cursor-pointer">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {payoutMethods.map((method) => (
              <div 
                key={method.id}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                  method.isDefault 
                    ? "bg-emerald-900/20 border border-emerald-800/50" 
                    : "bg-slate-800/50 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    method.type === "bank" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                  }`}>
                    {method.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">{method.name}</p>
                      {method.isDefault && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">Default</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">••••{method.last4}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payout History */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Payout History
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white cursor-pointer">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {payoutHistory.map((payout) => (
              <motion.div
                key={payout.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    payout.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                    payout.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {payout.status === "completed" ? <CheckCircle className="w-5 h-5" /> :
                     payout.status === "pending" ? <Clock className="w-5 h-5" /> :
                     <AlertCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">${payout.amount.toFixed(2)}</p>
                    <p className="text-xs text-slate-400">{payout.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-300">{payout.method}</p>
                  {payout.fee > 0 && (
                    <p className="text-xs text-slate-500">Fee: ${payout.fee.toFixed(2)}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Payout Protection */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Payout Protection</h3>
                <p className="text-sm text-slate-400">
                  Your earnings are protected with bank-level security. All payouts are encrypted and verified before processing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Cash Out Modal */}
      {showCashOut && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center"
          onClick={() => setShowCashOut(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="w-full max-w-lg bg-slate-900 rounded-t-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Cash Out</h3>
              <button onClick={() => setShowCashOut(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-slate-400 text-sm mb-2">Available Balance</p>
              <p className="text-3xl font-bold text-emerald-400">${availableBalance.toFixed(2)}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Amount to Cash Out</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="number"
                    value={cashOutAmount}
                    onChange={(e) => setCashOutAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-10 bg-slate-800 border-slate-700 text-white text-xl font-semibold h-14"
                    max={availableBalance}
                  />
                </div>
                <button 
                  onClick={() => setCashOutAmount(availableBalance.toString())}
                  className="text-emerald-400 text-sm mt-2 cursor-pointer hover:text-emerald-300"
                >
                  Cash out full amount
                </button>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Cash Out To</label>
                <div className="space-y-2">
                  {payoutMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        selectedMethod === method.id
                          ? "bg-emerald-900/30 border border-emerald-800/50"
                          : "bg-slate-800/50 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {method.icon}
                        <span className="text-white">{method.name} ••{method.last4}</span>
                      </div>
                      {selectedMethod === method.id && (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl mb-6">
              <span className="text-slate-400">Instant transfer fee</span>
              <span className="text-white font-medium">
                ${Math.min(parseFloat(cashOutAmount || "0") * 0.01, 0.50).toFixed(2)}
              </span>
            </div>

            <Button 
              onClick={handleCashOut}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 cursor-pointer"
              disabled={!cashOutAmount || parseFloat(cashOutAmount) <= 0 || parseFloat(cashOutAmount) > availableBalance}
            >
              Cash Out ${cashOutAmount || "0.00"}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
