
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Target, Plus, Trash2, TrendingUp, TrendingDown, 
  Calendar, Clock, Award, Crown, Trophy, Sparkles,
  Wallet, ArrowUp, ArrowDown, CheckCircle, Loader2,
  X, Rocket, Gift, Heart, Car, Home, Plane,
  GraduationCap, Briefcase, ShoppingBag
} from 'lucide-react';

import { formatCurrency, formatDate } from '@/lib/utils';
import goalService, { Goal } from '@/app/services/goal.service';


const getRandomIcon = () => {
  const icons = [Car, Home, Plane, GraduationCap, Briefcase, Gift, Heart, ShoppingBag, Rocket, Award];
  return icons[Math.floor(Math.random() * icons.length)];
};

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    activeGoals: 0,
    totalSaved: 0,
    totalTarget: 0,
    overallProgress: 0
  });
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

  // Load goals using goalService
  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await goalService.getAll();
      
      if (response.success) {
        const goalsData = response.data || [];
        setGoals(goalsData);
        
        // Calculate stats
        const total = goalsData.length;
        const completed = goalsData.filter((g: Goal) => g.isCompleted).length;
        const active = total - completed;
        const totalSaved = goalsData.reduce((sum: number, g: Goal) => sum + (g.currentAmount || 0), 0);
        const totalTarget = goalsData.reduce((sum: number, g: Goal) => sum + g.targetAmount, 0);
        const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
        
        setStats({
          totalGoals: total,
          completedGoals: completed,
          activeGoals: active,
          totalSaved,
          totalTarget,
          overallProgress
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  // Add money using goalService
  const handleAddMoney = async (id: string, amount: number) => {
    try {
      await goalService.addAmount(id, amount);
      toast.success(`Added ${formatCurrency(amount)} to goal`);
      loadGoals();
    } catch (error) {
      toast.error("Failed to add money");
    }
  };

  // Remove money using goalService
  const handleRemoveMoney = async (id: string, amount: number) => {
    try {
      await goalService.removeAmount(id, amount);
      toast.success(`Removed ${formatCurrency(amount)} from goal`);
      loadGoals();
    } catch (error) {
      toast.error("Failed to remove money");
    }
  };

  // Complete goal using goalService
  const handleCompleteGoal = async (id: string) => {
    if (!confirm("Mark this goal as completed?")) return;
    try {
      await goalService.complete(id);
      toast.success("Goal completed! 🎉");
      loadGoals();
    } catch (error) {
      toast.error("Failed to complete goal");
    }
  };

  // Delete goal using goalService
  const handleDeleteGoal = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    try {
      await goalService.delete(id);
      toast.success("Goal deleted");
      loadGoals();
    } catch (error) {
      toast.error("Failed to delete goal");
    }
  };

  // Create goal using goalService
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
      toast.success("Goal created successfully!");
      setShowAddModal(false);
      setFormData({ name: "", targetAmount: "", deadline: "", note: "" });
      loadGoals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create goal");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle amount action
  const handleAmountAction = async () => {
    if (!showAmountModal || !amountInput) return;
    const amount = parseFloat(amountInput);
    if (showAmountModal.action === 'add') {
      await handleAddMoney(showAmountModal.id, amount);
    } else {
      await handleRemoveMoney(showAmountModal.id, amount);
    }
    setShowAmountModal(null);
    setAmountInput("");
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const filteredGoals = goals.filter(goal => {
    if (selectedFilter === "active") return !goal.isCompleted;
    if (selectedFilter === "completed") return goal.isCompleted;
    return true;
  });

  const statCards = [
    { label: "Total Goals", value: stats.totalGoals, icon: Target, color: "blue" },
    { label: "Completed", value: stats.completedGoals, icon: Trophy, color: "emerald" },
    { label: "Active", value: stats.activeGoals, icon: TrendingUp, color: "purple" },
    { label: "Saved", value: formatCurrency(stats.totalSaved), icon: Wallet, color: "orange" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl">
                <Target className="w-6 h-6 text-emerald-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Savings Goals</h1>
            </div>
            <p className="text-slate-400 text-sm ml-10">Track and achieve your financial dreams</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold hover:opacity-90 transition shadow-lg shadow-emerald-500/30"
          >
            <Plus className="w-4 h-4" />
            Create New Goal
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center mb-2`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Overall Progress */}
        {stats.totalGoals > 0 && (
          <div className="mb-8 p-5 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-semibold">Overall Progress</span>
              <span className="text-emerald-400 font-bold">{stats.overallProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.overallProgress}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
              />
            </div>
            <div className="flex flex-wrap justify-between gap-3 mt-3 text-sm text-slate-400">
              <span>Saved: {formatCurrency(stats.totalSaved)}</span>
              <span>Target: {formatCurrency(stats.totalTarget)}</span>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "all", label: "All Goals", icon: Target },
            { key: "active", label: "Active", icon: TrendingUp },
            { key: "completed", label: "Completed", icon: Trophy },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                selectedFilter === filter.key
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <filter.icon className="w-4 h-4" />
              {filter.label}
            </button>
          ))}
        </div>

        {/* Goals Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-emerald-500/20 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <Target className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400">No goals found</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 bg-emerald-500 rounded-lg text-white text-sm hover:bg-emerald-600 transition"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5 hover:bg-white/10 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCompleted ? 'bg-emerald-500/20' : 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20'}`}>
                        {isCompleted ? <Crown className="w-5 h-5 text-emerald-400" /> : <Icon className="w-5 h-5 text-emerald-400" />}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-base">{goal.name}</h3>
                        <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {formatDate(goal.deadline)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      {!isCompleted && (
                        <>
                          <button 
                            onClick={() => setShowAmountModal({ id: goal.id, action: 'add' })}
                            className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition"
                            title="Add Money"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => setShowAmountModal({ id: goal.id, action: 'remove' })}
                            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                            title="Withdraw"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleCompleteGoal(goal.id)}
                            className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition"
                            title="Mark Complete"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white font-semibold">{goal.progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
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
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-yellow-400" />
                          <span className="text-yellow-400 text-xs font-medium">Time Left</span>
                        </div>
                        <span className="text-yellow-400 text-sm font-bold">{goal.daysRemaining} days</span>
                      </div>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="mt-3 p-2 bg-emerald-500/20 rounded-lg text-center border border-emerald-500/30">
                      <div className="flex items-center justify-center gap-2">
                        <Trophy className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 text-sm font-semibold">Goal Achieved! 🎉</span>
                      </div>
                    </div>
                  )}
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
                className="bg-slate-900/95 backdrop-blur-xl rounded-2xl w-full max-w-md p-6 border border-white/20 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl">
                      <Target className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Create New Goal</h2>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleCreateGoal} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Goal Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="e.g., New Car, Vacation"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Target Amount</label>
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
                        className="w-full pl-8 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Deadline</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        required
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Note (Optional)</label>
                    <textarea
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      rows={2}
                      placeholder="Add a note..."
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
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
                className="bg-slate-900/95 backdrop-blur-xl rounded-2xl w-full max-w-md p-6 border border-white/20 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${showAmountModal.action === 'add' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                      {showAmountModal.action === 'add' ? (
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      {showAmountModal.action === 'add' ? 'Add Money' : 'Withdraw Money'}
                    </h2>
                  </div>
                  <button onClick={() => setShowAmountModal(null)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Amount (BDT)</label>
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
                        className="w-full pl-8 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleAmountAction}
                    disabled={!amountInput}
                    className={`w-full py-2.5 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2 ${
                      showAmountModal.action === 'add'
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                        : 'bg-gradient-to-r from-red-500 to-rose-500'
                    } hover:opacity-90 disabled:opacity-50`}
                  >
                    {showAmountModal.action === 'add' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    {showAmountModal.action === 'add' ? 'Add Money' : 'Withdraw Money'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GoalsPage;
