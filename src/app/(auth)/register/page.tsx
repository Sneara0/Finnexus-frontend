
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, Loader2, CheckCircle2, ShieldCheck,
  User, Mail, Lock, Eye, EyeOff, Sparkles, Zap, TrendingUp, 
  Wallet, LineChart, Award, Rocket
} from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
  email: z.string().email("সঠিক ইমেইল ঠিকানা দিন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "পাসওয়ার্ড মিলছে না",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

const registerUser = async (data: RegisterValues) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
  }
  
  return response.json();
};

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
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

  const onSubmit = (data: RegisterValues) => {
    mutate(data);
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
      
      {/* Animated Background */}
      <div suppressHydrationWarning className="absolute inset-0 overflow-hidden">
        <div suppressHydrationWarning className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
        <div suppressHydrationWarning className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div suppressHydrationWarning className="absolute top-[50%] left-[40%] w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px] animate-pulse delay-500" />
      </div>

      <div suppressHydrationWarning className="relative z-10 w-full max-w-6xl mx-auto px-4 py-12">
        
        {/* Hero Section */}
        <div suppressHydrationWarning className="text-center mb-8" ref={titleRef}>
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
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Create{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Account
            </span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Join the AI-powered personal finance revolution
          </p>
        </div>

        {/* Features Grid */}
        <div suppressHydrationWarning className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-3 text-center border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
            >
              <feature.icon className="w-6 h-6 text-blue-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold text-xs">{feature.title}</h3>
              <p className="text-slate-400 text-[10px]">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Register Card */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-md mx-auto"
        >
          <div suppressHydrationWarning className="relative overflow-hidden bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl">
            
            <div suppressHydrationWarning className="relative z-10">
              <div suppressHydrationWarning className="space-y-2 text-center pt-8 pb-4">
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-xl"
                  >
                    <Rocket className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
                <h2 className="text-2xl font-bold text-white">Get Started</h2>
                <p className="text-slate-300 text-sm">Start your financial journey today</p>
              </div>
              
              <div suppressHydrationWarning className="px-8 space-y-5">
                
                {/* Success State */}
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-emerald-500/20 backdrop-blur-xl text-emerald-200 text-center p-6 rounded-2xl border border-emerald-500/30"
                    >
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                      <h3 className="text-xl font-bold mb-2">Registration Successful!</h3>
                      <p className="text-sm mb-4">Redirecting to login page...</p>
                      <div className="w-full h-1 bg-emerald-500/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2 }}
                          className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isSuccess && (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    {/* Error Message */}
                    {error && (
                      <div suppressHydrationWarning className="bg-red-500/20 backdrop-blur-xl text-red-200 text-sm p-3 rounded-xl border border-red-500/30 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        {(error as any)?.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে"}
                      </div>
                    )}

                    {/* Name Field */}
                    <div suppressHydrationWarning className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 ml-1 flex items-center gap-2">
                        <User className="w-3 h-3" /> Full Name
                      </label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          {...register("name")}
                          type="text"
                          placeholder="John Doe"
                          className="w-full h-11 pl-11 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none text-sm"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div suppressHydrationWarning className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 ml-1 flex items-center gap-2">
                        <Mail className="w-3 h-3" /> Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="you@example.com"
                          className="w-full h-11 pl-11 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none text-sm"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div suppressHydrationWarning className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 ml-1 flex items-center gap-2">
                        <Lock className="w-3 h-3" /> Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          {...register("password")}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="w-full h-11 pl-11 pr-11 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.password.message}</p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div suppressHydrationWarning className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 ml-1 flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3" /> Confirm Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          {...register("confirmPassword")}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="w-full h-11 pl-11 pr-11 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.confirmPassword.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/30 disabled:opacity-70 transition-all relative overflow-hidden group mt-2"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                        {isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            Create Free Account <Sparkles className="w-3 h-3" />
                          </>
                        )}
                      </span>
                    </button>
                  </form>
                )}

                {/* Divider */}
                {!isSuccess && (
                  <>
                    <div suppressHydrationWarning className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                      </div>
                      <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <span className="bg-white/5 backdrop-blur-xl px-4">OR SIGN UP WITH</span>
                      </div>
                    </div>

                    {/* Social Login */}
                    <button className="w-full h-11 rounded-xl bg-white/5 border border-white/20 text-white font-medium flex items-center justify-center gap-3 hover:bg-white/10 transition-all text-sm">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.25.81-.59z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                      </svg>
                      Google
                    </button>
                  </>
                )}
              </div>

              {/* Footer */}
              <div suppressHydrationWarning className="pb-8 pt-5 flex flex-col items-center gap-3">
                <p className="text-sm text-slate-400">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-400 font-bold hover:text-blue-300 transition">
                    Sign In
                  </Link>
                </p>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-blue-400/60" />
                  256-bit AES Encryption
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Footer */}
        <div suppressHydrationWarning className="text-center mt-8 text-slate-500 text-[10px]">
          <p>🔒 Secure Registration • 🔐 End-to-End Encryption • 🤖 AI Powered</p>
        </div>
      </div>
    </div>
  );
}
