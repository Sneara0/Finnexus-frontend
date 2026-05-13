
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Wallet, Target, LogOut, User, 
  TrendingUp, Bell, Menu, X, CreditCard,
  Bot, BarChart3, Settings, HelpCircle, Sparkles,
  ChevronDown, UserCircle, Shield, Activity
} from "lucide-react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData || '{}');
    if (parsedUser.role === 'ADMIN') {
      router.push('/admin/dashboard');
      return;
    }
    
    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/user/dashboard', color: 'blue' },
    { icon: Wallet, label: 'Transactions', href: '/user/transactions', color: 'green' },
    { icon: TrendingUp, label: 'Budgets', href: '/user/budgets', color: 'purple' },
    { icon: Target, label: 'Goals', href: '/user/goals', color: 'orange' },
    { icon: CreditCard, label: 'Subscriptions', href: '/user/subscriptions', color: 'pink' },
    { icon: Bot, label: 'AI Assistant', href: '/user/ai-assistant', color: 'indigo' },
    { icon: BarChart3, label: 'Reports', href: '/user/reports', color: 'cyan' },
    { icon: User, label: 'Profile', href: '/user/profile', color: 'slate' },
    { icon: Settings, label: 'Settings', href: '/user/settings', color: 'gray' },
    { icon: HelpCircle, label: 'Help & Support', href: '/user/help', color: 'yellow' },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500/20 text-blue-400',
      green: 'bg-green-500/20 text-green-400',
      purple: 'bg-purple-500/20 text-purple-400',
      orange: 'bg-orange-500/20 text-orange-400',
      pink: 'bg-pink-500/20 text-pink-400',
      indigo: 'bg-indigo-500/20 text-indigo-400',
      cyan: 'bg-cyan-500/20 text-cyan-400',
      slate: 'bg-slate-500/20 text-slate-400',
      gray: 'bg-gray-500/20 text-gray-400',
      yellow: 'bg-yellow-500/20 text-yellow-400',
    };
    return colors[color] || 'bg-blue-500/20 text-blue-400';
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-[50%] left-[40%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] animate-pulse delay-500" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 w-80 h-full bg-slate-900/95 backdrop-blur-xl border-r border-white/10 shadow-2xl transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-80'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur opacity-60"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-2.5 rounded-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-white font-bold text-xl">FinNexus</h1>
                  <p className="text-slate-400 text-xs">Personal Finance</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="lg:hidden text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">{user?.name?.charAt(0) || 'U'}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">{user?.name || 'User'}</p>
                <p className="text-slate-400 text-xs truncate">{user?.email || 'user@example.com'}</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold">
                  <User className="w-2.5 h-2.5" /> FREE PLAN
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
              >
                <div className={`p-1.5 rounded-lg ${getColorClasses(item.color)} transition-all group-hover:scale-105`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Upgrade Section */}
          <div className="p-4 m-3 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-xl border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm font-semibold">Upgrade to Pro</span>
            </div>
            <p className="text-slate-400 text-xs mb-3">Get AI insights, unlimited budgets, and more!</p>
            <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition">
              Upgrade Now →
            </button>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all group"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-80 min-h-screen">
        
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Menu Button (Mobile) */}
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden text-slate-400 hover:text-white transition p-2 rounded-lg hover:bg-white/10"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Page Title (Mobile) */}
            <h1 className="lg:hidden text-white font-semibold">Dashboard</h1>
            
            <div className="flex-1 lg:flex-none"></div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <button className="hidden sm:flex p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              </button>

              {/* User Menu with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-white text-sm font-medium">{user?.name?.split(' ')[0] || 'User'}</p>
                    <p className="text-slate-400 text-xs">Personal Account</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
                    <span className="text-white font-bold text-sm">{user?.name?.charAt(0) || 'U'}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden">
                      {/* User Info */}
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="text-white font-bold">{user?.name?.charAt(0) || 'U'}</span>
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">{user?.name}</p>
                            <p className="text-slate-400 text-xs">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <Link
                          href="/user/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
                        >
                          <UserCircle className="w-4 h-4" />
                          <span className="text-sm">My Profile</span>
                        </Link>
                        <Link
                          href="/user/settings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm">Settings</span>
                        </Link>
                        <Link
                          href="/user/activity"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
                        >
                          <Activity className="w-4 h-4" />
                          <span className="text-sm">Activity Log</span>
                        </Link>
                        <div className="border-t border-white/10 my-2"></div>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all group"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
