
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Users, Settings, LogOut, Shield, 
  TrendingUp, Wallet, Bell, Menu, X, Home, BarChart3,
  Target, CreditCard, Bot, HelpCircle
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData || '{}');
    if (parsedUser.role !== 'ADMIN') {
      router.push('/user/dashboard');
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
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: TrendingUp, label: 'Analytics', href: '/admin/analytics' },
    { icon: CreditCard, label: 'Transactions', href: '/admin/transactions' },
    { icon: Target, label: 'Goals', href: '/admin/goals' },
    { icon: Bot, label: 'AI Reports', href: '/admin/ai-reports' },
    { icon: Bell, label: 'Notifications', href: '/admin/notifications' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
    { icon: HelpCircle, label: 'Support', href: '/admin/support' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 w-72 h-full bg-slate-800 border-r border-slate-700 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-72'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">FinNexus</h1>
                <p className="text-slate-400 text-xs">Admin Panel</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold">{user?.name?.charAt(0) || 'A'}</span>
              </div>
              <div>
                <p className="text-white font-semibold">{user?.name}</p>
                <p className="text-slate-400 text-xs">{user?.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-[10px] font-bold">
                  <Shield className="w-2.5 h-2.5" /> ADMIN
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all group"
              >
                <item.icon className="w-5 h-5 group-hover:scale-110 transition" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-slate-800/80 backdrop-blur-xl border-b border-slate-700">
          <div className="flex items-center justify-between px-6 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-white text-sm font-medium">{user?.name}</p>
                  <p className="text-slate-400 text-xs">Administrator</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold">{user?.name?.charAt(0) || 'A'}</span>
                </div>
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
