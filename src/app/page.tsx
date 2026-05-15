
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';
import { 
  Sparkles, ArrowRight, Cpu, Shield, MessageSquare, X, Send, Bot, 
  Globe, Lock, Terminal, BarChart, Rocket, Zap, TrendingUp, CheckCircle2, Layers,
  Wallet, Target, Bell, PieChart, Users, Award, Calendar, Clock, Mail, 
  Quote, Star, CreditCard, Home, Car, Coffee, ShoppingBag, Film, BookOpen,
  Brain, Menu, ChevronRight, Loader2
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

// Dynamically import 3D background to avoid SSR issues
const ThreeDBackground = dynamic(() => import('@/components/ui/ThreeDBackground'), {
  ssr: false,
  loading: () => null
});

// Social icons
const TwitterIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const LinkedinIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>;
const GithubIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function LandingPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", content: "আসসালামু আলাইকুম! আমি FinNexus AI। আপনার আর্থিক প্রশ্নের উত্তর দিতে পারি।" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize session
  useEffect(() => {
    const savedSessionId = localStorage.getItem("landingChatSessionId");
    if (savedSessionId) {
      setSessionId(savedSessionId);
    } else {
      const newSessionId = `landing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      localStorage.setItem("landingChatSessionId", newSessionId);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleGetStarted = () => {
    window.location.href = "/login"; 
  };

  // Send message to AI with Gemini API
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;
    
    const userMessage = { role: "user", content: chatInput };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        message: chatInput,
        sessionId: sessionId
      });
      
      if (response.data.success) {
        const botMessage = { 
          role: "bot", 
          content: response.data.data.response 
        };
        setMessages((prev) => [...prev, botMessage]);
        
        if (response.data.data.sessionId) {
          setSessionId(response.data.data.sessionId);
          localStorage.setItem("landingChatSessionId", response.data.data.sessionId);
        }
      } else {
        setMessages((prev) => [...prev, { 
          role: "bot", 
          content: "দুঃখিত, সার্ভারে সমস্যা হচ্ছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।" 
        }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { 
        role: "bot", 
        content: "দুঃখিত, AI সার্ভিস বর্তমানে উপলব্ধ নয়। অনুগ্রহ করে পরে আবার চেষ্টা করুন।" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Thanks for subscribing with ${email}!`);
    setEmail("");
  };

  const faqs = [
    { q: "What is FinNexus AI?", a: "FinNexus AI is an AI-powered personal finance management platform that helps you track expenses, manage budgets, and achieve financial goals." },
    { q: "Is my data secure?", a: "Yes! We use bank-level 256-bit encryption to protect all your financial data." },
    { q: "Can I connect my bank account?", a: "Yes, you can securely connect your bank accounts for automatic transaction syncing." },
    { q: "Is there a free plan?", a: "Yes, we offer a free plan with basic features. Premium plans are available for advanced features." },
  ];

  // Features Data
  const features = [
    { icon: Brain, title: "AI Insights", desc: "Personalized financial advice using artificial intelligence" },
    { icon: Wallet, title: "Smart Budgeting", desc: "Create and track budgets across all expense categories" },
    { icon: Target, title: "Goal Tracking", desc: "Set savings goals and monitor progress in real-time" },
    { icon: Bell, title: "Smart Alerts", desc: "Receive notifications for budget limits and bill reminders" },
    { icon: Shield, title: "Bank Secure", desc: "Enterprise-grade encryption to protect your data" },
    { icon: BarChart, title: "Analytics", desc: "Visualize spending patterns with interactive charts" },
  ];

  // Services Data
  const services = [
    { icon: CreditCard, title: "Expense Tracking", desc: "Automatically categorize every transaction" },
    { icon: PieChart, title: "Budget Planning", desc: "Plan your monthly budget with AI recommendations" },
    { icon: Target, title: "Goal Setting", desc: "Set and achieve your financial goals faster" },
    { icon: Bot, title: "AI Assistant", desc: "24/7 AI chat support for financial queries" },
  ];

  // Categories Data
  const categories = [
    { icon: Coffee, name: "Food & Dining", color: "emerald", count: "1,234 transactions" },
    { icon: ShoppingBag, name: "Shopping", color: "blue", count: "892 transactions" },
    { icon: Home, name: "Rent & Utilities", color: "purple", count: "456 transactions" },
    { icon: Car, name: "Transportation", color: "orange", count: "789 transactions" },
    { icon: Film, name: "Entertainment", color: "pink", count: "345 transactions" },
    { icon: BookOpen, name: "Education", color: "cyan", count: "234 transactions" },
  ];

  // Highlights Data
  const highlights = [
    { icon: Zap, title: "Real-time Updates", value: "0.2s", desc: "Processing time" },
    { icon: TrendingUp, title: "Accuracy Rate", value: "99.9%", desc: "AI categorization" },
    { icon: Users, title: "Active Users", value: "10K+", desc: "Growing daily" },
    { icon: Award, title: "Satisfaction", value: "98%", desc: "Customer rating" },
  ];

  // Statistics Data
  const statistics = [
    { label: "Transactions Processed", value: "1.2M+", icon: CreditCard },
    { label: "Money Managed", value: "$50M+", icon: Wallet },
    { label: "Active Users", value: "10K+", icon: Users },
    { label: "AI Accuracy", value: "99.9%", icon: Brain },
  ];

  // Testimonials Data
  const testimonials = [
    { name: "Alex Rivera", role: "Fintech Analyst", comment: "FinNexus has completely redefined how I track my finances. The AI categorization is incredibly accurate!", rating: 5, avatar: "https://i.pravatar.cc/150?u=alex" },
    { name: "Sarah Chen", role: "Software Architect", comment: "The integration with Prisma and the speed of the Gemini engine makes this the most robust platform I've used.", rating: 5, avatar: "https://i.pravatar.cc/150?u=sarah" },
    { name: "James Wilson", role: "Startup Founder", comment: "The AI-driven insights are a game-changer for managing multi-currency operations.", rating: 5, avatar: "https://i.pravatar.cc/150?u=james" },
  ];

  // Blogs Data
  const blogs = [
    { title: "10 Tips to Save Money", excerpt: "Learn practical ways to reduce expenses and increase savings.", date: "Dec 15, 2024", readTime: "5 min read", category: "Tips" },
    { title: "AI in Personal Finance", excerpt: "How artificial intelligence is changing the financial landscape.", date: "Dec 10, 2024", readTime: "4 min read", category: "AI" },
    { title: "Investment Guide 2025", excerpt: "Smart investment strategies for beginners and experts alike.", date: "Dec 5, 2024", readTime: "7 min read", category: "Investment" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-50 selection:bg-emerald-500/30 overflow-x-hidden font-sans">
      
      {/* 3D Background */}
      <ThreeDBackground />
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full animate-pulse" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold mb-8 uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Sparkles size={14} className="animate-spin-slow" /> Next-Gen AI Ledger v2.0
            </div>
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85] uppercase">
              Future <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-500 animate-gradient-x">Finance</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-lg mb-12 font-medium leading-relaxed italic border-l-4 border-emerald-500 pl-6">
              "Experience the convergence of Artificial Intelligence and high-frequency financial tracking."
            </p>
            <div className="flex flex-wrap gap-5">
              <Button onClick={handleGetStarted} size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-12 h-16 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all hover:scale-105 active:scale-95 group">
                GET STARTED <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative z-10 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[3.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative border border-white/10 rounded-[3rem] p-3 bg-slate-900/60 backdrop-blur-3xl shadow-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026" className="rounded-[2.5rem] grayscale group-hover:grayscale-0 transition-all duration-1000 object-cover h-[500px] w-full" alt="Company Success Data" />
              <div className="absolute bottom-8 right-8 p-6 bg-emerald-500 text-black rounded-3xl shadow-2xl animate-bounce-slow">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Company Growth</p>
                <h4 className="text-2xl font-black">+412.8%</h4>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: FEATURES */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="text-emerald-500 text-sm font-semibold uppercase tracking-wider">Features</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase mt-2 mb-4">
            Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Tools</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to take control of your finances</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div key={idx} {...fadeInUp} transition={{ delay: idx * 0.1 }} whileHover={{ y: -5 }} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <feature.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: SERVICES */}
      <section className="py-32 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-emerald-500 text-sm font-semibold uppercase tracking-wider">Services</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase mt-2 mb-4">
              What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Offer</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ delay: idx * 0.1 }} className="text-center p-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
                  <service.icon className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{service.title}</h3>
                <p className="text-slate-400 text-sm">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CATEGORIES */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="text-emerald-500 text-sm font-semibold uppercase tracking-wider">Categories</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase mt-2 mb-4">
            Track Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Spending</span>
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <motion.div key={idx} {...fadeInUp} transition={{ delay: idx * 0.1 }} whileHover={{ y: -3 }} className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center group cursor-pointer">
              <cat.icon className="w-8 h-8 mx-auto mb-2 text-emerald-400 group-hover:scale-110 transition" />
              <p className="text-white text-sm font-semibold">{cat.name}</p>
              <p className="text-slate-500 text-[10px] mt-1">{cat.count}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 5: HIGHLIGHTS */}
      <section className="py-32 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-emerald-500 text-sm font-semibold uppercase tracking-wider">Highlights</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase mt-2 mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Us</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ delay: idx * 0.1 }} className="text-center p-6 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl border border-white/10">
                <item.icon className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-3xl font-black text-white">{item.value}</h3>
                <p className="text-white font-semibold mt-2">{item.title}</p>
                <p className="text-slate-400 text-xs mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: STATISTICS */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeInUp}>
            <span className="text-emerald-500 text-sm font-semibold uppercase tracking-wider">Statistics</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase mt-2 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Impact</span>
            </h2>
            <p className="text-slate-400 text-lg">Real numbers that speak for themselves</p>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-6">
            {statistics.map((stat, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ delay: idx * 0.1 }} className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                <stat.icon className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: TESTIMONIALS */}
      <section className="py-32 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-emerald-500 text-sm font-semibold uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase mt-2 mb-4">
              What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Users Say</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ delay: idx * 0.1 }} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                <Quote className="w-8 h-8 text-emerald-400 mb-4 opacity-50" />
                <p className="text-slate-300 mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex items-center gap-3">
                  <img src={testimonial.avatar} className="w-10 h-10 rounded-full object-cover" alt={testimonial.name} />
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-slate-400 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: BLOGS */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="text-emerald-500 text-sm font-semibold uppercase tracking-wider">Blogs</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase mt-2 mb-4">
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Articles</span>
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog, idx) => (
            <motion.div key={idx} {...fadeInUp} transition={{ delay: idx * 0.1 }} className="group bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-500/30 transition-all">
              <div className="h-48 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20"></div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {blog.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.readTime}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px]">{blog.category}</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-2 group-hover:text-emerald-400 transition">{blog.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{blog.excerpt}</p>
                <Link href="#" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-sm">Read More <ArrowRight className="w-3 h-3" /></Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 9: NEWSLETTER + FAQ */}
      <section className="py-32 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          {/* Newsletter */}
          <motion.div {...fadeInUp} className="p-8 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-3xl border border-white/10">
            <Mail className="w-12 h-12 text-emerald-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Newsletter</h3>
            <p className="text-slate-400 mb-6">Subscribe to get latest updates and financial tips</p>
            <form onSubmit={handleNewsletter} className="flex gap-3">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500" required />
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6">Subscribe</Button>
            </form>
          </motion.div>

          {/* FAQ */}
          <motion.div {...fadeInUp}>
            <h3 className="text-2xl font-bold text-white mb-6">FAQ</h3>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-white/10 rounded-xl overflow-hidden">
                  <button onClick={() => setFaqOpen(faqOpen === idx ? null : idx)} className="w-full flex justify-between items-center p-4 text-left text-white font-semibold hover:bg-white/5 transition">
                    {faq.q}
                    <ChevronRight className={`w-5 h-5 transition-transform ${faqOpen === idx ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {faqOpen === idx && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <p className="p-4 pt-0 text-slate-400 text-sm">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 10: CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[100px]" />
        <motion.div {...fadeInUp} className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
            Ready to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Dominate</span>
          </h2>
          <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto">
            Join the future of finance. Get started with FinNexus AI today.
          </p>
          <Button onClick={handleGetStarted} size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-black px-12 h-16 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all hover:scale-105 active:scale-95 group">
            START NOW <Zap className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
          </Button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 px-8 border-t border-white/5 bg-[#01030a]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-black mb-4">FINNEXUS<span className="text-emerald-500">.AI</span></h3>
            <p className="text-slate-400 text-sm">Architecting Financial Freedom</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link href="#">Features</Link></li>
              <li><Link href="#">Pricing</Link></li>
              <li><Link href="#">Security</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link href='/about'>About</Link></li>
              <li><Link href='/blog'>Blog</Link></li>
              <li><Link href='/careers'>Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Social</h4>
            <div className="flex gap-4">
              <Link href="#" className="text-slate-400 hover:text-emerald-400 transition"><TwitterIcon /></Link>
              <Link href="#" className="text-slate-400 hover:text-emerald-400 transition"><LinkedinIcon /></Link>
              <Link href="#" className="text-slate-400 hover:text-emerald-400 transition"><GithubIcon /></Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-slate-500 text-xs">
          © 2026 FinNexus Global • All rights reserved
        </div>
      </footer>

      {/* FLOATING CHATBOT */}
      <div className="fixed bottom-10 right-10 z-[1000]">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }} className="absolute bottom-28 right-0 w-[350px] md:w-[450px] h-[600px] bg-slate-950/95 border border-white/10 rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col backdrop-blur-3xl">
              <div className="p-10 bg-emerald-500 flex items-center justify-between">
                <div className="flex items-center gap-4 text-black">
                  <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-emerald-500"><Bot size={28} /></div>
                  <div><p className="font-black text-lg uppercase">FinNexus AI</p></div>
                </div>
                <button onClick={() => setIsChatOpen(false)}><X size={28} /></button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`p-3 rounded-xl max-w-[80%] ${msg.role === "user" ? "bg-emerald-500 text-black" : "bg-white/10 text-white"}`}>{msg.content}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={handleKeyPress} placeholder="Ask me anything..." className="flex-1 p-3 bg-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500" />
                  <button onClick={handleSendMessage} disabled={isLoading} className="p-3 bg-emerald-500 rounded-xl text-black hover:opacity-90 transition disabled:opacity-50">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={20} />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-20 h-20 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-black shadow-[0_20px_60px_rgba(16,185,129,0.5)] hover:scale-110 transition-all border-4 border-[#020617]">
          {isChatOpen ? <X size={36} /> : <MessageSquare size={36} />}
        </button>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; background-color: #020617; scroll-behavior: smooth; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 5s ease infinite; }
        @keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>
    </div>
  );
}
