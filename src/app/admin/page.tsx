
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Users, Search, Filter, ChevronDown, ChevronUp, 
  Calendar, Loader2, RefreshCw, AlertCircle,
  Eye, Trash2, Edit, Shield, UserCheck, UserX,
  Mail, Phone, MapPin, Award, Crown, Star,
  Plus, X, CheckCircle, XCircle, Clock, User,
  Sparkles, MoreVertical, Ban, Check, Send
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'MANAGER' | 'ADMIN';
  avatar?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  _count?: {
    transactions: number;
    budgets: number;
    goals: number;
  };
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminCount: number;
  managerCount: number;
  userCount: number;
  newThisMonth: number;
  newThisWeek: number;
}

const roleColors = {
  ADMIN: "bg-red-500/20 text-red-400 border-red-500/30",
  MANAGER: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  USER: "bg-blue-500/20 text-blue-400 border-blue-500/30"
};

const roleIcons = {
  ADMIN: Crown,
  MANAGER: Award,
  USER: User
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(15);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "", address: "", role: "" });
  const [updating, setUpdating] = useState(false);

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login first");
        return;
      }
      
      const response = await api.get('/admin/users', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm || undefined,
          role: selectedRole !== "all" ? selectedRole : undefined,
          status: selectedStatus !== "all" ? selectedStatus : undefined
        }
      });
      
      if (response.data.success) {
        setUsers(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Load stats
  const loadStats = async () => {
    try {
      const response = await api.get('/admin/users/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load stats");
    }
  };

  // Update user role
  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/role`, { role });
      if (response.data.success) {
        toast.success(`User role updated to ${role}`);
        loadUsers();
        loadStats();
      }
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  // Toggle user status
  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/toggle-status`);
      if (response.data.success) {
        toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        loadUsers();
        loadStats();
        if (selectedUser?.id === userId) {
          setSelectedUser({ ...selectedUser, isActive: !currentStatus });
        }
      }
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) return;
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      if (response.data.success) {
        toast.success("User deleted successfully");
        loadUsers();
        loadStats();
        if (selectedUser?.id === userId) {
          setSelectedUser(null);
        }
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  // Edit user
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setUpdating(true);
    try {
      const response = await api.put(`/admin/users/${selectedUser.id}`, editForm);
      if (response.data.success) {
        toast.success("User updated successfully");
        setShowEditModal(false);
        loadUsers();
        loadStats();
        setSelectedUser(response.data.data.user);
      }
    } catch (error) {
      toast.error("Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [currentPage, searchTerm, selectedRole, selectedStatus]);

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "blue" },
    { label: "Active Users", value: stats?.activeUsers || 0, icon: UserCheck, color: "emerald" },
    { label: "New This Month", value: stats?.newThisMonth || 0, icon: Calendar, color: "purple" },
    { label: "Admins", value: stats?.adminCount || 0, icon: Crown, color: "red" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">User Management</h1>
            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Admin</span>
          </div>
          <p className="text-slate-400 ml-10">Manage all platform users</p>
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
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="USER">User</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button
                onClick={loadUsers}
                className="p-2 bg-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/20 transition"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-emerald-500/20 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <Users className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-3 text-slate-400 text-sm font-medium">User</th>
                  <th className="text-left py-3 px-3 text-slate-400 text-sm font-medium">Contact</th>
                  <th className="text-left py-3 px-3 text-slate-400 text-sm font-medium">Role</th>
                  <th className="text-left py-3 px-3 text-slate-400 text-sm font-medium">Status</th>
                  <th className="text-left py-3 px-3 text-slate-400 text-sm font-medium">Joined</th>
                  <th className="text-left py-3 px-3 text-slate-400 text-sm font-medium">Activity</th>
                  <th className="text-center py-3 px-3 text-slate-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => {
                  const RoleIcon = roleIcons[user.role];
                  const roleColor = roleColors[user.role];
                  
                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer"
                      onClick={() => setSelectedUser(user)}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{user.name?.charAt(0) || 'U'}</span>
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{user.name}</p>
                            <p className="text-slate-500 text-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {user.phone && (
                          <div className="flex items-center gap-1 text-slate-400 text-xs">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${roleColor}`}>
                            <RoleIcon className="w-3 h-3" />
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {user.isActive ? (
                          <span className="flex items-center gap-1 text-emerald-400 text-xs">
                            <CheckCircle className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-400 text-xs">
                            <XCircle className="w-3 h-3" /> Inactive
                          </span>
                        )}
                       </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-300 text-sm">{formatDate(user.createdAt)}</span>
                       </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-2 text-xs">
                          <span className="text-slate-400">T: {user._count?.transactions || 0}</span>
                          <span className="text-slate-400">G: {user._count?.goals || 0}</span>
                        </div>
                       </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(user);
                            }}
                            className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditForm({
                                name: user.name,
                                phone: user.phone || "",
                                address: user.address || "",
                                role: user.role
                              });
                              setSelectedUser(user);
                              setShowEditModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(user.id, user.isActive);
                            }}
                            className={`p-1.5 rounded-lg transition ${user.isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
                            title={user.isActive ? "Deactivate" : "Activate"}
                          >
                            {user.isActive ? <Ban className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(user.id);
                            }}
                            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                            title="Delete User"
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

        {/* User Details Modal */}
        <AnimatePresence>
          {selectedUser && !showEditModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
              onClick={() => setSelectedUser(null)}
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
                      <Users className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">User Details</h2>
                  </div>
                  <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">{selectedUser.name?.charAt(0) || 'U'}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{selectedUser.name}</p>
                      <p className="text-slate-400 text-sm">{selectedUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Role</p>
                      <p className="text-white">{selectedUser.role}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Status</p>
                      <p className={selectedUser.isActive ? "text-emerald-400" : "text-red-400"}>
                        {selectedUser.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                  
                  {selectedUser.phone && (
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Phone</p>
                      <p className="text-white">{selectedUser.phone}</p>
                    </div>
                  )}
                  
                  {selectedUser.address && (
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Address</p>
                      <p className="text-white">{selectedUser.address}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-2 bg-white/5 rounded-lg text-center">
                      <p className="text-slate-400 text-xs">Transactions</p>
                      <p className="text-white font-bold">{selectedUser._count?.transactions || 0}</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg text-center">
                      <p className="text-slate-400 text-xs">Budgets</p>
                      <p className="text-white font-bold">{selectedUser._count?.budgets || 0}</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg text-center">
                      <p className="text-slate-400 text-xs">Goals</p>
                      <p className="text-white font-bold">{selectedUser._count?.goals || 0}</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-slate-400 text-xs mb-1">Member Since</p>
                    <p className="text-white">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  
                  {selectedUser.lastLogin && (
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Last Login</p>
                      <p className="text-white">{formatDate(selectedUser.lastLogin)}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit User Modal */}
        <AnimatePresence>
          {showEditModal && selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
              onClick={() => setShowEditModal(false)}
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
                      <Edit className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Edit User</h2>
                  </div>
                  <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleEditUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                    <textarea
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="USER">User</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Save Changes
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
