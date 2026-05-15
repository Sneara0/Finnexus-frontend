
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, ChevronDown, ChevronUp, Calendar, 
  TrendingUp, TrendingDown, Loader2, RefreshCw, AlertCircle,
  Plus, Wallet, Coffee, ShoppingBag, Car, Film, Home, 
  BookOpen, Heart, Smartphone, Gift, Music, Edit, Trash2,
  ArrowUpDown, Eye, Download, Receipt
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  category: string;
  amount: number;
  description?: string;
  date: string;
  tags: string[];
  location?: string;
  createdAt: string;
}

// Category Icons Mapping
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

// Category Colors Mapping
const categoryColors: Record<string, string> = {
  FOOD: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  SHOPPING: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  TRANSPORT: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ENTERTAINMENT: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  UTILITIES: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  HEALTHCARE: "bg-red-500/20 text-red-400 border-red-500/30",
  EDUCATION: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  SALARY: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  INVESTMENT: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  OTHER: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default function UserTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState({ 
    totalIncome: 0, 
    totalExpense: 0, 
    balance: 0, 
    transactionCount: 0 
  });
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch Summary
  const fetchSummary = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await api.get('/transactions/summary');
      if (response.data.success) {
        setSummary(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch summary");
    }
  }, []);

  // Fetch Transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }
      
      const params: any = {
        page,
        limit: 10,
        sortBy,
        sortOrder,
      };
      
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedType !== "all") params.type = selectedType;
      if (selectedCategory !== "all") params.category = selectedCategory;
      if (dateRange.start) params.startDate = dateRange.start;
      if (dateRange.end) params.endDate = dateRange.end;
      
      const response = await api.get('/transactions', { params });
      if (response.data.success) {
        setTransactions(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotal(response.data.pagination?.total || 0);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedType, selectedCategory, dateRange, sortBy, sortOrder]);

  // Delete Transaction
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    
    setDeletingId(id);
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
      fetchSummary();
    } catch (err) {
      alert("Failed to delete transaction");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, [fetchTransactions, fetchSummary]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedCategory("all");
    setDateRange({ start: "", end: "" });
    setSortBy("date");
    setSortOrder("desc");
    setPage(1);
  };

  const handleSort = (field: "date" | "amount") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const categories = Array.from(new Set(transactions.map(t => t.category))).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Transactions</h1>
            <p className="text-slate-400">Track and manage all your financial activities</p>
          </div>
          <Link href="/user/transactions/add">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-medium hover:opacity-90 transition">
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <p className="text-slate-400 text-sm">Total Income</p>
            <p className="text-2xl font-bold text-emerald-400">+{formatCurrency(summary.totalIncome)}</p>
          </div>
          <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <p className="text-slate-400 text-sm">Total Expense</p>
            <p className="text-2xl font-bold text-red-400">-{formatCurrency(summary.totalExpense)}</p>
          </div>
          <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <p className="text-slate-400 text-sm">Balance</p>
            <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatCurrency(summary.balance)}
            </p>
          </div>
          <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <p className="text-slate-400 text-sm">Transactions</p>
            <p className="text-2xl font-bold text-white">{summary.transactionCount}</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions by description..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition"
            >
              <Filter className="w-4 h-4" />
              Filters
              {(selectedType !== "all" || selectedCategory !== "all" || dateRange.start || dateRange.end) && (
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </button>
            
            <button
              onClick={handleResetFilters}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4 pt-4 border-t border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Transaction Type</label>
                    <div className="flex gap-2">
                      {["all", "INCOME", "EXPENSE"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={`px-3 py-1.5 rounded-lg text-sm capitalize transition ${
                            selectedType === type
                              ? type === "INCOME" 
                                ? "bg-emerald-500 text-white" 
                                : type === "EXPENSE"
                                ? "bg-red-500 text-white"
                                : "bg-white/20 text-white"
                              : "bg-white/5 text-slate-400 hover:bg-white/10"
                          }`}
                        >
                          {type === "all" ? "All" : type.toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Date Range</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      />
                      <span className="text-slate-400">to</span>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sorting Bar */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-400">{total} transactions found</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleSort("date")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition ${
                sortBy === "date" ? "bg-white/20 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Calendar className="w-3 h-3" />
              Date
              {sortBy === "date" && (sortOrder === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
            </button>
            <button
              onClick={() => handleSort("amount")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition ${
                sortBy === "amount" ? "bg-white/20 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <ArrowUpDown className="w-3 h-3" />
              Amount
              {sortBy === "amount" && (sortOrder === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
            </button>
          </div>
        </div>

        {/* Transactions List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-red-400">{error}</p>
            <button onClick={fetchTransactions} className="mt-4 px-4 py-2 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30 transition">
              Try Again
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <Receipt className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No transactions found</p>
            <Link href="/user/transactions/add">
              <button className="mt-4 px-4 py-2 bg-emerald-500 rounded-lg text-white text-sm">
                Add Your First Transaction
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction, idx) => {
              const Icon = categoryIcons[transaction.category] || Wallet;
              const colorClass = categoryColors[transaction.category] || categoryColors.OTHER;
              
              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 p-4 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{transaction.description || transaction.category}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${colorClass}`}>
                            {transaction.category}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(transaction.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${transaction.type === "INCOME" ? "text-emerald-400" : "text-red-400"}`}>
                        {transaction.type === "INCOME" ? "+" : "-"}{formatCurrency(transaction.amount)}
                      </p>
                      <div className="flex gap-2 mt-1 justify-end opacity-0 group-hover:opacity-100 transition">
                        <Link href={`/user/transactions/${transaction.id}`}>
                          <button className="p-1 text-slate-400 hover:text-blue-400 transition">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <Link href={`/user/transactions/${transaction.id}/edit`}>
                          <button className="p-1 text-slate-400 hover:text-blue-400 transition">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(transaction.id)} 
                          disabled={deletingId === transaction.id}
                          className="p-1 text-slate-400 hover:text-red-400 transition disabled:opacity-50"
                        >
                          {deletingId === transaction.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white/5 rounded-lg text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg transition ${
                      page === pageNum
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
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white/5 rounded-lg text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
