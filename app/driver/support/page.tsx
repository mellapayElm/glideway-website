"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  ChevronLeft, HelpCircle, MessageCircle, Phone, Mail, FileText,
  ChevronRight, Shield, Car, DollarSign, AlertTriangle, User,
  Clock, CheckCircle, Search, BookOpen, Video, ExternalLink,
  Send, X, Headphones
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface SupportTopic {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  articles: number
}

interface FAQItem {
  id: string
  question: string
  answer: string
}

export default function DriverSupportPage() {
  const [showChat, setShowChat] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [chatMessage, setChatMessage] = useState("")

  const supportTopics: SupportTopic[] = [
    { id: "earnings", icon: <DollarSign className="w-5 h-5" />, title: "Earnings & Payouts", description: "Payment issues, tips, bonuses", articles: 15 },
    { id: "trips", icon: <Car className="w-5 h-5" />, title: "Trips & Navigation", description: "Trip issues, routes, GPS", articles: 12 },
    { id: "account", icon: <User className="w-5 h-5" />, title: "Account & Documents", description: "Profile, documents, verification", articles: 18 },
    { id: "safety", icon: <Shield className="w-5 h-5" />, title: "Safety & Emergencies", description: "Incidents, safety features", articles: 10 },
    { id: "app", icon: <HelpCircle className="w-5 h-5" />, title: "App & Technical", description: "App issues, troubleshooting", articles: 20 },
    { id: "policies", icon: <FileText className="w-5 h-5" />, title: "Policies & Guidelines", description: "Community guidelines, policies", articles: 8 },
  ]

  const faqs: FAQItem[] = [
    { id: "1", question: "How do I cash out my earnings?", answer: "You can cash out your available balance anytime by going to the Payouts section. Instant cashouts have a small fee (1%, max $0.50), while weekly direct deposits are free." },
    { id: "2", question: "Why was my trip cancelled?", answer: "Trips can be cancelled by riders, the system (driver too far), or drivers. Check your trip history for specific cancellation reasons." },
    { id: "3", question: "How do I update my documents?", answer: "Go to Documents in the app menu. Tap on any document to upload a new version. Keep all documents up to date to continue driving." },
    { id: "4", question: "What happens if I decline too many trips?", answer: "Your acceptance rate affects your standing. Consistently low acceptance may impact your access to certain features or bonuses." },
    { id: "5", question: "How are fares calculated?", answer: "Fares include a base rate, distance rate, and time rate. Surge pricing may apply during high demand. You can see fare breakdowns in your trip history." },
    { id: "6", question: "How do I report a safety incident?", answer: "Tap the Safety shield icon in the app or contact emergency services directly. You can also report incidents through the trip details after completion." },
  ]

  const contactMethods = [
    { icon: <MessageCircle className="w-5 h-5" />, title: "Live Chat", description: "Chat with support", available: true, action: () => setShowChat(true) },
    { icon: <Phone className="w-5 h-5" />, title: "Phone Support", description: "1-800-GLIDEWAY", available: true, action: () => {} },
    { icon: <Mail className="w-5 h-5" />, title: "Email Support", description: "driver@glideway.com", available: true, action: () => {} },
  ]

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/driver/app" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-lg font-semibold text-white">Help & Support</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="p-4 space-y-6 pb-24">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-12"
          />
        </div>

        {/* Quick Contact */}
        <Card className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border-emerald-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Headphones className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Need immediate help?</h2>
                <p className="text-sm text-slate-400">We are here 24/7</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {contactMethods.map((method) => (
                <button
                  key={method.title}
                  onClick={method.action}
                  className="p-3 bg-slate-800/50 rounded-xl text-center cursor-pointer hover:bg-slate-800 transition-all"
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                    {method.icon}
                  </div>
                  <p className="text-xs text-white font-medium">{method.title}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Topics */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Browse by Topic
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {supportTopics.map((topic) => (
              <motion.div
                key={topic.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-all"
                onClick={() => setSelectedTopic(topic.id)}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                  {topic.icon}
                </div>
                <h3 className="text-white font-medium text-sm mb-1">{topic.title}</h3>
                <p className="text-xs text-slate-400">{topic.description}</p>
                <p className="text-xs text-blue-400 mt-2">{topic.articles} articles</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredFAQs.map((faq) => (
              <motion.div
                key={faq.id}
                className="bg-slate-800/50 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-all"
                >
                  <span className="text-white text-sm text-left pr-4">{faq.question}</span>
                  <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedFAQ === faq.id ? "rotate-90" : ""}`} />
                </button>
                {expandedFAQ === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Resources */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Video className="w-5 h-5 text-yellow-400" />
              Learning Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Driver Tutorials</p>
                  <p className="text-xs text-slate-400">Learn the basics and advanced tips</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Safety Guidelines</p>
                  <p className="text-xs text-slate-400">Stay safe while driving</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Community Guidelines</p>
                  <p className="text-xs text-slate-400">Our standards and expectations</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        {/* Emergency */}
        <Card className="bg-red-950/30 border-red-900/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Emergency?</h3>
                <p className="text-sm text-slate-400 mb-3">
                  If you are in immediate danger, contact emergency services directly.
                </p>
                <Button className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
                  <Phone className="w-4 h-4 mr-2" />
                  Call 911
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Live Chat Modal */}
      {showChat && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center"
          onClick={() => setShowChat(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="w-full max-w-lg bg-slate-900 rounded-t-2xl h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">GlideWay Support</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-emerald-400">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-slate-800 rounded-xl p-3">
                  <p className="text-sm text-white">Hi! Welcome to GlideWay Driver Support. How can I help you today?</p>
                  <p className="text-xs text-slate-500 mt-1">Just now</p>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-800">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
                <Button className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
