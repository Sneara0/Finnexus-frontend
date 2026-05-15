
'use client';

import { useState, useOptimistic, useTransition } from 'react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
}

export function useOptimisticTransactions(initialTransactions: Transaction[]) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [optimisticTransactions, addOptimisticTransaction] = useOptimistic(
    transactions,
    (state, newTransaction: Transaction) => [newTransaction, ...state]
  );
  const [isPending, startTransition] = useTransition();

  const addTransaction = async (formData: FormData) => {
    const newTransaction = {
      id: `temp-${Date.now()}`,
      type: formData.get('type') as string,
      amount: Number(formData.get('amount')),
      description: formData.get('description') as string,
      date: new Date().toISOString()
    };

    // Optimistic update - immediately show the new transaction
    startTransition(() => {
      addOptimisticTransaction(newTransaction);
    });

    try {
      // Actual API call
      const response = await api.post('/transactions', newTransaction);
      if (response.data.success) {
        // Replace temp transaction with real one
        setTransactions(prev => 
          prev.map(t => t.id === newTransaction.id ? response.data.data : t)
        );
        toast.success('Transaction added successfully');
      }
    } catch (error) {
      // Rollback on error - remove the optimistic transaction
      setTransactions(prev => prev.filter(t => t.id !== newTransaction.id));
      toast.error('Failed to add transaction');
    }
  };

  return { transactions: optimisticTransactions, addTransaction, isPending };
}
