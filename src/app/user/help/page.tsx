
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, MessageCircle, Mail, Phone, Clock, 
  ChevronRight, Search, BookOpen, Video, FileText, 
  MessageSquare, Send, ChevronDown, CheckCircle,
  AlertCircle, ThumbsUp, ThumbsDown, ExternalLink,
  LifeBuoy, Shield, CreditCard, Lock, Smartphone,
  Users, Headphones, Globe, Award, Star, Calendar,
  X, Loader2, Check, Copy, Rocket, Target, Brain
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface TicketData {
  subject: string;
  message: string;
  priority: "low" | "medium" | "high";
}

export default function UserHelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData>({
    subject: "",
    message: "",
    priority: "medium"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const categories = [
    { id: "all", name: "All Topics", icon: HelpCircle },
    { id: "getting-started", name: "Getting Started", icon: Rocket },
    { id: "account", name: "Account & Security", icon: Shield },
    { id: "transactions", name: "Transactions", icon: CreditCard },
    { id: "budget", name: "Budget & Goals", icon: Target },
    { id: "ai-features", name: "AI Features", icon: Brain },
  ];

  const faqs: FAQItem[] = [
    {
      question: "How do I create a new transaction?",
      answer: "To create a new transaction, go to Transactions page and click on 'Add Transaction' button. Fill in the amount, category, description, and date. Then click 'Create Transaction' to save it.",
      category: "transactions"
    },
    {
      question: "How do I set up a monthly budget?",
      answer: "Navigate to Budgets page, click 'Create Budget', select a category, set your monthly limit, and choose the period. The system will track your spending against this budget.",
      category: "budget"
    },
    {
      question: "How does the AI Assistant work?",
      answer: "Our AI Assistant uses Google Gemini AI to provide personalized financial advice. You can ask questions about saving money, budgeting, investments, and get instant responses in Bengali or English.",
      category: "ai-features"
    },
    {
      question: "Is my financial data secure?",
      answer: "Yes! We use bank-level 256-bit encryption to protect your data. All transactions are securely stored and never shared with third parties.",
      category: "account"
    },
    {
      question: "How do I set savings goals?",
      answer: "Go to Goals page, click 'Create Goal', enter your goal name, target amount, and deadline. You can track your progress and add money to your goals anytime.",
      category: "budget"
    },
    {
      question: "Can I connect my bank account?",
      answer: "Currently, we support manual transaction entry. Automatic bank syncing will be available in our upcoming Pro version.",
      category: "getting-started"
    },
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page. Enter your email address, and we'll send you a password reset link.",
      category: "account"
    },
    {
      question: "What is the 50-30-20 rule?",
      answer: "The 50-30-20 rule is a budgeting method where 50% of income goes to needs, 30% to wants, and 20% to savings and debt repayment.",
      category: "budget"
    },
    {
      question: "How to use auto-tagging feature?",
      answer: "Go to AI Assistant, select 'Auto Tag' tab, enter your transaction description and amount. The AI will automatically suggest a category and relevant tags.",
      category: "ai-features"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and mobile banking (bKash, Nagad, Rocket) for premium subscriptions.",
      category: "account"
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSubmitError("Please login first");
        return;
      }
      
      // Simulate API call - replace with actual support ticket API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      setTicketData({ subject: "", message: "", priority: "medium" });
      setTimeout(() => {
        setShowTicketForm(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (err) {
      setSubmitError("Failed to submit ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const supportOptions = [
    { icon: MessageCircle, title: "Live Chat", description: "Chat with our support team", available: "24/7", action: "/user/ai-assistant", color: "emerald" },
    { icon: Mail, title: "Email Support", description: "Get response within 24 hours", available: "support@finnexus.com", action: "mailto:support@finnexus.com", color: "blue" },
    { icon: Phone, title: "Phone Support", description: "Talk to our experts", available: "+880 1234 567890", action: "tel:+8801234567890", color: "purple" },
    { icon: Clock, title: "Knowledge Base", description: "Browse documentation", available: "24/7 access", action: "#", color: "orange" },
  ];

  const quickLinks = [
    { title: "Getting Started Guide", icon: BookOpen, href: "#" },
    { title: "Video Tutorials", icon: Video, href: "#" },
    { title: "API Documentation", icon: FileText, href: "#" },
    { title: "Community Forum", icon: Users, href: "#" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4">
            <LifeBuoy className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-semibold">Help Center</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">How can we help you?</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">Find answers, get support, or contact our team</p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {supportOptions.map((option, idx) => (
            <motion.a
              key={idx}
              href={option.action}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl bg-${option.color}-500/20 flex items-center justify-center mb-3`}>
                <option.icon className={`w-6 h-6 text-${option.color}-400`} />
              </div>
              <h3 className="text-white font-semibold">{option.title}</h3>
              <p className="text-slate-400 text-sm mt-1">{option.description}</p>
              <p className="text-emerald-400 text-xs mt-2">{option.available}</p>
            </motion.a>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
            <button
              onClick={() => setShowTicketForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white text-sm font-medium hover:opacity-90 transition"
            >
              Contact Support
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.name}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqId(openFaqId === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-white/5 transition"
                >
                  <span className="text-white font-medium">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaqId === idx ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaqId === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 text-slate-400 text-sm border-t border-white/10">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            {filteredFaqs.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                No results found. Try a different search term.
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link, idx) => (
            <Link key={idx} href={link.href}>
              <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition group cursor-pointer">
                <link.icon className="w-8 h-8 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition" />
                <p className="text-white text-sm font-medium">{link.title}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Support Ticket Modal */}
        <AnimatePresence>
          {showTicketForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
              onClick={() => setShowTicketForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900/95 backdrop-blur-xl rounded-2xl w-full max-w-md p-6 border border-white/20 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                      <MessageSquare className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Contact Support</h2>
                  </div>
                  <button onClick={() => setShowTicketForm(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {submitSuccess ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                    <p className="text-white font-medium">Ticket Submitted!</p>
                    <p className="text-slate-400 text-sm mt-1">We'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                      <input
                        type="text"
                        value={ticketData.subject}
                        onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                        required
                        placeholder="Brief description of your issue"
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                      <select
                        value={ticketData.priority}
                        onChange={(e) => setTicketData({ ...ticketData, priority: e.target.value as any })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition"
                      >
                        <option value="low">Low - General question</option>
                        <option value="medium">Medium - Need help</option>
                        <option value="high">High - Urgent issue</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                      <textarea
                        value={ticketData.message}
                        onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                        required
                        rows={4}
                        placeholder="Describe your issue in detail..."
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none"
                      />
                    </div>

                    {submitError && (
                      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <p className="text-red-400 text-sm">{submitError}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Ticket
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
