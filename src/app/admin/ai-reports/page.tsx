
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Brain, Sparkles, Download, RefreshCw, Loader2,
  TrendingUp, TrendingDown, Users, Wallet, 
  CreditCard, Target, Calendar, Clock, CheckCircle,
  AlertCircle, BarChart3, LineChart, PieChart,
  Activity, Zap, Award, Crown, Star, MessageSquare,
  FileText, Copy, Check, Eye, ChevronRight
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

interface AIReport {
  id: string;
  title: string;
  type: 'summary' | 'insights' | 'prediction' | 'recommendation';
  content: string;
  data: any;
  generatedAt: string;
  createdBy: string;
  status: 'pending' | 'completed' | 'failed';
}

interface AIStats {
  totalReports: number;
  avgResponseTime: number;
  accuracyRate: number;
  tokensUsed: number;
  costEstimate: number;
}

export default function AdminAIReportsPage() {
  const [reports, setReports] = useState<AIReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AIStats | null>(null);
  const [selectedReport, setSelectedReport] = useState<AIReport | null>(null);
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState<string>("summary");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load AI reports
  const loadReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login first");
        return;
      }
      
      const response = await api.get('/admin/ai-reports', {
        params: {
          startDate: dateRange.start || undefined,
          endDate: dateRange.end || undefined,
          type: reportType !== "all" ? reportType : undefined
        }
      });
      
      if (response.data.success) {
        setReports(response.data.data || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load AI reports");
    } finally {
      setLoading(false);
    }
  };

  // Load AI stats
  const loadStats = async () => {
    try {
      const response = await api.get('/admin/ai-reports/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load AI stats");
    }
  };

  // Generate new AI report
  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const response = await api.post('/admin/ai-reports/generate', {
        type: reportType,
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined
      });
      if (response.data.success) {
        toast.success("AI report generated successfully");
        loadReports();
        loadStats();
      }
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    loadReports();
    loadStats();
  }, [dateRange, reportType]);

  const statCards = [
    { label: "Total Reports", value: stats?.totalReports || 0, icon: FileText, color: "blue" },
    { label: "Accuracy Rate", value: `${stats?.accuracyRate || 0}%`, icon: Target, color: "emerald" },
    { label: "Avg Response", value: `${stats?.avgResponseTime || 0}s`, icon: Clock, color: "purple" },
    { label: "Tokens Used", value: stats?.tokensUsed?.toLocaleString() || 0, icon: Activity, color: "orange" },
  ];

  const reportTypeLabels = {
    summary: "Financial Summary",
    insights: "AI Insights",
    prediction: "Predictions",
    recommendation: "Recommendations"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl">
                <Brain className="w-6 h-6 text-emerald-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">AI Reports</h1>
              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Admin</span>
            </div>
            <p className="text-slate-400 ml-10">AI-powered analytics and insights</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadReports}
              className="p-2 bg-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/20 transition"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
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

        {/* Generate Report Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-semibold text-white">Generate New Report</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="summary">Financial Summary</option>
                <option value="insights">AI Insights</option>
                <option value="prediction">Predictions</option>
                <option value="recommendation">Recommendations</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate AI Report
          </button>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-emerald-500/20 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <Brain className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400">No AI reports generated yet</p>
            <button
              onClick={handleGenerateReport}
              className="mt-4 px-4 py-2 bg-emerald-500 rounded-lg text-white text-sm hover:bg-emerald-600 transition"
            >
              Generate First Report
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reports List */}
            <div className="space-y-3">
              {reports.map((report, idx) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedReport(report)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedReport?.id === report.id
                      ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-500/30"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center`}>
                        <Brain className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{report.title}</h3>
                        <p className="text-slate-400 text-xs">{reportTypeLabels[report.type]}</p>
                      </div>
                    </div>
                    <span className="text-slate-500 text-xs">{formatDate(report.generatedAt)}</span>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2">{report.content.substring(0, 100)}...</p>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/10">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      report.status === 'completed' 
                        ? "bg-emerald-500/20 text-emerald-400" 
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {report.status}
                    </span>
                    <span className="text-slate-500 text-xs">{formatDate(report.generatedAt)}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Report Details */}
            <div>
              {selectedReport ? (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sticky top-24">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedReport.title}</h2>
                      <p className="text-slate-400 text-sm">{reportTypeLabels[selectedReport.type]}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(selectedReport.content, selectedReport.id)}
                        className="p-1.5 rounded-lg bg-white/10 text-slate-400 hover:text-white hover:bg-white/20 transition"
                      >
                        {copiedId === selectedReport.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 bg-white/5 rounded-lg mb-4 max-h-[400px] overflow-y-auto">
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">{selectedReport.content}</p>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Generated At</p>
                      <p className="text-white text-sm">{formatDate(selectedReport.generatedAt)}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Report Type</p>
                      <p className="text-white text-sm capitalize">{selectedReport.type}</p>
                    </div>
                  </div>

                  {/* Data Preview */}
                  {selectedReport.data && (
                    <div className="mt-4 p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Data Preview</p>
                      <pre className="text-slate-300 text-xs overflow-x-auto">
                        {JSON.stringify(selectedReport.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center">
                  <Brain className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-50" />
                  <p className="text-slate-400">Select a report to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
