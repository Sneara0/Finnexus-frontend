
'use client';

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Bot, User, Sparkles, Trash2, 
  Loader2, Copy, Check, AlertCircle,
  Mic, MicOff, Zap, Brain, MessageSquare, Plus,
  TrendingUp, Tag, BarChart3, Lightbulb,
  X, ChevronDown, Wallet, Target, Calendar,
  DollarSign, PieChart, LineChart, Activity,
  History, RefreshCw, Menu, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { formatCurrency } from "@/lib/utils";
import AIService from "@/app/services/ai.service";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  sessionId: string;
  messageCount: number;
  lastMessageAt: string;
}

export default function AIChatPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "analysis" | "autotag" | "budget">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [tagResult, setTagResult] = useState<any>(null);
  const [tagInput, setTagInput] = useState({ description: "", amount: "" });
  const [budgetIncome, setBudgetIncome] = useState("");
  const [budgetResult, setBudgetResult] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [analysisPeriod, setAnalysisPeriod] = useState<"week" | "month" | "year">("month");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load sessions using AIService
  const loadSessions = async () => {
    try {
      const response = await AIService.getChatSessions();
      if (response.success) {
        setSessions(response.data.sessions || []);
      }
    } catch (err) {
      console.error("Failed to load sessions");
    }
  };

  // Load analysis using AIService
  const loadAnalysis = async () => {
    try {
      const response = await AIService.getFinancialAnalysis(analysisPeriod);
      if (response.success) {
        setAnalysis(response.data);
      }
    } catch (err) {
      console.error("Failed to load analysis");
    }
  };

  // Load chat history using AIService
  const loadChatHistory = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const response = await AIService.getChatHistory(sessionId);
      if (response.success) {
        const historyMessages = response.data.chats.map((chat: any) => [
          { id: `${chat.id}_user`, role: "user" as const, content: chat.message, timestamp: new Date(chat.createdAt) },
          { id: `${chat.id}_assistant`, role: "assistant" as const, content: chat.response, timestamp: new Date(chat.createdAt) }
        ]).flat();
        setMessages(historyMessages);
        setSessionId(sessionId);
        setSelectedSession(sessionId);
        localStorage.setItem("chatSessionId", sessionId);
      }
    } catch (err) {
      console.error("Failed to load chat history");
    } finally {
      setIsLoading(false);
    }
  };

  // Send message using AIService
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await AIService.sendChatMessage(input, sessionId || undefined);
      
      if (response.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.data.response,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        
        if (response.data.sessionId) {
          setSessionId(response.data.sessionId);
          localStorage.setItem("chatSessionId", response.data.sessionId);
        }
        
        loadSessions();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto tag transaction using AIService
  const handleAutoTag = async () => {
    if (!tagInput.description) return;
    setIsLoading(true);
    try {
      const response = await AIService.autoTagTransaction({
        description: tagInput.description,
        amount: parseFloat(tagInput.amount) || 0
      });
      if (response.success) {
        setTagResult(response.data);
      }
    } catch (err) {
      setError("Failed to categorize transaction");
    } finally {
      setIsLoading(false);
    }
  };

  // Budget recommendation using AIService
  const handleBudgetRecommendation = async () => {
    if (!budgetIncome) return;
    setIsLoading(true);
    try {
      const response = await AIService.getBudgetRecommendation({
        monthlyIncome: parseFloat(budgetIncome)
      });
      if (response.success) {
        setBudgetResult(response.data);
      }
    } catch (err) {
      setError("Failed to get budget recommendation");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete session using AIService
  const handleDeleteSession = async (sessionId: string) => {
    if (confirm("Delete this conversation?")) {
      try {
        await AIService.deleteSession(sessionId);
        loadSessions();
        if (selectedSession === sessionId) {
          handleNewChat();
        }
      } catch (err) {
        console.error("Failed to delete session");
      }
    }
  };

  // New chat
  const handleNewChat = () => {
    const newSessionId = AIService.createNewSession();
    setSessionId(newSessionId);
    setSelectedSession(null);
    setMessages([]);
    loadSessions();
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Voice input
  const startVoiceInput = () => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "bn-BD";
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      alert("Voice input is not supported in your browser.");
    }
  };

  // Initial load
  useEffect(() => {
    const savedSessionId = localStorage.getItem("chatSessionId");
    if (savedSessionId) {
      setSessionId(savedSessionId);
    } else {
      const newSessionId = AIService.createNewSession();
      setSessionId(newSessionId);
    }
    loadSessions();
    loadAnalysis();
  }, []);

  useEffect(() => {
    if (activeTab === "analysis") {
      loadAnalysis();
    }
  }, [analysisPeriod, activeTab]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const suggestions = [
    "How can I save more money?",
    "What's the best budget for food?",
    "Tips for financial planning",
    "How to reduce monthly bills?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      
      {/* Header */}
      <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 rounded-lg bg-white/5 text-slate-400"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">AI Assistant</h1>
              <p className="text-slate-400 text-[10px]">Powered by Gemini AI</p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === "chat" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setActiveTab("analysis")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === "analysis" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              📊 Analysis
            </button>
            <button
              onClick={() => setActiveTab("autotag")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === "autotag" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              🏷️ Auto Tag
            </button>
            <button
              onClick={() => setActiveTab("budget")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === "budget" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              💰 Budget
            </button>
            <button onClick={handleNewChat} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition" title="New Chat">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        
        {/* Sessions Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:block`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm">Conversations</h3>
              <button onClick={() => setShowSidebar(false)} className="lg:hidden text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleNewChat}
              className="w-full mb-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Chat
            </button>
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.sessionId}
                  className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${selectedSession === session.sessionId ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                  <div onClick={() => loadChatHistory(session.sessionId)} className="flex-1">
                    <p className="text-slate-300 text-xs truncate">{session.sessionId.slice(0, 20)}...</p>
                    <p className="text-slate-500 text-[10px]">{session.messageCount} messages • {new Date(session.lastMessageAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => handleDeleteSession(session.sessionId)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 transition">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 px-4 py-6">
          
          {/* Chat Tab */}
          {activeTab === "chat" && (
            <>
              {/* Chat Messages */}
              <div className="space-y-3 mb-4 min-h-[400px] max-h-[500px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
                      <MessageSquare className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-white font-semibold text-base mb-1">Start a Conversation</h3>
                    <p className="text-slate-400 text-xs max-w-md mx-auto">Ask me anything about personal finance, budgeting, savings, or investments.</p>
                    <div className="flex flex-wrap justify-center gap-1 mt-4">
                      {suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInput(suggestion)}
                          className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-slate-300 text-[10px] hover:bg-white/10 transition"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message, idx) => (
                    <div key={message.id} className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      {message.role === "assistant" && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[80%] rounded-xl px-3 py-2 ${message.role === "user" ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white" : "bg-white/10 text-slate-200 border border-white/10"}`}>
                        <p className="text-xs whitespace-pre-wrap">{message.content}</p>
                        <div className="flex justify-end mt-1 opacity-50">
                          <button onClick={() => copyToClipboard(message.content, message.id)} className="hover:opacity-100 transition">
                            {copiedId === message.id ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                          </button>
                        </div>
                      </div>
                      {message.role === "user" && (
                        <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                
                {isLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/10">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 text-center">
                    <p className="text-red-400 text-xs">{error}</p>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="sticky bottom-4 bg-slate-900/80 backdrop-blur-xl rounded-xl border border-white/10 p-2">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                    placeholder="Ask me anything..."
                    rows={1}
                    className="flex-1 px-3 py-2 text-sm bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none"
                    style={{ minHeight: "38px", maxHeight: "100px" }}
                  />
                  <button
                    onClick={startVoiceInput}
                    className={`p-2 rounded-lg transition-all ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"}`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90 transition disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 text-[9px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5" />
                    <span>AI may make mistakes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                    <span>Powered by Gemini AI</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Analysis Tab */}
          {activeTab === "analysis" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-white font-semibold text-lg">Financial Analysis</h2>
                <select
                  value={analysisPeriod}
                  onChange={(e) => setAnalysisPeriod(e.target.value as any)}
                  className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last 12 Months</option>
                </select>
              </div>

              {analysis ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <p className="text-slate-400 text-sm">Total Income</p>
                      <p className="text-2xl font-bold text-emerald-400">+{formatCurrency(analysis.totalIncome || 0)}</p>
                    </div>
                    <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                      <p className="text-slate-400 text-sm">Total Expense</p>
                      <p className="text-2xl font-bold text-red-400">-{formatCurrency(analysis.totalExpense || 0)}</p>
                    </div>
                    <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <p className="text-slate-400 text-sm">Savings</p>
                      <p className="text-2xl font-bold text-blue-400">{formatCurrency(analysis.savings || 0)}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-white font-semibold mb-2">AI Insights</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{analysis.aiInsights || "No insights available"}</p>
                  </div>

                  {analysis.categorySpending && Object.keys(analysis.categorySpending).length > 0 && (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h3 className="text-white font-semibold mb-3">Category Breakdown</h3>
                      <div className="space-y-2">
                        {Object.entries(analysis.categorySpending).map(([category, amount]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span className="text-slate-400 text-sm">{category}</span>
                            <span className="text-white font-medium">{formatCurrency(amount as number)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/5 rounded-xl">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-slate-400 mt-2">Loading analysis...</p>
                </div>
              )}
            </div>
          )}

          {/* Auto Tag Tab */}
          {activeTab === "autotag" && (
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Transaction Description</label>
                <input
                  type="text"
                  value={tagInput.description}
                  onChange={(e) => setTagInput({ ...tagInput, description: e.target.value })}
                  placeholder="e.g., Dinner at Pizza Hut"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Amount (Optional)</label>
                <input
                  type="number"
                  value={tagInput.amount}
                  onChange={(e) => setTagInput({ ...tagInput, amount: e.target.value })}
                  placeholder="e.g., 500"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={handleAutoTag}
                disabled={isLoading || !tagInput.description}
                className="w-full py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Auto Categorize"}
              </button>

              {tagResult && (
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Category</span>
                    <span className="text-emerald-400 font-bold uppercase">{tagResult.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Confidence</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${tagResult.confidence}%` }} />
                      </div>
                      <span className="text-white text-xs">{tagResult.confidence}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Suggested Tags</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tagResult.tags?.map((tag: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px]">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Budget Recommendation Tab */}
          {activeTab === "budget" && (
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Monthly Income</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">৳</span>
                  <input
                    type="number"
                    value={budgetIncome}
                    onChange={(e) => setBudgetIncome(e.target.value)}
                    placeholder="e.g., 50000"
                    className="w-full pl-8 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <button
                onClick={handleBudgetRecommendation}
                disabled={isLoading || !budgetIncome}
                className="w-full py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Get Budget Recommendation"}
              </button>

              {budgetResult && (
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Monthly Income</span>
                    <span className="text-emerald-400 font-bold">{formatCurrency(budgetResult.monthlyIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Suggested Savings</span>
                    <span className="text-blue-400 font-bold">{formatCurrency(budgetResult.suggestedSavings)}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-slate-400 text-sm mb-2">Recommended Budget</p>
                    {budgetResult.recommendedBudget && typeof budgetResult.recommendedBudget === 'object' ? (
                      <div className="space-y-1">
                        {Object.entries(budgetResult.recommendedBudget).map(([category, amount]) => (
                          <div key={category} className="flex justify-between text-sm">
                            <span className="text-slate-400">{category}</span>
                            <span className="text-white">{formatCurrency(amount as number)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-300 text-sm">{budgetResult.recommendedBudget}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce { animation: bounce 0.6s ease-in-out infinite; }
        textarea::-webkit-scrollbar { width: 3px; }
        textarea::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        textarea::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.5); border-radius: 10px; }
      `}</style>
    </div>
  );
}
