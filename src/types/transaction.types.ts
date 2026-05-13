

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  category: string;
  amount: number;
  description?: string;
  date: string;
  tags: string[];
  location?: string;
  receiptUrl?: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  category: string;
  amount: number;
  description?: string;
  date?: string;
  tags?: string[];
  location?: string;
  receiptUrl?: string;
  isRecurring?: boolean;
}

export interface UpdateTransactionDto {
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  category?: string;
  amount?: number;
  description?: string;
  date?: string;
  tags?: string[];
  location?: string;
  receiptUrl?: string;
  isRecurring?: boolean;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  isRecurring?: boolean;
  sortBy?: 'date' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  categoryBreakdown: Record<string, number>;
}

export interface CategoryAnalysis {
  totalExpense: number;
  categories: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}
