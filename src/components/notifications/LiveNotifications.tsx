
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  UserPlus, DollarSign, Target, CreditCard, 
  TrendingUp, Award, Users, Sparkles, Bell,
  CheckCircle, AlertCircle, Info, X
} from 'lucide-react';
import { api } from '@/lib/api';

interface Activity {
  id: string;
  type: 'user_joined' | 'transaction' | 'goal_completed' | 'budget_alert';
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  message: string;
  amount?: number;
  timestamp: string;
  read: boolean;
}

const activityIcons: Record<string, { icon: any; color: string; bg: string }> = {
  user_joined: { icon: UserPlus, color: "emerald", bg: "bg-emerald-500/20" },
  transaction: { icon: CreditCard, color: "blue", bg: "bg-blue-500/20" },
  goal_completed: { icon: Target, color: "purple", bg: "bg-purple-500/20" },
  budget_alert: { icon: TrendingUp, color: "orange", bg: "bg-orange-500/20" }
};

const activityMessages: Record<string, string> = {
  user_joined: 'joined the platform',
  transaction: 'made a transaction',
  goal_completed: 'completed a savings goal',
  budget_alert: 'budget alert triggered'
};

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [newActivities, setNewActivities] = useState(0);
  const [lastFetch, setLastFetch] = useState<Date>(new Date());

  // Fetch activities
  const fetchActivities = useCallback(async () => {
    try {
      const response = await api.get('/activities/recent');
      if (response.data.success) {
        const newActs: Activity[] = response.data.data;
        if (newActs.length > 0) {
          // Check for new activities
          const currentIds = new Set(activities.map((a: Activity) => a.id));
          const freshActivities = newActs.filter((a: Activity) => !currentIds.has(a.id));
          
          if (freshActivities.length > 0) {
            setNewActivities((prev: number) => prev + freshActivities.length);
            setActivities((prev: Activity[]) => [...freshActivities, ...prev]);
            
            // Show toast for new activities
            freshActivities.forEach((activity: Activity) => {
              showActivityToast(activity);
            });
          } else {
            setActivities(newActs);
          }
        }
        setLastFetch(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  }, [activities]);

  // Show toast notification
  const showActivityToast = (activity: Activity) => {
    const { icon: Icon, color, bg } = activityIcons[activity.type];
    
    toast.custom((t: any) => (
      <motion.div
        initial={{ opacity: 0, x: 50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.9 }}
        className="bg-slate-800 rounded-xl shadow-2xl border border-white/10 p-4 max-w-sm"
      >
        <div className="flex gap-3">
          <div className={`p-2 rounded-lg ${bg}`}>
            <Icon className={`w-4 h-4 text-${color}-400`} />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm">
              <span className="font-semibold">{activity.user.name}</span>
              {' '}{activityMessages[activity.type]}
            </p>
            {activity.amount && (
              <p className="text-emerald-400 text-xs font-semibold mt-1">
                ${activity.amount}
              </p>
            )}
            <p className="text-slate-500 text-[10px] mt-1">
              {new Date(activity.timestamp).toLocaleTimeString()}
            </p>
          </div>
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="text-slate-500 hover:text-white transition"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    ), { duration: 5000 });
  };

  // Polling for real-time updates (every 15 seconds)
  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 15000);
    return () => clearInterval(interval);
  }, [fetchActivities]);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/activities/${id}/read`);
      setActivities((prev: Activity[]) => prev.map((a: Activity) => a.id === id ? { ...a, read: true } : a));
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const clearNewActivities = () => {
    setNewActivities(0);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i: number) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-lg bg-white/10" />
            <div className="flex-1">
              <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
              <div className="h-3 w-1/2 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* New Activity Indicator */}
      <AnimatePresence>
        {newActivities > 0 && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={clearNewActivities}
            className="w-full py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4" />
            {newActivities} new {newActivities === 1 ? 'activity' : 'activities'}
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Activity List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        <AnimatePresence>
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
              <p className="text-slate-400 text-sm">No recent activity</p>
            </div>
          ) : (
            activities.map((activity: Activity, idx: number) => {
              const { icon: Icon, color, bg } = activityIcons[activity.type];
              const isNew = !activity.read && idx < 3;
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ scale: 1.01 }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isNew 
                      ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/30' 
                      : 'bg-white/5 border-white/10'
                  } hover:bg-white/10`}
                  onClick={() => markAsRead(activity.id)}
                >
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-lg ${bg}`}>
                      <Icon className={`w-4 h-4 text-${color}-400`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-semibold">{activity.user.name}</span>
                        {' '}{activityMessages[activity.type]}
                      </p>
                      {activity.amount && (
                        <p className="text-emerald-400 text-xs font-semibold mt-1">
                          ${activity.amount}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-slate-500 text-[10px]">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                        <p className="text-slate-500 text-[10px]">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {isNew && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
      
      {/* Last Updated */}
      <div className="text-center pt-2">
        <p className="text-slate-500 text-[10px]">
          Last updated: {lastFetch.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
