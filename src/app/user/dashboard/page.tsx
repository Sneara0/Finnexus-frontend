
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Wallet, TrendingUp, TrendingDown, Target, 
  PiggyBank, ArrowUpRight, Calendar, Clock
} from "lucide-react";

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const stats = [
    { icon: Wallet, label: 'Total Balance', value: '₿ 12,450', change: '+5.2%', color: 'blue' },
    { icon: TrendingUp, label: 'Monthly Income', value: '₿ 5,200', change: '+8%', color: 'green' },
    { icon: TrendingDown, label: 'Monthly Expense', value: '₿ 3,800', change: '-2%', color: 'red' },
    { icon: PiggyBank, label: 'Savings', value: '₿ 1,400', change: '+15%', color: 'purple' },
  ];

  const recentTransactions = [
    { id: 1, name: 'Starbucks Coffee', amount: -12.50, date: 'Today', category: 'Food' },
    { id: 2, name: 'Salary Deposit', amount: 5200, date: 'Yesterday', category: 'Income' },
    { id: 3, name: 'Netflix Subscription', amount: -15.99, date: '2 days ago', category: 'Entertainment' },
    { id: 4, name: 'Grocery Shopping', amount: -85.30, date: '3 days ago', category: 'Shopping' },
  ];

  const goals = [
    { name: 'Emergency Fund', current: 8500, target: 10000, progress: 85 },
    { name: 'New Laptop', current: 1200, target: 2000, progress: 60 },
    { name: 'Vacation Trip', current: 3500, target: 5000, progress: 70 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name || 'User'}!</h1>
        <p className="text-slate-400 mt-1">Here's your financial overview for this month.</p>
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
              <span className={`flex items-center gap-1 text-sm font-semibold ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.change} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mt-4">{stat.value}</h3>
            <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Transactions & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
            <button className="text-blue-400 text-sm hover:text-blue-300 transition">View All</button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.amount > 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                    {tx.amount > 0 ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{tx.name}</p>
                    <p className="text-slate-400 text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {tx.date}
                    </p>
                  </div>
                </div>
                <span className={`font-semibold ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Goals Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Savings Goals</h2>
            <Target className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-5">
            {goals.map((goal, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white font-medium">{goal.name}</span>
                  <span className="text-slate-400">{goal.current} / {goal.target}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 mt-1">{goal.progress}% completed</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-2 rounded-xl bg-blue-600/20 text-blue-400 font-semibold text-sm hover:bg-blue-600/30 transition">
            + Add New Goal
          </button>
        </motion.div>
      </div>

      {/* AI Insight Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">🤖 AI Insight</h3>
            <p className="text-slate-300 mt-2 max-w-lg">
              Based on your spending pattern, you could save an additional ₿200 this month 
              by reducing dining out expenses. Your food budget is currently 15% above average.
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 rounded-lg text-white text-sm font-medium hover:bg-blue-700 transition">
              View Detailed Analysis
            </button>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
