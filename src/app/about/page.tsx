
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles, ArrowRight, Brain, Shield, Users, Award, 
  Rocket, Target, Globe, Heart, CheckCircle, Zap,
  TrendingUp, Wallet, Clock, Coffee
} from "lucide-react";
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

export default function AboutPage() {
  const stats = [
    { value: "10K+", label: "Active Users", icon: Users },
    { value: "$50M+", label: "Money Managed", icon: Wallet },
    { value: "99.9%", label: "AI Accuracy", icon: Brain },
    { value: "24/7", label: "Support", icon: Clock },
  ];

  const values = [
    { icon: Shield, title: "Security First", desc: "Bank-level encryption to protect your data" },
    { icon: Rocket, title: "Innovation", desc: "Cutting-edge AI technology" },
    { icon: Heart, title: "User-Centric", desc: "Designed for your needs" },
    { icon: Target, title: "Transparency", desc: "Clear and honest pricing" },
  ];

  const team = [
    { name: "Sneara Parvin", role: "Founder & CEO", image: "https://i.pravatar.cc/150?u=ceo", bio: "AI and Finance expert with 10+ years experience" },
    { name: "John Doe", role: "CTO", image: "https://i.pravatar.cc/150?u=cto", bio: "Former Google AI engineer" },
    { name: "Jane Smith", role: "Head of Product", image: "https://i.pravatar.cc/150?u=product", bio: "Product leader with fintech background" },
    { name: "Mike Johnson", role: "Lead Developer", image: "https://i.pravatar.cc/150?u=dev", bio: "Full-stack developer and AI enthusiast" },
  ];

  const milestones = [
    { year: "2023", title: "Company Founded", desc: "FinNexus was born with a vision to democratize AI-powered finance" },
    { year: "2024", title: "Beta Launch", desc: "Launched beta version with 1,000+ early adopters" },
    { year: "2025", title: "AI Integration", desc: "Integrated Gemini AI for advanced financial insights" },
    { year: "2026", title: "Global Expansion", desc: "Expanded services to 50+ countries worldwide" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full animate-pulse delay-1000" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold mb-6 uppercase tracking-widest"
          >
            <Sparkles size={14} className="animate-spin-slow" /> Our Story
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black uppercase mb-6"
          >
            About{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              FinNexus
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto"
          >
            We're on a mission to democratize AI-powered personal finance and help people achieve financial freedom.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeInUp}>
            <span className="text-emerald-500 text-sm font-semibold uppercase tracking-wider">Our Mission</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase mt-2 mb-6">
              Empowering{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Financial Freedom
              </span>
            </h2>
            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
              At FinNexus, we believe that everyone deserves access to intelligent financial tools. 
              Our AI-powered platform simplifies complex financial decisions, helping you save more, 
              spend wisely, and achieve your goals faster.
            </p>
            <p className="text-slate-400 text-base">
              We combine cutting-edge artificial intelligence with intuitive design to create a 
              seamless financial management experience that works for you, not against you.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
            <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-2xl">10x Faster</h3>
                  <p className="text-slate-400">Financial insights</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-2xl">Bank-Grade</h3>
                  <p className="text-slate-400">Security & Encryption</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-emerald-500 text-sm font-semibold uppercase tracking-wider">Statistics</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase mt-2 mb-4">
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Impact</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
              >
                <stat.icon className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="text-emerald-500 text-sm font-semibold uppercase tracking-wider">Core Values</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase mt-2 mb-4">
            What We{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Believe In</span>
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all group"
            >
              <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <value.icon className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{value.title}</h3>
              <p className="text-slate-400 text-sm">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-emerald-500 text-sm font-semibold uppercase tracking-wider">Timeline</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase mt-2 mb-4">
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Journey
              </span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
              >
                <div className="absolute -top-3 left-6 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-black text-lg">
                  {milestone.year.slice(-2)}
                </div>
                <div className="mt-6">
                  <h3 className="text-white font-bold text-xl mb-2">{milestone.title}</h3>
                  <p className="text-slate-400 text-sm">{milestone.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="text-emerald-500 text-sm font-semibold uppercase tracking-wider">Team</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase mt-2 mb-4">
            Behind the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Magic
            </span>
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all group"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-emerald-500/30 group-hover:border-emerald-500 transition"
              />
              <h3 className="text-white font-bold text-lg">{member.name}</h3>
              <p className="text-emerald-400 text-sm mb-2">{member.role}</p>
              <p className="text-slate-400 text-xs">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl p-12 border border-white/10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already managing their finances smarter with FinNexus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition">
                  Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-xl">
                  Contact Us
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
