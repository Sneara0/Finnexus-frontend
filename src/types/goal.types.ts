
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  note?: string;
  isCompleted: boolean;
  completedAt?: string;
  progress: number;
  remaining: number;
  daysRemaining: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalDto {
  name: string;
  targetAmount: number;
  deadline: string;
  note?: string;
}

export interface UpdateGoalDto {
  name?: string;
  targetAmount?: number;
  deadline?: string;
  note?: string;
}

export interface AddAmountDto {
  amount: number;
}

export interface GoalDashboard {
  stats: {
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    completionRate: number;
    totalSaved: number;
    totalTarget: number;
    overallProgress: number;
  };
  upcomingDeadlines: Goal[];
  recommendations: any[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
