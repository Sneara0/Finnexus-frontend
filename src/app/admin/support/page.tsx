
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  MessageSquare, Users, Clock, CheckCircle, XCircle,
  AlertCircle, Search, Filter, ChevronDown, ChevronUp,
  Mail, Phone, Calendar, Star, Flag, Eye, Trash2,
  Reply, Send, Loader2, Sparkles, Award, Crown,
  UserCheck, UserX, Shield, Bell, Settings, HelpCircle,
  Heart, Smile, Frown, Meh, TrendingUp, TrendingDown
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/utils';

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  adminNotes?: string;
}

interface SupportStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  avgResponseTime: string;
  satisfactionRate: number;
}

const priorityColors = {
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  urgent: "bg-red-500/20 text-red-400 border-red-500/30"
};

const statusColors = {
  open: "bg-red-500/20 text-red-400 border-red-500/30",
  in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  resolved: "bg-green-500/20 text-green-400 border-green-500/30",
  closed: "bg-slate-500/20 text-slate-400 border-slate-500/30"
};

const statusIcons = {
  open: AlertCircle,
  in_progress: Clock,
  resolved: CheckCircle,
  closed: XCircle
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SupportStats | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load tickets
  const loadTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login first");
        return;
      }
      
      const response = await api.get('/admin/support/tickets', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          priority: priorityFilter !== "all" ? priorityFilter : undefined
        }
      });
      
      if (response.data.success) {
        setTickets(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  // Load stats
  const loadStats = async () => {
    try {
      const response = await api.get('/admin/support/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load stats");
    }
  };

  // Update ticket status
  const updateTicketStatus = async (id: string, status: string) => {
    try {
      const response = await api.patch(`/admin/support/tickets/${id}/status`, { status });
      if (response.data.success) {
        toast.success(`Ticket marked as ${status}`);
        loadTickets();
        loadStats();
        if (selectedTicket?.id === id) {
          setSelectedTicket({ ...selectedTicket, status: status as any });
        }
      }
    } catch (error) {
      toast.error("Failed to update ticket status");
    }
  };

  // Reply to ticket
  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    
    setSending(true);
    try {
      const response = await api.post(`/admin/support/tickets/${selectedTicket.id}/reply`, {
        message: replyMessage
      });
      if (response.data.success) {
        toast.success("Reply sent successfully");
        setReplyMessage("");
        loadTickets();
      }
    } catch (error) {
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  // Delete ticket
  const handleDeleteTicket = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    try {
      const response = await api.delete(`/admin/support/tickets/${id}`);
      if (response.data.success) {
        toast.success("Ticket deleted");
        loadTickets();
        loadStats();
        if (selectedTicket?.id === id) {
          setSelectedTicket(null);
        }
      }
    } catch (error) {
      toast.error("Failed to delete ticket");
    }
  };

  useEffect(() => {
    loadTickets();
    loadStats();
  }, [currentPage, searchTerm, statusFilter, priorityFilter]);

  const statCards = [
    { label: "Total Tickets", value: stats?.totalTickets || 0, icon: MessageSquare, color: "blue" },
    { label: "Open", value: stats?.openTickets || 0, icon: AlertCircle, color: "red" },
    { label: "In Progress", value: stats?.inProgressTickets || 0, icon: Clock, color: "yellow" },
    { label: "Resolved", value: stats?.resolvedTickets || 0, icon: CheckCircle, color: "green" },
    { label: "Satisfaction", value: `${stats?.satisfactionRate || 0}%`, icon: Star, color: "purple" },
    { label: "Avg Response", value: stats?.avgResponseTime || "0h", icon: Clock, color: "cyan" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl">
              <HelpCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Support Tickets</h1>
            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Admin</span>
          </div>
          <p className="text-slate-400 ml-10">Manage user support requests and inquiries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className={`w-8 h-8 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center mb-2`}>
                <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
              </div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-slate-400 text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by subject, user email..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-emerald-500/20 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <MessageSquare className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400">No support tickets found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tickets List */}
            <div className="space-y-3">
              {tickets.map((ticket, idx) => {
                const StatusIcon = statusIcons[ticket.status];
                const isSelected = selectedTicket?.id === ticket.id;
                
                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-500/30"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${priorityColors[ticket.priority]}`}>
                          {ticket.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[ticket.status]}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-slate-500 text-xs">{formatDate(ticket.createdAt)}</span>
                    </div>
                    
                    <h3 className="text-white font-semibold mb-1">{ticket.subject}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{ticket.message}</p>
                    
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {ticket.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <span className="text-slate-400 text-xs">{ticket.user?.email}</span>
                      </div>
                      <span className="text-slate-500 text-xs">{formatTime(ticket.createdAt)}</span>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-white/5 rounded-lg text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition text-sm"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-slate-400 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-white/5 rounded-lg text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition text-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Ticket Details */}
            <div>
              {selectedTicket ? (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sticky top-24">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedTicket.subject}</h2>
                      <div className="flex gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${priorityColors[selectedTicket.priority]}`}>
                          {selectedTicket.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[selectedTicket.status]}`}>
                          {selectedTicket.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteTicket(selectedTicket.id)}
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="p-3 bg-white/5 rounded-lg mb-4">
                    <p className="text-slate-400 text-xs mb-1">From</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {selectedTicket.user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedTicket.user?.name}</p>
                        <p className="text-slate-400 text-xs">{selectedTicket.user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="p-3 bg-white/5 rounded-lg mb-4">
                    <p className="text-slate-400 text-xs mb-1">Message</p>
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">{selectedTicket.message}</p>
                    <p className="text-slate-500 text-xs mt-2">{formatDate(selectedTicket.createdAt)}</p>
                  </div>

                  {/* Status Actions */}
                  <div className="flex gap-2 mb-4">
                    {selectedTicket.status !== 'in_progress' && (
                      <button
                        onClick={() => updateTicketStatus(selectedTicket.id, 'in_progress')}
                        className="flex-1 py-2 bg-yellow-500/20 rounded-lg text-yellow-400 text-sm font-medium hover:bg-yellow-500/30 transition"
                      >
                        Start Progress
                      </button>
                    )}
                    {selectedTicket.status !== 'resolved' && (
                      <button
                        onClick={() => updateTicketStatus(selectedTicket.id, 'resolved')}
                        className="flex-1 py-2 bg-green-500/20 rounded-lg text-green-400 text-sm font-medium hover:bg-green-500/30 transition"
                      >
                        Mark Resolved
                      </button>
                    )}
                    {selectedTicket.status !== 'closed' && (
                      <button
                        onClick={() => updateTicketStatus(selectedTicket.id, 'closed')}
                        className="flex-1 py-2 bg-slate-500/20 rounded-lg text-slate-400 text-sm font-medium hover:bg-slate-500/30 transition"
                      >
                        Close
                      </button>
                    )}
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handleReply} className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">Reply to User</label>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={4}
                      placeholder="Type your response here..."
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none"
                    />
                    <button
                      type="submit"
                      disabled={sending || !replyMessage.trim()}
                      className="w-full py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Send Reply
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-50" />
                  <p className="text-slate-400">Select a ticket to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
