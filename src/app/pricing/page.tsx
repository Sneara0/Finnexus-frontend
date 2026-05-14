
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Check, Sparkles, Zap, Shield, Users, 
  TrendingUp, Wallet, Target, Bell, BarChart,
  CreditCard, Brain, Star, Crown, Infinity,
  ArrowRight, X, HelpCircle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for getting started",
      icon: Star,
      color: "slate",
      features: [
        "Up to 100 transactions/month",
        "Basic budget tracking",
        "3 savings goals",
        "Basic AI insights",
        "Email support",
        "1 month data history"
      ],
      notIncluded: [
        "Advanced AI recommendations",
        "Unlimited categories",
        "Bank sync",
        "Priority support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: { monthly: 499, yearly: 4990 },
      description: "Best for individuals",
      icon: Crown,
      color: "emerald",
      features: [
        "Unlimited transactions",
        "Advanced budget tracking",
        "Unlimited savings goals",
        "Advanced AI insights",
        "Priority support",
        "12 months data history",
        "Bank account sync",
        "Custom categories",
        "AI chat assistant",
        "Export to CSV/PDF"
      ],
      notIncluded: [],
      cta: "Start Pro",
      popular: true
    },
    {
      name: "Business",
      price: { monthly: 999, yearly: 9990 },
      description: "For teams and businesses",
      icon: Users,
      color: "purple",
      features: [
        "Everything in Pro",
        "Multi-user access",
        "Team budgeting",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "Unlimited data history",
        "Advanced analytics",
        "White-label reports",
        "24/7 phone support"
      ],
      notIncluded: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const features = [
    { icon: Brain, title: "AI-Powered Insights", free: true, pro: true, business: true },
    { icon: Wallet, title: "Budget Tracking", free: true, pro: true, business: true },
    { icon: Target, title: "Goals Setting", free: true, pro: true, business: true },
    { icon: TrendingUp, title: "Advanced Analytics", free: false, pro: true, business: true },
    { icon: CreditCard, title: "Bank Sync", free: false, pro: true, business: true },
    { icon: Users, title: "Multi-User Access", free: false, pro: false, business: true },
    { icon: Bell, title: "Priority Support", free: false, pro: true, business: true },
    { icon: Zap, title: "API Access", free: false, pro: false, business: true },
  ];

  const faqs = [
    { q: "Can I change plans later?", a: "Yes, you can upgrade or downgrade your plan at any time." },
    { q: "Is there a free trial?", a: "Pro plan comes with a 14-day free trial. No credit card required." },
    { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and bank transfers." },
    { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription anytime with no hidden fees." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full animate-pulse delay-1000" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold mb-6 uppercase tracking-widest"
          >
            <Sparkles size={14} className="animate-spin-slow" /> Pricing
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black uppercase mb-6"
          >
            Simple,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Transparent
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto"
          >
            Choose the plan that works for you. All plans include a 14-day free trial.
          </motion.p>
        </div>
      </section>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex p-1 bg-white/5 rounded-full border border-white/10">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              billingCycle === "monthly" 
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              billingCycle === "yearly" 
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Yearly
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className={`relative rounded-3xl overflow-hidden transition-all duration-300 ${
                plan.popular 
                  ? "bg-gradient-to-b from-emerald-500/10 to-cyan-500/10 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/20" 
                  : "bg-white/5 border border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-[10px] font-bold px-4 py-1 rounded-bl-2xl">
                    MOST POPULAR
                  </div>
                </div>
              )}
              
              <div className="p-8">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r from-${plan.color}-500/20 to-${plan.color}-600/20 flex items-center justify-center mb-4`}>
                  <plan.icon className={`w-7 h-7 text-${plan.color}-400`} />
                </div>
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <p className="text-slate-400 text-sm mt-1">{plan.description}</p>
                
                <div className="mt-6 mb-4">
                  <span className="text-4xl font-bold text-white">৳{billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly}</span>
                  <span className="text-slate-400">/{billingCycle === "monthly" ? "month" : "year"}</span>
                </div>
                
                <Link href={plan.name === "Business" ? "/contact" : "/register"}>
                  <button
                    onMouseEnter={() => setSelectedPlan(plan.name)}
                    onMouseLeave={() => setSelectedPlan(null)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </Link>
              </div>
              
              <div className="p-8 pt-0">
                <p className="text-white text-sm font-semibold mb-4">What's included:</p>
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Comparison Table */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Compare{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Features
              </span>
            </h2>
            <p className="text-slate-400">Everything you need to make the right choice</p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 text-white font-semibold">Free</th>
                  <th className="text-center py-4 px-4 text-emerald-400 font-semibold">Pro</th>
                  <th className="text-center py-4 px-4 text-white font-semibold">Business</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, idx) => (
                  <tr key={idx} className="border-b border-white/5">
                    <td className="py-4 px-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <feature.icon className="w-4 h-4 text-slate-400" />
                        {feature.title}
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      {feature.free ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-slate-600 mx-auto" />}
                    </td>
                    <td className="text-center py-4 px-4">
                      {feature.pro ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-slate-600 mx-auto" />}
                    </td>
                    <td className="text-center py-4 px-4">
                      {feature.business ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-slate-600 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Questions
            </span>
          </h2>
          <p className="text-slate-400">Got questions? We've got answers</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white/5 rounded-2xl border border-white/10"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">{faq.q}</h3>
                  <p className="text-slate-400">{faq.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl p-12 border border-white/10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition">
                  Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-xl">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
