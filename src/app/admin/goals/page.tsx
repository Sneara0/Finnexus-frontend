
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Target, Plus, Trash2, TrendingUp, TrendingDown, 
  Calendar, Clock, Award, Crown, Trophy, Sparkles,
  Wallet, ArrowUp, ArrowDown, CheckCircle, Loader2,
  X, Rocket, Gift, Heart, Car, Home, Plane,
  GraduationCap, Briefcase, ShoppingBag, Users,
  Edit, Eye, Filter, Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  note?: string;
  isCompleted: boolean;
  progress: number;
  remaining: number;
  daysRemaining: number;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

const getRandomIcon = () => {
  const icons = [Car, Home, Plane, GraduationCap, Briefcase, Gift, Heart, ShoppingBag, Rocket, Award];
  return icons[Math.floor(Math.random() * icons.length)];
};

export default function AdminGoalsPage() {
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
  const [showViewModal, setShowViewModal] = useState<Goal | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "completed">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load all goals (admin view)
  const loadGoals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login first");
        return;
      }
      
      const response = await api.get('/admin/goals', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm || undefined,
          status: selectedStatus !== "all" ? selectedStatus : undefined
        }
      });
      
      if (response.data.success) {
        const goalsData = response.data.data || [];
        setGoals(goalsData);
        setTotalPages(response.data.pagination?.totalPages || 1);
        
        // Calculate overall stats
        const allGoalsResponse = await api.get('/admin/goals/stats');
        if (allGoalsResponse.data.success) {
          const statsData = allGoalsResponse.data.data;
          setStats({
            totalGoals: statsData.totalGoals || 0,
            completedGoals: statsData.completedGoals || 0,
            activeGoals: statsData.activeGoals || 0,
            totalSaved: statsData.totalSaved || 0,
            totalTarget: statsData.totalTarget || 0,
            overallProgress: statsData.overallProgress || 0
          });
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  // Delete goal
  const handleDeleteGoal = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    try {
      const response = await api.delete(`/admin/goals/${id}`);
      if (response.data.success) {
        toast.success("Goal deleted successfully");
        loadGoals();
      }
    } catch (error) {
      toast.error("Failed to delete goal");
    }
  };

  useEffect(() => {
    loadGoals();
  }, [currentPage, searchTerm, selectedStatus]);

  const statCards = [
    { label: "Total Goals", value: stats.totalGoals, icon: Target, color: "blue" },
    { label: "Completed", value: stats.completedGoals, icon: Trophy, color: "emerald" },
    { label: "Active", value: stats.activeGoals, icon: TrendingUp, color: "purple" },
    { label: "Total Saved", value: formatCurrency(stats.totalSaved), icon: Wallet, color: "orange" },
  ];

  const filteredGoals = goals.filter(goal => {
    if (selectedStatus === "active") return !goal.isCompleted;
    if (selectedStatus === "completed") return goal.isCompleted;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl">
              <Target className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Goals Management</h1>
            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Admin</span>
          </div>
          <p className="text-slate-400 ml-10">Manage all user savings goals</p>
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
              <span className="text-white font-semibold">Overall Platform Progress</span>
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
              <span>Total Saved: {formatCurrency(stats.totalSaved)}</span>
              <span>Total Target: {formatCurrency(stats.totalTarget)}</span>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by goal name or user email..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedStatus("all");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedStatus === "all"
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setSelectedStatus("active");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedStatus === "active"
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => {
                setSelectedStatus("completed");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedStatus === "completed"
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Goals Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-emerald-500/20 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <Target className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400">No goals found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">User</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Goal</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Target</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Saved</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Progress</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Deadline</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Status</th>
                  <th className="text-center py-3 px-4 text-slate-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {goals.map((goal, idx) => {
                  const Icon = getRandomIcon();
                  const isCompleted = goal.isCompleted;
                  
                  return (
                    <motion.tr
                      key={goal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white font-medium text-sm">{goal.user?.name || 'Unknown'}</p>
                          <p className="text-slate-500 text-xs">{goal.user?.email || 'No email'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-emerald-400" />
                          </div>
                          <span className="text-white text-sm">{goal.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white font-medium">{formatCurrency(goal.targetAmount)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-400 font-medium">{formatCurrency(goal.currentAmount)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-24">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">{goal.progress.toFixed(0)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span className="text-slate-300 text-sm">{formatDate(goal.deadline)}</span>
                        </div>
                        {goal.daysRemaining > 0 && !isCompleted && (
                          <p className="text-yellow-400 text-xs mt-1">{goal.daysRemaining} days left</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isCompleted ? (
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">Completed</span>
                        ) : (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Active</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setShowViewModal(goal)}
                            className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/5 rounded-lg text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg transition ${
                      currentPage === pageNum
                        ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/5 rounded-lg text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition"
            >
              Next
            </button>
          </div>
        )}

        {/* View Goal Modal */}
        <AnimatePresence>
          {showViewModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
              onClick={() => setShowViewModal(null)}
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
                    <h2 className="text-xl font-bold text-white">Goal Details</h2>
                  </div>
                  <button onClick={() => setShowViewModal(null)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-slate-400 text-xs mb-1">User</p>
                    <p className="text-white font-medium">{showViewModal.user?.name || 'Unknown'}</p>
                    <p className="text-slate-500 text-sm">{showViewModal.user?.email}</p>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-slate-400 text-xs mb-1">Goal Name</p>
                    <p className="text-white font-medium">{showViewModal.name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Target Amount</p>
                      <p className="text-emerald-400 font-bold">{formatCurrency(showViewModal.targetAmount)}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Saved Amount</p>
                      <p className="text-blue-400 font-bold">{formatCurrency(showViewModal.currentAmount)}</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-slate-400 text-xs mb-1">Progress</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                          style={{ width: `${showViewModal.progress}%` }}
                        />
                      </div>
                      <span className="text-white text-sm">{showViewModal.progress.toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Deadline</p>
                      <p className="text-white">{formatDate(showViewModal.deadline)}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Time Left</p>
                      <p className="text-yellow-400">{showViewModal.daysRemaining} days</p>
                    </div>
                  </div>
                  
                  {showViewModal.note && (
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Note</p>
                      <p className="text-slate-300 text-sm">{showViewModal.note}</p>
                    </div>
                  )}
                  
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-slate-400 text-xs mb-1">Status</p>
                    {showViewModal.isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                        <CheckCircle className="w-3 h-3" /> Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                        <TrendingUp className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}