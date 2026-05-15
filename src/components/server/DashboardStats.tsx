
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  date: string;
  category: string;
}

// Loading Component
const TransactionsSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.1 }}
        className="bg-white/5 rounded-xl p-4 animate-pulse"
      >
        <div className="flex justify-between">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10" />
            <div>
              <div className="h-4 w-32 bg-white/10 rounded mb-2" />
              <div className="h-3 w-24 bg-white/10 rounded" />
            </div>
          </div>
          <div className="h-5 w-20 bg-white/10 rounded" />
        </div>
      </motion.div>
    ))}
  </div>
);

// Error Component
const TransactionsError = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-8 text-center">
    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
    <p className="text-red-400">{error}</p>
    <button onClick={onRetry} className="mt-4 px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition">
      Try Again
    </button>
  </div>
);

// Main Component with Streaming
export default function TransactionsSuspense() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        return;
      }
      
      const response = await api.get('/transactions?limit=5');
      if (response.data.success) {
        setTransactions(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) return <TransactionsSkeleton />;
  if (error) return <TransactionsError error={error} onRetry={fetchTransactions} />;

  return (
    <div className="space-y-3">
      {transactions.map((tx, idx) => (
        <motion.div
          key={tx.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-medium">{tx.description || tx.category}</p>
              <p className="text-slate-400 text-xs">{new Date(tx.date).toLocaleDateString()}</p>
            </div>
            <p className={`font-bold ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
              {tx.type === 'INCOME' ? '+' : '-'}${tx.amount}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
