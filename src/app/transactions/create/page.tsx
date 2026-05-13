
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Wallet, TrendingUp, TrendingDown, 
  Loader2, CheckCircle, AlertCircle, Calendar,
  Tag, MapPin, Receipt, Repeat, X, Sparkles,
  CreditCard, ShoppingBag, Coffee, Car, Film,
  Home, Heart, BookOpen, Gift, Globe, Smartphone,
  CircleDollarSign, Zap
} from "lucide-react";
import Link from "next/link";

import { CreateTransactionDto } from "@/types/transaction.types";
import transactionService from "@/app/services/transaction.service";

const categories = [
  { value: "FOOD", label: "খাবার", icon: Coffee, color: "orange" },
  { value: "SHOPPING", label: "শপিং", icon: ShoppingBag, color: "pink" },
  { value: "TRANSPORT", label: "যাতায়াত", icon: Car, color: "blue" },
  { value: "ENTERTAINMENT", label: "বিনোদন", icon: Film, color: "purple" },
  { value: "UTILITIES", label: "ইউটিলিটি", icon: Zap, color: "yellow" },
  { value: "HEALTHCARE", label: "স্বাস্থ্য", icon: Heart, color: "red" },
  { value: "EDUCATION", label: "শিক্ষা", icon: BookOpen, color: "emerald" },
  { value: "RENT", label: "ভাড়া", icon: Home, color: "indigo" },
  { value: "SALARY", label: "বেতন", icon: CircleDollarSign, color: "green" },
  { value: "INVESTMENT", label: "বিনিয়োগ", icon: TrendingUp, color: "teal" },
  { value: "GIFTS", label: "উপহার", icon: Gift, color: "rose" },
  { value: "TRAVEL", label: "ভ্রমণ", icon: Globe, color: "amber" },
  { value: "OTHER", label: "অন্যান্য", icon: Smartphone, color: "slate" },
];

const categoryColors: Record<string, string> = {
  FOOD: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  SHOPPING: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  TRANSPORT: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ENTERTAINMENT: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  UTILITIES: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  HEALTHCARE: "bg-red-500/20 text-red-400 border-red-500/30",
  EDUCATION: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  RENT: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  SALARY: "bg-green-500/20 text-green-400 border-green-500/30",
  INVESTMENT: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  GIFTS: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  TRAVEL: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  OTHER: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

// Validation errors interface
interface ValidationErrors {
  amount?: string;
  description?: string;
  date?: string;
}

export default function CreateTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  const [formData, setFormData] = useState<CreateTransactionDto>({
    type: "EXPENSE",
    category: "FOOD",
    amount: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
    tags: [],
    location: "",
    isRecurring: false,
  });
  
  const [tagInput, setTagInput] = useState("");

  // Validation function
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!formData.amount || formData.amount <= 0) {
      errors.amount = "Please enter a valid amount";
    }
    
    if (!formData.description || formData.description.trim() === "") {
      errors.description = "Description is required";
    }
    
    if (!formData.date) {
      errors.date = "Date is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value
    }));
    // Clear validation error for this field
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleTypeChange = (type: "INCOME" | "EXPENSE") => {
    setFormData(prev => ({ ...prev, type }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submit
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await transactionService.create(formData);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/transactions");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(c => c.value === formData.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/transactions">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-white"
            >
              Add Transaction
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-sm mt-1"
            >
              Record your income or expense
            </motion.p>
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl flex items-center gap-3"
            >
              <div className="p-1.5 bg-emerald-500/20 rounded-full">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-200 font-medium">Transaction created successfully!</p>
                <p className="text-emerald-300/70 text-sm">Redirecting to transactions...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl flex items-center gap-3"
            >
              <div className="p-1.5 bg-red-500/20 rounded-full">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-red-200">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Card */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 space-y-6 shadow-2xl"
        >
          
          {/* Transaction Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Transaction Type</label>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleTypeChange("EXPENSE")}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
                  formData.type === "EXPENSE"
                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10"
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                Expense
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleTypeChange("INCOME")}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
                  formData.type === "INCOME"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Income
              </motion.button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Amount *</label>
            <div className={`relative transition-all duration-300 ${focusedField === "amount" ? "scale-[1.02]" : ""}`}>
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
              <input
                type="number"
                name="amount"
                value={formData.amount || ""}
                onChange={handleChange}
                onFocus={() => setFocusedField("amount")}
                onBlur={() => setFocusedField(null)}
                required
                min="0"
                step="1"
                placeholder="0.00"
                className={`w-full pl-12 pr-4 py-3.5 bg-white/10 border rounded-xl text-white text-lg font-semibold placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  validationErrors.amount 
                    ? "border-red-500 focus:ring-red-500/20" 
                    : "border-white/20 focus:border-emerald-500 focus:ring-emerald-500/20"
                }`}
              />
            </div>
            {validationErrors.amount && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {validationErrors.amount}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
            <div className={`relative transition-all duration-300 ${focusedField === "description" ? "scale-[1.02]" : ""}`}>
              <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onFocus={() => setFocusedField("description")}
                onBlur={() => setFocusedField(null)}
                placeholder="What was this for?"
                className={`w-full pl-10 pr-4 py-3.5 bg-white/10 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  validationErrors.description 
                    ? "border-red-500 focus:ring-red-500/20" 
                    : "border-white/20 focus:border-emerald-500 focus:ring-emerald-500/20"
                }`}
              />
            </div>
            {validationErrors.description && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {validationErrors.description}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Date *</label>
            <div className={`relative transition-all duration-300 ${focusedField === "date" ? "scale-[1.02]" : ""}`}>
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                onFocus={() => setFocusedField("date")}
                onBlur={() => setFocusedField(null)}
                required
                className={`w-full pl-10 pr-4 py-3.5 bg-white/10 border rounded-xl text-white focus:outline-none focus:ring-2 transition-all ${
                  validationErrors.date 
                    ? "border-red-500 focus:ring-red-500/20" 
                    : "border-white/20 focus:border-emerald-500 focus:ring-emerald-500/20"
                }`}
              />
            </div>
            {validationErrors.date && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {validationErrors.date}
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.value;
                return (
                  <motion.button
                    key={cat.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                    className={`flex items-center gap-2 p-2.5 rounded-xl transition-all ${
                      isSelected
                        ? `bg-${cat.color}-500/20 border border-${cat.color}-500/30 text-${cat.color}-400`
                        : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{cat.label}</span>
                  </motion.button>
                );
              })}
            </div>
            {formData.category && selectedCategory && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              >
                <span className={categoryColors[formData.category]}>
                  <span className="flex items-center gap-1">
                    <selectedCategory.icon className="w-3 h-3" />
                    {selectedCategory.label}
                  </span>
                </span>
              </motion.div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tags (Optional)</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  placeholder="Add tags..."
                  className="w-full pl-10 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleAddTag}
                className="px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-medium hover:opacity-90 transition"
              >
                Add
              </motion.button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/30"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-emerald-200 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          {/* Location & Recurring */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Location (Optional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Where did this happen?"
                  className="w-full pl-10 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Repeat className="w-5 h-5 text-slate-400" />
                <div>
                  <label className="text-white font-medium">Recurring</label>
                  <p className="text-slate-500 text-xs">Monthly recurring transaction</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isRecurring: !prev.isRecurring }))}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  formData.isRecurring ? "bg-gradient-to-r from-emerald-500 to-cyan-500" : "bg-white/20"
                }`}
              >
                <motion.span
                  animate={{ x: formData.isRecurring ? 24 : 2 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/30"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Transaction...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Create Transaction
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
