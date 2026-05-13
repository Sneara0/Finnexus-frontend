
"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Users, TrendingUp, TrendingDown, DollarSign, 
  Activity, Shield, Zap, ArrowUpRight
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { icon: Users, label: 'Total Users', value: '1,234', change: '+12%', color: 'blue' },
    { icon: DollarSign, label: 'Total Transactions', value: '₿ 45.2K', change: '+8%', color: 'green' },
    { icon: TrendingUp, label: 'Active Budgets', value: '456', change: '+5%', color: 'purple' },
    { icon: Activity, label: 'AI Insights', value: '2,345', change: '+23%', color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl bg-${stat.color}-500/20`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
              <span className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
                {stat.change} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mt-4">{stat.value}</h3>
            <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Users</h2>
            <Shield className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">U{i}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">User {i}</p>
                    <p className="text-slate-400 text-xs">user{i}@example.com</p>
                  </div>
                </div>
                <span className="text-xs text-emerald-400">Active</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">System Health</h2>
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">API Status</span>
                <span className="text-emerald-400">Operational</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-[98%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Database</span>
                <span className="text-emerald-400">Connected</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-[95%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">AI Service</span>
                <span className="text-yellow-400">Degraded</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full w-[75%]"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
