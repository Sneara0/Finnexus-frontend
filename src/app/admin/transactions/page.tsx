
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  CreditCard, Search, Filter, ChevronDown, ChevronUp, 
  Calendar, TrendingUp, TrendingDown, Loader2, RefreshCw, 
  AlertCircle, Eye, Trash2, Download, ArrowUpDown,
  Wallet, Coffee, ShoppingBag, Car, Film, Home, 
  BookOpen, Heart, Smartphone, Gift, Music, Users,
  CheckCircle, XCircle, Clock, User, Sparkles, X
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  category: string;
  amount: number;
  description?: string;
  date: string;
  tags: string[];
  location?: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface TransactionStats {
  totalTransactions: number;
  totalIncome: number;
  totalExpense: number;
  profit: number;
  avgTransaction: number;
}

const categoryIcons: Record<string, any> = {
  FOOD: Coffee,
  SHOPPING: ShoppingBag,
  TRANSPORT: Car,
  ENTERTAINMENT: Film,
  UTILITIES: Home,
  HEALTHCARE: Heart,
  EDUCATION: BookOpen,
  SALARY: Wallet,
  INVESTMENT: TrendingUp,
  OTHER: Smartphone,
  GIFTS: Gift,
  MUSIC: Music,
};

const categoryColors: Record<string, string> = {
  FOOD: "bg-orange-500/20 text-orange-400",
  SHOPPING: "bg-pink-500/20 text-pink-400",
  TRANSPORT: "bg-blue-500/20 text-blue-400",
  ENTERTAINMENT: "bg-purple-500/20 text-purple-400",
  UTILITIES: "bg-cyan-500/20 text-cyan-400",
  HEALTHCARE: "bg-red-500/20 text-red-400",
  EDUCATION: "bg-yellow-500/20 text-yellow-400",
  SALARY: "bg-emerald-500/20 text-emerald-400",
  INVESTMENT: "bg-indigo-500/20 text-indigo-400",
  OTHER: "bg-slate-500/20 text-slate-400",
};

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(15);

  // Load transactions
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login first");
        return;
      }
      
      const response = await api.get('/admin/transactions', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm || undefined,
          type: selectedType !== "all" ? selectedType : undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          startDate: dateRange.start || undefined,
          endDate: dateRange.end || undefined,
          sortBy,
          sortOrder
        }
      });
      
      if (response.data.success) {
        setTransactions(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // Load stats
  const loadStats = async () => {
    try {
      const response = await api.get('/admin/transactions/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load stats");
    }
  };

  // Delete transaction
  const handleDeleteTransaction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      const response = await api.delete(`/admin/transactions/${id}`);
      if (response.data.success) {
        toast.success("Transaction deleted");
        loadTransactions();
        loadStats();
        if (selectedTransaction?.id === id) {
          setSelectedTransaction(null);
        }
      }
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };

  useEffect(() => {
    loadTransactions();
    loadStats();
  }, [currentPage, searchTerm, selectedType, selectedCategory, dateRange, sortBy, sortOrder]);

  const statCards = [
    { label: "Total Transactions", value: stats?.totalTransactions?.toLocaleString() || 0, icon: CreditCard, color: "blue" },
    { label: "Total Income", value: formatCurrency(stats?.totalIncome || 0), icon: TrendingUp, color: "emerald" },
    { label: "Total Expense", value: formatCurrency(stats?.totalExpense || 0), icon: TrendingDown, color: "red" },
    { label: "Net Profit", value: formatCurrency(stats?.profit || 0), icon: Wallet, color: "purple" },
  ];

  const categories = Array.from(new Set(transactions.map(t => t.category))).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl">
              <CreditCard className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Transaction Management</h1>
            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Admin</span>
          </div>
          <p className="text-slate-400 ml-10">Monitor and manage all user transactions</p>
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

        {/* Search and Filters */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by user email, description..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Types</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="End Date"
              />
              <button
                onClick={loadTransactions}
                className="p-2 bg-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/20 transition"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sorting */}
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={() => {
              setSortBy("date");
              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-white/10 text-slate-400 hover:text-white transition"
          >
            Date {sortBy === "date" && (sortOrder === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
          </button>
          <button
            onClick={() => {
              setSortBy("amount");
              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-white/10 text-slate-400 hover:text-white transition"
          >
            Amount {sortBy === "amount" && (sortOrder === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
          </button>
        </div>

        {/* Transactions Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-emerald-500/20 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <CreditCard className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-3 text-slate-400 text-sm font-medium">User</th>
                  <th className="text-left py-3 px-3 text-slate-400 text-sm font-medium">Description</th>
                  <th className="text-left py-3 px-3 text-slate-400 text-sm font-medium">Category</th>
                  <th className="text-right py-3 px-3 text-slate-400 text-sm font-medium">Amount</th>
                  <th className="text-left py-3 px-3 text-slate-400 text-sm font-medium">Date</th>
                  <th className="text-center py-3 px-3 text-slate-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, idx) => {
                  const Icon = categoryIcons[transaction.category] || Wallet;
                  const colorClass = categoryColors[transaction.category] || categoryColors.OTHER;
                  
                  return (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{transaction.user?.name || 'Unknown'}</p>
                            <p className="text-slate-500 text-xs">{transaction.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-white text-sm">{transaction.description || transaction.category}</p>
                        {transaction.tags?.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {transaction.tags.slice(0, 2).map((tag, i) => (
                              <span key={i} className="text-slate-500 text-xs">#{tag}</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-slate-300 text-sm">{transaction.category}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <p className={`text-sm font-bold ${transaction.type === "INCOME" ? "text-emerald-400" : "text-red-400"}`}>
                          {transaction.type === "INCOME" ? "+" : "-"}{formatCurrency(transaction.amount)}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span className="text-slate-300 text-sm">{formatDate(transaction.date)}</span>
                        </div>
                        <p className="text-slate-500 text-xs">{formatTime(transaction.date)}</p>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTransaction(transaction);
                            }}
                            className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTransaction(transaction.id);
                            }}
                            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
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

        {/* Transaction Details Modal */}
        <AnimatePresence>
          {selectedTransaction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
              onClick={() => setSelectedTransaction(null)}
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
                    <h2 className="text-xl font-bold text-white">Transaction Details</h2>
                  </div>
                  <button onClick={() => setSelectedTransaction(null)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-slate-400 text-xs mb-1">User</p>
                    <p className="text-white font-medium">{selectedTransaction.user?.name || 'Unknown'}</p>
                    <p className="text-slate-500 text-sm">{selectedTransaction.user?.email}</p>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-slate-400 text-xs mb-1">Description</p>
                    <p className="text-white">{selectedTransaction.description || selectedTransaction.category}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Amount</p>
                      <p className={`text-lg font-bold ${selectedTransaction.type === "INCOME" ? "text-emerald-400" : "text-red-400"}`}>
                        {selectedTransaction.type === "INCOME" ? "+" : "-"}{formatCurrency(selectedTransaction.amount)}
                      </p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Type</p>
                      <p className="text-white">{selectedTransaction.type}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Category</p>
                      <p className="text-white">{selectedTransaction.category}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Date</p>
                      <p className="text-white">{formatDate(selectedTransaction.date)}</p>
                    </div>
                  </div>
                  
                  {selectedTransaction.location && (
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Location</p>
                      <p className="text-white">{selectedTransaction.location}</p>
                    </div>
                  )}
                  
                  {selectedTransaction.tags?.length > 0 && (
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedTransaction.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
