
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Menu, X, BrainCircuit, Bell, ChevronDown, 
  Utensils, Car, Film, ShoppingBag, Zap, 
  Stethoscope, GraduationCap, Home as HomeIcon, 
  Wallet, TrendingUp, ShieldCheck, Gift, Globe, Layers, CreditCard, Circle,
  Sparkles, Headphones, Info, LogIn, Target, Receipt
} from "lucide-react";
import gsap from "gsap";

const transactionCategories = [
  { name: "Food", label: "খাবার ও রেস্টুরেন্ট", icon: <Utensils size={14} />, color: "text-orange-400", bg: "bg-orange-400/10", slug: "food" },
  { name: "Transportation", label: "গাড়ি, বাস, ট্রেন", icon: <Car size={14} />, color: "text-blue-400", bg: "bg-blue-400/10", slug: "transportation" },
  { name: "Entertainment", label: "সিনেমা, গেম", icon: <Film size={14} />, color: "text-purple-400", bg: "bg-purple-400/10", slug: "entertainment" },
  { name: "Shopping", label: "কেনাকাটা", icon: <ShoppingBag size={14} />, color: "text-pink-400", bg: "bg-pink-400/10", slug: "shopping" },
  { name: "Utilities", label: "বিদ্যুৎ, ইন্টারনেট", icon: <Zap size={14} />, color: "text-yellow-400", bg: "bg-yellow-400/10", slug: "utilities" },
  { name: "Healthcare", label: "ডাক্তার, ঔষধ", icon: <Stethoscope size={14} />, color: "text-red-400", bg: "bg-red-400/10", slug: "healthcare" },
  { name: "Education", label: "বই, কোর্স", icon: <GraduationCap size={14} />, color: "text-emerald-400", bg: "bg-emerald-400/10", slug: "education" },
  { name: "Rent", label: "বাসা ভাড়া", icon: <HomeIcon size={14} />, color: "text-indigo-400", bg: "bg-indigo-400/10", slug: "rent" },
  { name: "Salary", label: "বেতন", icon: <Wallet size={14} />, color: "text-green-400", bg: "bg-green-400/10", slug: "salary" },
  { name: "Investment", label: "শেয়ার, সঞ্চয়", icon: <TrendingUp size={14} />, color: "text-cyan-400", bg: "bg-cyan-400/10", slug: "investment" },
  { name: "Insurance", label: "বীমা", icon: <ShieldCheck size={14} />, color: "text-blue-500", bg: "bg-blue-500/10", slug: "insurance" },
  { name: "Gifts", label: "উপহার", icon: <Gift size={14} />, color: "text-rose-400", bg: "bg-rose-400/10", slug: "gifts" },
  { name: "Travel", label: "ভ্রমণ", icon: <Globe size={14} />, color: "text-amber-400", bg: "bg-amber-400/10", slug: "travel" },
  { name: "Other", label: "অন্যান্য", icon: <Layers size={14} />, color: "text-slate-400", bg: "bg-slate-400/10", slug: "other" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileCats, setShowMobileCats] = useState(false);
  
  useEffect(() => {
    gsap.fromTo(".nav-anim", { y: -20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: "power4.out" });
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  return (
    <div className="fixed top-0 w-full flex justify-center z-[100] px-4 pointer-events-none">
      <nav className="w-full h-20 flex items-center justify-between px-6 md:px-8 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 pointer-events-auto max-w-7xl mx-auto rounded-b-2xl shadow-2xl">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 nav-anim shrink-0">
          <div className="bg-emerald-500 p-2 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <BrainCircuit className="w-5 h-5 text-black" />
          </div>
          <span className="text-lg font-black tracking-widest text-white italic uppercase hidden sm:block">
            FIN<span className="text-emerald-500">NEXUS</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-full backdrop-blur-md">
          <Link href="/" className="nav-anim px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 rounded-full transition-all">Home</Link>
          <Link href="/about" className="nav-anim px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">About</Link>
          
          {/* Transactions Button - NEW */}
          <Link href="/transactions" className="nav-anim px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-1.5 transition-all">
            <Receipt size={12} /> Transactions
          </Link>
          
          {/* Goals Button - NEW */}
          <Link href="/goals" className="nav-anim px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-1.5 transition-all">
            <Target size={12} /> Goals
          </Link>
          
          <Link href="/ai-chat" className="nav-anim px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 bg-emerald-500/5 rounded-full border border-emerald-500/10 hover:bg-emerald-500/10 transition-all ml-1">
            <Sparkles size={12} className="animate-pulse" /> AI Chat
          </Link>

          <div className="relative group nav-anim">
            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white flex items-center gap-1">
              Categories <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-full -left-32 mt-4 w-[550px] bg-slate-950 border border-white/10 rounded-[32px] p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-2xl backdrop-blur-2xl grid grid-cols-2 gap-3">
               {transactionCategories.map((cat) => (
                 <Link key={cat.slug} href={`/transactions/category/${cat.slug}`} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all group/item">
                    <div className={`p-2.5 rounded-xl ${cat.bg} ${cat.color} group-hover/item:scale-110 transition-transform`}>{cat.icon}</div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-tighter">{cat.name}</p>
                      <p className="text-[9px] text-slate-500 font-medium">{cat.label}</p>
                    </div>
                 </Link>
               ))}
            </div>
          </div>

          <Link href="/contact" className="nav-anim px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Contact</Link>
          <Link href="/pricing" className="nav-anim px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Pricing</Link>
        </div>

        {/* ACTION GROUP (Desktop & Mobile Base) */}
        <div className="flex items-center gap-3 nav-anim shrink-0">
          {/* Notification */}
          <button className="p-2.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 relative transition-all active:scale-95">
            <Bell size={18} />
            <Circle className="absolute top-2.5 right-2.5 w-2 h-2 fill-emerald-500 text-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" />
          </button>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
             <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-white/5 font-black px-4 rounded-full h-10 text-[10px] uppercase tracking-widest">Login</Button>
             </Link>
             <Link href="/register">
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-6 rounded-full h-10 text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20">Register</Button>
             </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsOpen(true)} className="lg:hidden p-2.5 text-white bg-slate-900 rounded-xl border border-white/10 transition-all active:scale-90">
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* --- MOBILE OVERLAY --- */}
      <div className={`fixed inset-0 bg-[#020617] z-[500] lg:hidden flex flex-col transition-all duration-500 ease-in-out pointer-events-auto ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 h-20 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-500" />
            <span className="text-white font-black italic text-sm tracking-widest uppercase">FINNEXUS</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 bg-white/5 rounded-xl text-white"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-4">
          {/* Mobile Auth */}
          <div className="flex gap-2 mb-6">
             <Link href="/login" onClick={() => setIsOpen(false)} className="flex-1">
                <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 text-white font-black rounded-2xl uppercase tracking-widest text-[10px]">Login</Button>
             </Link>
             <Link href="/register" onClick={() => setIsOpen(false)} className="flex-1">
                <Button className="w-full h-12 bg-emerald-500 text-black font-black rounded-2xl uppercase tracking-widest text-[10px] border-none">Register</Button>
             </Link>
          </div>

          <Link href="/ai-chat" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-[28px] mb-4 active:scale-95 transition-transform">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20"><Sparkles size={20} className="text-black" /></div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-black text-emerald-500 uppercase tracking-tighter">AI Assistant</span>
                <span className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-widest">Quantum Chat Mode</span>
              </div>
            </div>
          </Link>

          {/* Links with Icons */}
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 text-2xl font-black text-white uppercase tracking-tighter active:bg-white/5 rounded-2xl"><HomeIcon size={20} className="text-slate-500" /> Home</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 text-2xl font-black text-white uppercase tracking-tighter active:bg-white/5 rounded-2xl"><Info size={20} className="text-slate-500" /> About</Link>
          
          {/* Transactions - Mobile NEW */}
          <Link href="/transactions" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 text-2xl font-black text-white uppercase tracking-tighter active:bg-white/5 rounded-2xl">
            <Receipt size={20} className="text-slate-500" /> Transactions
          </Link>
          
          {/* Goals - Mobile NEW */}
          <Link href="/goals" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 text-2xl font-black text-white uppercase tracking-tighter active:bg-white/5 rounded-2xl">
            <Target size={20} className="text-slate-500" /> Goals
          </Link>
          
          {/* Categories Accordion */}
          <div className="rounded-2xl overflow-hidden">
            <button onClick={() => setShowMobileCats(!showMobileCats)} className={`w-full flex items-center justify-between p-4 text-2xl font-black uppercase tracking-tighter transition-colors ${showMobileCats ? "text-emerald-500 bg-white/5" : "text-white"}`}>
              <div className="flex items-center gap-4"><Layers size={20} className={showMobileCats ? "text-emerald-500" : "text-slate-500"} /> Categories</div>
              <ChevronDown size={24} className={`transition-transform duration-300 ${showMobileCats ? "rotate-180" : "text-slate-700"}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${showMobileCats ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="overflow-hidden space-y-2">
                {transactionCategories.map((cat) => (
                  <Link key={cat.slug} href={`/transactions/category/${cat.slug}`} onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 mx-2 active:bg-white/10 transition-colors">
                    <div className={`p-2.5 rounded-xl ${cat.bg} ${cat.color}`}>{cat.icon}</div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-black text-white uppercase tracking-widest">{cat.name}</span>
                      <span className="text-[10px] text-slate-500 font-bold">{cat.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/contact" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 text-2xl font-black text-white uppercase tracking-tighter active:bg-white/5 rounded-2xl"><Headphones size={20} className="text-slate-500" /> Contact</Link>
          <Link href="/pricing" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 text-2xl font-black text-white uppercase tracking-tighter active:bg-white/5 rounded-2xl"><CreditCard size={20} className="text-slate-500" /> Pricing</Link>
        </div>

        {/* Mobile Static CTA */}
        <div className="p-6 border-t border-white/5 bg-white/[0.02] shrink-0">
          <Button asChild className="w-full h-14 bg-emerald-500 text-black font-black rounded-2xl uppercase tracking-widest text-xs border-none shadow-xl shadow-emerald-500/10">
            <Link href="/register" onClick={() => setIsOpen(false)}>Start Saving Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
