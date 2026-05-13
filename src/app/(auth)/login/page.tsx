
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, Loader2, Lock, Mail, Sparkles, ShieldAlert, User, 
  AlertCircle, Eye, EyeOff, Zap, TrendingUp, Wallet, LineChart,
  Award, ArrowRight
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("সঠিক ইমেইল ঠিকানা দিন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
});

type LoginValues = z.infer<typeof loginSchema>;

// API কল ফাংশন
const loginUser = async (data: LoginValues) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "লগইন ব্যর্থ হয়েছে");
  }
  
  return response.json();
};

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Entrance Animation
  useEffect(() => {
    if (!mounted) return;
    
    const animate = async () => {
      try {
        const { gsap } = await import('@/lib/gsap');
        
        if (titleRef.current) {
          gsap.fromTo(titleRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
          );
        }
        
        if (cardRef.current) {
          gsap.fromTo(cardRef.current,
            { scale: 0.95, opacity: 0, y: 30 },
            { scale: 1, opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "back.out(1)" }
          );
        }
      } catch (err) {
        console.log("GSAP not loaded");
      }
    };
    
    animate();
  }, [mounted]);

  const onSubmit = async (data: LoginValues) => {
    setServerError(null);
    try {
      const response = await loginUser(data);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // রোল অনুযায়ী রিডাইরেক্ট
      if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (user.role === 'MANAGER') {
        router.push('/manager/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    } catch (err: any) {
      setServerError(err.message || "ইমেইল বা পাসওয়ার্ড ভুল");
    }
  };

  const fillDemo = (role: 'admin' | 'user') => {
    const creds = {
      admin: { 
        e: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || "admin@finnexus.com", 
        p: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || "admin123" 
      },
      user: { 
        e: process.env.NEXT_PUBLIC_DEMO_USER_EMAIL || "user@finnexus.com", 
        p: process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD || "user123" 
      }
    };
    
    setValue("email", creds[role].e);
    setValue("password", creds[role].p);
  };

  const features = [
    { icon: TrendingUp, title: 'AI Insights', desc: 'স্মার্ট আর্থিক বিশ্লেষণ' },
    { icon: Wallet, title: 'Smart Budget', desc: 'বাজেট প্ল্যানিং' },
    { icon: LineChart, title: 'Analytics', desc: 'রিয়েল টাইম রিপোর্ট' },
    { icon: Award, title: 'Goals', desc: 'সেভিংস ট্র্যাকিং' },
  ];

  if (!mounted) return null;

  return (
    <div suppressHydrationWarning className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      
      <div suppressHydrationWarning className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-[50%] left-[40%] w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px] animate-pulse delay-500" />
      </div>

      <div suppressHydrationWarning className="relative z-10 w-full max-w-6xl mx-auto px-4 py-12">
        
        <div suppressHydrationWarning className="text-center mb-12" ref={titleRef}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 mb-6"
          >
            <BrainCircuit className="w-6 h-6 text-blue-400" />
            <span className="text-white font-semibold">FinNexus AI</span>
            <Zap className="w-4 h-4 text-yellow-400" />
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              FinNexus
            </span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            AI-Powered Personal Finance Management Platform
          </p>
        </div>

        <div suppressHydrationWarning className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
            >
              <feature.icon className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
              <p className="text-slate-400 text-xs">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-md mx-auto"
        >
          <div suppressHydrationWarning className="relative overflow-hidden bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl">
            
            <div suppressHydrationWarning className="relative z-10">
              <div className="space-y-3 text-center pt-8 pb-4">
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-xl"
                  >
                    <BrainCircuit className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
                <h2 className="text-2xl font-bold text-white">Sign In</h2>
                <p className="text-slate-300">Access your AI-powered finance dashboard</p>
              </div>
              
              <div suppressHydrationWarning className="px-8 space-y-6">
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="h-px flex-1 bg-white/20"></span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Quick Demo Access</p>
                    <span className="h-px flex-1 bg-white/20"></span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => fillDemo('admin')}
                      className="group relative overflow-hidden rounded-xl p-[1px] w-full"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl" />
                      <div className="relative bg-red-950/50 backdrop-blur-xl rounded-xl px-4 py-3 flex items-center justify-center gap-2 group-hover:bg-red-900/50 transition">
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                        <span className="text-white font-semibold text-sm">Admin Login</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => fillDemo('user')}
                      className="group relative overflow-hidden rounded-xl p-[1px] w-full"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl" />
                      <div className="relative bg-blue-950/50 backdrop-blur-xl rounded-xl px-4 py-3 flex items-center justify-center gap-2 group-hover:bg-blue-900/50 transition">
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-semibold text-sm">User Login</span>
                      </div>
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {serverError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-500/20 backdrop-blur-xl text-red-200 text-sm p-4 rounded-xl border border-red-500/30 flex items-center gap-3"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{serverError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 ml-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="you@example.com"
                        className="w-full h-12 pl-12 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 ml-1">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full h-12 pl-12 pr-12 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      {errors.password && (
                        <p className="text-red-400 text-xs mt-1 ml-1">{errors.password.message}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/30 disabled:opacity-70 transition-all relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                    <span className="bg-white/5 backdrop-blur-xl px-4">OR CONTINUE WITH</span>
                  </div>
                </div>

                <button className="w-full h-12 rounded-xl bg-white/5 border border-white/20 text-white font-semibold flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.25.81-.59z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
              </div>

              <div className="pb-8 pt-4 flex justify-center">
                <p className="text-sm text-slate-400">
                  Need an account?{' '}
                  <Link href="/register" className="text-blue-400 font-bold hover:text-blue-300 underline-offset-4 hover:underline transition">
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-12 text-slate-500 text-xs">
          <p>🔒 Secure Login • 🔐 End-to-End Encryption • 🤖 AI Powered</p>
        </div>
      </div>
    </div>
  );
}
