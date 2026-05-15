
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  CreditCard, Plus, Trash2, Calendar, Clock, 
  DollarSign, Repeat, AlertCircle, CheckCircle,
  Loader2, X, Edit, Eye, TrendingUp, Wallet,
  Bell, Shield, Award, Crown, Sparkles, Zap,
  ShoppingBag, Coffee, Film, Music, Smartphone
} from 'lucide-react';

import { formatCurrency, formatDate } from '@/lib/utils';
import subscriptionService from '@/app/services/subscription.service';

interface Subscription {
  id: string;
  name: string;
  price: number;
  amount: number;
  currency: string;
  billingCycle: string;
  startDate: string;
  nextBilling: string;
  nextBillingDate: string;
  category: string;
  isActive: boolean;
  cancelAt?: string;
  createdAt: string;
}

const getSubscriptionIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('netflix')) return Film;
  if (lowerName.includes('spotify')) return Music;
  if (lowerName.includes('apple')) return Smartphone;
  if (lowerName.includes('amazon')) return ShoppingBag;
  if (lowerName.includes('coffee')) return Coffee;
  return CreditCard;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    ENTERTAINMENT: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    MUSIC: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    SHOPPING: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    FOOD: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    UTILITIES: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    DEFAULT: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
  };
  return colors[category] || colors.DEFAULT;
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    billingCycle: 'monthly',
    category: 'ENTERTAINMENT',
    nextBillingDate: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    totalMonthly: 0,
    totalYearly: 0,
    activeCount: 0,
    upcomingBills: 0
  });

  // Load subscriptions using subscriptionService
  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.getAll();
      
      if (response.success) {
        const subsData = response.data || [];
        setSubscriptions(subsData);
        
        // Calculate stats
        const active = subsData.filter((s: Subscription) => s.isActive).length;
        const monthlyTotal = subsData
          .filter((s: Subscription) => s.isActive)
          .reduce((sum: number, s: Subscription) => {
            let amount = s.price || s.amount || 0;
            if (s.billingCycle === 'yearly') amount = amount / 12;
            if (s.billingCycle === 'weekly') amount = amount * 4;
            return sum + amount;
          }, 0);
        
        const yearlyTotal = monthlyTotal * 12;
        const upcoming = subsData.filter((s: Subscription) => {
          const nextBilling = new Date(s.nextBilling || s.nextBillingDate);
          const now = new Date();
          const diffDays = Math.ceil((nextBilling.getTime() - now.getTime()) / (1000 * 3600 * 24));
          return diffDays <= 7 && diffDays >= 0 && s.isActive;
        }).length;
        
        setStats({
          totalMonthly: monthlyTotal,
          totalYearly: yearlyTotal,
          activeCount: active,
          upcomingBills: upcoming
        });
      }
    } catch (error) {
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  // Load summary stats
  const loadSummary = async () => {
    try {
      const response = await subscriptionService.getSummary();
      if (response.success) {
        const summaryData = response.data;
        setStats({
          totalMonthly: summaryData.monthlyTotal || 0,
          totalYearly: summaryData.yearlyTotal || 0,
          activeCount: summaryData.totalActive || 0,
          upcomingBills: summaryData.upcomingRenewals?.length || 0
        });
      }
    } catch (error) {
      console.error("Failed to load summary");
    }
  };

  // Create subscription using subscriptionService
  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await subscriptionService.create({
        name: formData.name,
        price: parseFloat(formData.price),
        billingCycle: formData.billingCycle as 'monthly' | 'yearly',
        nextBillingDate: formData.nextBillingDate,
        category: formData.category
      });
      if (response.success) {
        toast.success("Subscription added successfully");
        setShowAddModal(false);
        setFormData({
          name: '',
          price: '',
          billingCycle: 'monthly',
          category: 'ENTERTAINMENT',
          nextBillingDate: new Date().toISOString().split('T')[0]
        });
        loadSubscriptions();
        loadSummary();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add subscription");
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel subscription using subscriptionService
  const handleCancelSubscription = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this subscription?")) return;
    try {
      const response = await subscriptionService.cancel(id);
      if (response.success) {
        toast.success("Subscription cancelled");
        loadSubscriptions();
        loadSummary();
      }
    } catch (error) {
      toast.error("Failed to cancel subscription");
    }
  };

  // Reactivate subscription
  const handleReactivateSubscription = async (id: string) => {
    try {
      const response = await subscriptionService.reactivate(id);
      if (response.success) {
        toast.success("Subscription reactivated");
        loadSubscriptions();
        loadSummary();
      }
    } catch (error) {
      toast.error("Failed to reactivate subscription");
    }
  };

  // Delete subscription using subscriptionService
  const handleDeleteSubscription = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;
    try {
      const response = await subscriptionService.delete(id);
      if (response.success) {
        toast.success("Subscription deleted");
        loadSubscriptions();
        loadSummary();
      }
    } catch (error) {
      toast.error("Failed to delete subscription");
    }
  };

  useEffect(() => {
    loadSubscriptions();
    loadSummary();
  }, []);

  const statCards = [
    { label: "Monthly Total", value: formatCurrency(stats.totalMonthly), icon: Wallet, color: "emerald" },
    { label: "Yearly Total", value: formatCurrency(stats.totalYearly), icon: TrendingUp, color: "blue" },
    { label: "Active Subs", value: stats.activeCount, icon: CheckCircle, color: "purple" },
    { label: "Upcoming Bills", value: stats.upcomingBills, icon: Bell, color: "orange" },
  ];

  const billingCycles = [
    { value: 'monthly', label: 'Monthly', icon: Calendar },
    { value: 'yearly', label: 'Yearly', icon: Calendar },
    { value: 'weekly', label: 'Weekly', icon: Calendar },
  ];

  const categories = [
    { value: 'ENTERTAINMENT', label: 'Entertainment', icon: Sparkles },
    { value: 'MUSIC', label: 'Music', icon: Zap },
    { value: 'SHOPPING', label: 'Shopping', icon: ShoppingBag },
    { value: 'FOOD', label: 'Food', icon: Coffee },
    { value: 'UTILITIES', label: 'Utilities', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl">
                <CreditCard className="w-6 h-6 text-emerald-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Subscriptions</h1>
            </div>
            <p className="text-slate-400 text-sm ml-10">Manage all your recurring payments</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold hover:opacity-90 transition shadow-lg shadow-emerald-500/30"
          >
            <Plus className="w-4 h-4" />
            Add Subscription
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

        {/* Subscriptions List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-emerald-500/20 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <CreditCard className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400">No subscriptions found</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 bg-emerald-500 rounded-lg text-white text-sm hover:bg-emerald-600 transition"
            >
              Add Your First Subscription
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((sub, idx) => {
              const Icon = getSubscriptionIcon(sub.name);
              const colorClass = getCategoryColor(sub.category);
              const nextBillingDate = new Date(sub.nextBilling || sub.nextBillingDate);
              const now = new Date();
              const daysLeft = Math.ceil((nextBillingDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
              const isExpiringSoon = daysLeft <= 7 && daysLeft >= 0 && sub.isActive;
              
              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5 hover:bg-white/10 transition-all"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-base">{sub.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${colorClass}`}>
                          {sub.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      {sub.isActive && (
                        <>
                          <button 
                            onClick={() => handleCancelSubscription(sub.id)}
                            className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleReactivateSubscription(sub.id)}
                            className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition"
                            title="Reactivate"
                          >
                            <Repeat className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDeleteSubscription(sub.id)}
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(sub.price || sub.amount || 0)}
                      <span className="text-sm text-slate-400 font-normal ml-1">/{sub.billingCycle}</span>
                    </p>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Billing Cycle</span>
                      <span className="text-white capitalize">{sub.billingCycle}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Started</span>
                      <span className="text-white">{formatDate(sub.startDate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Next Billing</span>
                      <span className="text-white">{formatDate(sub.nextBilling || sub.nextBillingDate)}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    {sub.isActive ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-emerald-400 text-xs font-medium">Active</span>
                        </div>
                        {isExpiringSoon && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-yellow-400" />
                            <span className="text-yellow-400 text-xs">{daysLeft} days left</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-red-400 text-xs font-medium">Cancelled</span>
                        {sub.cancelAt && (
                          <span className="text-slate-500 text-xs">on {formatDate(sub.cancelAt)}</span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Add Subscription Modal */}
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
                      <CreditCard className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Add Subscription</h2>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleCreateSubscription} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Service Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="e.g., Netflix, Spotify"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">৳</span>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        min="1"
                        step="10"
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Billing Cycle</label>
                    <div className="flex gap-2">
                      {billingCycles.map((cycle) => (
                        <button
                          key={cycle.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, billingCycle: cycle.value })}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition ${
                            formData.billingCycle === cycle.value
                              ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                              : "bg-white/10 text-slate-400 hover:bg-white/20"
                          }`}
                        >
                          <cycle.icon className="w-4 h-4" />
                          {cycle.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Next Billing Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={formData.nextBillingDate}
                        onChange={(e) => setFormData({ ...formData, nextBillingDate: e.target.value })}
                        required
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Add Subscription
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
