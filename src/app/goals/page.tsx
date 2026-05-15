
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Target, TrendingUp, TrendingDown, Wallet, Calendar, 
  Loader2, AlertCircle, CheckCircle, Trash2,
  Edit, Eye, ArrowUp, ArrowDown, X, Sparkles,
  Crown, Trophy, Star, Clock, Rocket, Zap,
  Award, Gift, Heart, Coffee, Car, Home,
  Briefcase, GraduationCap, Plane, ShoppingBag,
  Menu, LayoutGrid, List, Maximize2, Minimize2
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import goalService from "../services/goal.service";

const getRandomIcon = () => {
  const icons = [Car, Home, Plane, GraduationCap, Briefcase, Gift, Heart, ShoppingBag];
  return icons[Math.floor(Math.random() * icons.length)];
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [dashboard, setDashboard] = useState<GoalDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAmountModal, setShowAmountModal] = useState<{ id: string; action: 'add' | 'remove' } | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    note: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "active" | "completed">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      const response = await goalService.getAll();
      if (response.success) {
        setGoals(response.data);
      }
    } catch (err) {
      setError("Failed to fetch goals");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await goalService.getDashboard();
      if (response.success) {
        setDashboard(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard");
    }
  }, []);

  useEffect(() => {
    fetchGoals();
    fetchDashboard();
  }, [fetchGoals, fetchDashboard]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await goalService.create({
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        deadline: formData.deadline,
        note: formData.note
      });
      setShowAddModal(false);
      setFormData({ name: "", targetAmount: "", deadline: "", note: "" });
      fetchGoals();
      fetchDashboard();
    } catch (err) {
      setError("Failed to create goal");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAmountAction = async () => {
    if (!showAmountModal || !amountInput) return;
    setSubmitting(true);
    try {
      if (showAmountModal.action === 'add') {
        await goalService.addAmount(showAmountModal.id, parseFloat(amountInput));
      } else {
        await goalService.removeAmount(showAmountModal.id, parseFloat(amountInput));
      }
      setShowAmountModal(null);
      setAmountInput("");
      fetchGoals();
      fetchDashboard();
    } catch (err) {
      setError("Failed to update goal amount");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteGoal = async (id: string) => {
    if (confirm("Mark this goal as completed?")) {
      try {
        await goalService.complete(id);
        fetchGoals();
        fetchDashboard();
      } catch (err) {
        setError("Failed to complete goal");
      }
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      try {
        await goalService.delete(id);
        fetchGoals();
        fetchDashboard();
      } catch (err) {
        setError("Failed to delete goal");
      }
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (selectedFilter === "active") return !goal.isCompleted;
    if (selectedFilter === "completed") return goal.isCompleted;
    return true;
  });

  const stats = [
    { label: "Total Goals", value: dashboard?.stats.totalGoals || 0, icon: Target, color: "blue" },
    { label: "Completed", value: dashboard?.stats.completedGoals || 0, icon: Trophy, color: "emerald" },
    { label: "Active", value: dashboard?.stats.activeGoals || 0, icon: TrendingUp, color: "purple" },
    { label: "Saved", value: formatCurrency(dashboard?.stats.totalSaved || 0), icon: Wallet, color: "orange" },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* Header - Full Width */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg sm:rounded-xl">
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Savings Goals</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 ml-9 sm:ml-12">Track and achieve your financial dreams</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={toggleFullscreen}
              className="p-2.5 sm:p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold shadow-lg shadow-emerald-500/30 hover:opacity-90 transition text-sm sm:text-base"
            >
              <Sparkles className="w-4 h-4" />
              Create New Goal
            </button>
          </div>
        </div>

        {/* Stats Cards - Full Width Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-${stat.color}-500/20 flex items-center justify-center mb-2 sm:mb-3`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-400`} />
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 sm:mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Overall Progress Card - Full Width */}
        {dashboard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 lg:mb-8 p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl sm:rounded-2xl border border-white/10"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white">Overall Progress</h3>
                <p className="text-xs sm:text-sm text-slate-400">You're making great progress!</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-400">{dashboard.stats.overallProgress.toFixed(1)}%</span>
                <span className="text-xs sm:text-sm text-slate-400">complete</span>
              </div>
            </div>
            <div className="w-full h-2 sm:h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dashboard.stats.overallProgress}%` }}
                transition={{ duration: 1.5 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Wallet className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                <span className="text-slate-400">Saved:</span>
                <span className="text-white font-medium">{formatCurrency(dashboard.stats.totalSaved)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                <span className="text-slate-400">Target:</span>
                <span className="text-white font-medium">{formatCurrency(dashboard.stats.totalTarget)}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                <span className="text-slate-400">Remaining:</span>
                <span className="text-white font-medium">{formatCurrency(dashboard.stats.totalTarget - dashboard.stats.totalSaved)}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter and View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Goals", icon: Target },
              { key: "active", label: "Active", icon: TrendingUp },
              { key: "completed", label: "Completed", icon: Trophy },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key as any)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 ${
                  selectedFilter === filter.key
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <filter.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                {filter.label}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <div className="flex gap-1 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 sm:p-2 rounded-md transition ${viewMode === "grid" ? "bg-emerald-500 text-white" : "text-slate-400"}`}
              >
                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 sm:p-2 rounded-md transition ${viewMode === "list" ? "bg-emerald-500 text-white" : "text-slate-400"}`}
              >
                <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Goals Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center py-16 sm:py-20 lg:py-32">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-emerald-500/20 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-red-400 text-base sm:text-lg">{error}</p>
            <button onClick={fetchGoals} className="mt-4 px-4 py-2 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30 transition">
              Try Again
            </button>
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="text-center py-16 sm:py-20 lg:py-24 bg-white/5 rounded-xl sm:rounded-3xl border border-white/10">
            <Target className="w-16 h-16 sm:w-20 sm:h-20 text-slate-500 mx-auto mb-3 sm:mb-4 opacity-50" />
            <p className="text-slate-400 text-base sm:text-lg">No goals found</p>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Create your first savings goal to get started</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg sm:rounded-xl text-white text-sm sm:text-base font-medium hover:opacity-90 transition inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Goal
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {filteredGoals.map((goal, idx) => {
              const Icon = getRandomIcon();
              const isCompleted = goal.isCompleted;
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-5 lg:p-6 hover:bg-white/10 transition-all"
                >
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${isCompleted ? 'bg-emerald-500/20' : 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20'}`}>
                        {isCompleted ? <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" /> : <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg">{goal.name}</h3>
                        <p className="text-slate-500 text-[10px] sm:text-xs flex items-center gap-1 mt-0.5">
                          <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          {formatDate(goal.deadline)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!isCompleted && (
                        <>
                          <button onClick={() => setShowAmountModal({ id: goal.id, action: 'add' })} className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition">
                            <ArrowUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                          <button onClick={() => setShowAmountModal({ id: goal.id, action: 'remove' })} className="p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition">
                            <ArrowDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                          <button onClick={() => handleCompleteGoal(goal.id)} className="p-1 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition">
                            <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDeleteGoal(goal.id)} className="p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition">
                        <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white font-semibold">{goal.progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target</span>
                      <span className="text-white font-medium">{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Saved</span>
                      <span className="text-emerald-400 font-medium">{formatCurrency(goal.currentAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Remaining</span>
                      <span className="text-orange-400 font-medium">{formatCurrency(goal.remaining)}</span>
                    </div>
                  </div>

                  {goal.daysRemaining > 0 && !isCompleted && (
                    <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-yellow-400" />
                          <span className="text-yellow-400 text-[10px] sm:text-xs font-medium">Time Left</span>
                        </div>
                        <span className="text-yellow-400 text-xs sm:text-sm font-bold">{goal.daysRemaining} days</span>
                      </div>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="mt-3 sm:mt-4 p-2 sm:p-2.5 bg-emerald-500/20 rounded-lg text-center border border-emerald-500/30">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                        <span className="text-emerald-400 text-xs sm:text-sm font-semibold">Goal Achieved! 🎉</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredGoals.map((goal, idx) => {
              const Icon = getRandomIcon();
              const isCompleted = goal.isCompleted;
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCompleted ? 'bg-emerald-500/20' : 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20'}`}>
                        {isCompleted ? <Crown className="w-5 h-5 text-emerald-400" /> : <Icon className="w-5 h-5 text-emerald-400" />}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm sm:text-base">{goal.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                          <p className="text-slate-500 text-[10px] sm:text-xs flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" />
                            {formatDate(goal.deadline)}
                          </p>
                          <div className="w-20 sm:w-32">
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: `${goal.progress}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                      <div className="text-right">
                        <p className="text-white font-semibold text-sm sm:text-base">{formatCurrency(goal.currentAmount)}</p>
                        <p className="text-slate-500 text-[10px] sm:text-xs">of {formatCurrency(goal.targetAmount)}</p>
                      </div>
                      <div className="flex gap-1">
                        {!isCompleted && (
                          <>
                            <button onClick={() => setShowAmountModal({ id: goal.id, action: 'add' })} className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition">
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setShowAmountModal({ id: goal.id, action: 'remove' })} className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition">
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleCompleteGoal(goal.id)} className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition">
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <button onClick={() => handleDeleteGoal(goal.id)} className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Create Goal Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl w-full max-w-md p-4 sm:p-6 border border-white/20 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg sm:rounded-xl">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">Create New Goal</h2>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleCreateGoal} className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">Goal Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="e.g., New Car, Vacation"
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">Target Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">৳</span>
                      <input
                        type="number"
                        value={formData.targetAmount}
                        onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                        required
                        min="100"
                        step="100"
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-2 sm:py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">Deadline</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        required
                        className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">Note (Optional)</label>
                    <textarea
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      rows={2}
                      placeholder="Add a note..."
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg sm:rounded-xl text-white font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Create Goal
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Amount Modal */}
        <AnimatePresence>
          {showAmountModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
              onClick={() => setShowAmountModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl w-full max-w-md p-4 sm:p-6 border border-white/20 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${showAmountModal.action === 'add' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                      {showAmountModal.action === 'add' ? (
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                      )}
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      {showAmountModal.action === 'add' ? 'Add Money' : 'Withdraw Money'}
                    </h2>
                  </div>
                  <button onClick={() => setShowAmountModal(null)} className="text-slate-400 hover:text-white transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">Amount (BDT)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">৳</span>
                      <input
                        type="number"
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                        required
                        min="1"
                        step="100"
                        placeholder="0.00"
                        autoFocus
                        className="w-full pl-8 pr-4 py-2 sm:py-3 text-base sm:text-lg bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleAmountAction}
                    disabled={submitting || !amountInput}
                    className={`w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-white font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base ${
                      showAmountModal.action === 'add'
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                        : 'bg-gradient-to-r from-red-500 to-rose-500'
                    } hover:opacity-90 disabled:opacity-50`}
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {showAmountModal.action === 'add' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        {showAmountModal.action === 'add' ? 'Add Money' : 'Withdraw Money'}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
