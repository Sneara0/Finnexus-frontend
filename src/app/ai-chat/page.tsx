
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Bot, User, Sparkles, Trash2, 
  Loader2, Copy, Check, AlertCircle,
  Mic, MicOff, Zap, Brain, MessageSquare, Plus,
  TrendingUp, Tag, FileText, BarChart3, Lightbulb,
  X, Wallet, Target, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AIService from "../services/ai.service";


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

interface Recommendation {
  title: string;
  description: string;
  icon: string;
  action: string;
}

export default function AIChatPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "content" | "analysis" | "tags">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [tagResult, setTagResult] = useState<any>(null);
  const [tagInput, setTagInput] = useState({ description: "", amount: "" });
  const [contentType, setContentType] = useState<"description" | "summary" | "blog" | "caption">("description");
  const [contentTopic, setContentTopic] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [showSessionSidebar, setShowSessionSidebar] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load all data on page load
  useEffect(() => {
    // Load or create session
    const savedSessionId = localStorage.getItem("chatSessionId");
    if (savedSessionId) {
      setSessionId(savedSessionId);
    } else {
      const newId = AIService.createNewSession();
      setSessionId(newId);
    }

    loadSessions();
    loadRecommendations();
    loadAnalysis();

    // Load saved messages
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {}
    }

    // Voice recognition setup
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
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat sessions using Service
  const loadSessions = async () => {
    try {
      const response = await AIService.getChatSessions();
      if (response.success) {
        setSessions(response.data.sessions);
      }
    } catch (error) {
      console.error("Failed to load sessions");
    }
  };

  // Load recommendations using Service
  const loadRecommendations = async () => {
    try {
      const response = await AIService.getRecommendations(4);
      if (response.success) {
        setRecommendations(response.data.recommendations);
      }
    } catch (error) {
      console.error("Failed to load recommendations");
    }
  };

  // Load analysis using Service
  const loadAnalysis = async () => {
    try {
      const response = await AIService.getFinancialAnalysis("month");
      if (response.success) {
        setAnalysis(response.data);
      }
    } catch (error) {
      console.error("Failed to load analysis");
    }
  };

  // Load chat history using Service
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
    } catch (error) {
      console.error("Failed to load chat history");
    } finally {
      setIsLoading(false);
    }
  };

  // Send message using Service
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

  // Generate content using Service
  const handleGenerateContent = async () => {
    if (!contentTopic.trim()) return;
    setIsLoading(true);
    setGeneratedContent("");
    try {
      const response = await AIService.generateContent({
        type: contentType,
        topic: contentTopic,
        tone: "professional",
        length: "medium"
      });
      if (response.success) {
        setGeneratedContent(response.data.content);
      }
    } catch (error) {
      setError("Failed to generate content");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto tag using Service
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
    } catch (error) {
      setError("Failed to categorize");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete session using Service
  const handleDeleteSession = async (sessionId: string) => {
    if (confirm("Delete this conversation?")) {
      try {
        await AIService.deleteSession(sessionId);
        loadSessions();
        if (selectedSession === sessionId) {
          handleNewChat();
        }
      } catch (error) {
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
    localStorage.removeItem("chatMessages");
    loadSessions();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startVoiceInput = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
              onClick={() => setShowSessionSidebar(!showSessionSidebar)}
              className="lg:hidden p-2 rounded-lg bg-white/5 text-slate-400"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">AI Assistant</h1>
              <p className="text-slate-400 text-[10px]">6-in-1 AI Features</p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === "chat" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-white"}`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === "content" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-white"}`}
            >
              📝 Content
            </button>
            <button
              onClick={() => setActiveTab("analysis")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === "analysis" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-white"}`}
            >
              📊 Analysis
            </button>
            <button
              onClick={() => setActiveTab("tags")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === "tags" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-white"}`}
            >
              🏷️ Auto Tag
            </button>
            <button onClick={handleNewChat} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition" title="New Chat">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        
        {/* Sessions Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ${showSessionSidebar ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:block`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm">Conversations</h3>
              <button onClick={() => setShowSessionSidebar(false)} className="lg:hidden text-slate-400">
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
          
          {/* AI Recommendations Section */}
          {activeTab === "chat" && recommendations.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <h3 className="text-white font-semibold text-sm">AI Smart Recommendations</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition">
                    <h4 className="text-white font-medium text-xs">{rec.title}</h4>
                    <p className="text-slate-400 text-[10px] mt-1">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Section */}
          {activeTab === "analysis" && analysis && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-xl border border-white/10">
                  <h4 className="text-white font-semibold text-sm mb-2">Spending Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-xs">Income</span>
                      <span className="text-emerald-400 text-sm font-semibold">₿{analysis.totalIncome?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-xs">Expense</span>
                      <span className="text-red-400 text-sm font-semibold">₿{analysis.totalExpense?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-xs">Savings</span>
                      <span className="text-cyan-400 text-sm font-semibold">₿{analysis.savings?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-white/10">
                  <h4 className="text-white font-semibold text-sm mb-2">AI Insights</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">{analysis.aiInsights}</p>
                </div>
              </div>
            </div>
          )}

          {/* Content Generator Section */}
          {activeTab === "content" && (
            <div className="mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Content Type</label>
                    <div className="flex gap-1 flex-wrap">
                      {(["description", "summary", "blog", "caption"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setContentType(type)}
                          className={`px-3 py-1 rounded-lg text-xs capitalize transition ${contentType === type ? "bg-emerald-500 text-white" : "bg-white/5 text-slate-400 hover:text-white"}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Topic</label>
                    <textarea
                      value={contentTopic}
                      onChange={(e) => setContentTopic(e.target.value)}
                      placeholder="Enter your topic..."
                      rows={2}
                      className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                  <button onClick={handleGenerateContent} disabled={isLoading || !contentTopic} className="w-full py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white text-sm font-medium">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Generate Content"}
                  </button>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-semibold text-sm">Generated Content</h4>
                    {generatedContent && (
                      <button onClick={() => copyToClipboard(generatedContent, "content")} className="text-slate-400 hover:text-white">
                        {copiedId === "content" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                  {generatedContent ? (
                    <p className="text-slate-300 text-xs whitespace-pre-wrap">{generatedContent}</p>
                  ) : (
                    <p className="text-slate-500 text-xs text-center py-6">Generated content will appear here</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Auto Tag Section */}
          {activeTab === "tags" && (
            <div className="mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <input
                    type="text"
                    value={tagInput.description}
                    onChange={(e) => setTagInput({ ...tagInput, description: e.target.value })}
                    placeholder="Transaction description (e.g., Dinner at Pizza Hut)"
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                  <input
                    type="number"
                    value={tagInput.amount}
                    onChange={(e) => setTagInput({ ...tagInput, amount: e.target.value })}
                    placeholder="Amount (optional)"
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                  <button onClick={handleAutoTag} disabled={isLoading || !tagInput.description} className="w-full py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white text-sm font-medium">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Auto Categorize"}
                  </button>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  {tagResult ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-xs">Category</span>
                        <span className="text-emerald-400 font-bold text-sm uppercase">{tagResult.category}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block mb-1">Confidence</span>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${tagResult.confidence}%` }} />
                          </div>
                          <span className="text-white text-xs">{tagResult.confidence}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block mb-1">Suggested Tags</span>
                        <div className="flex flex-wrap gap-1">
                          {tagResult.tags?.map((tag: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px]">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-xs text-center py-6">Enter transaction details to get AI-powered categorization</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages Section */}
          {activeTab === "chat" && (
            <>
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
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
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
                    </motion.div>
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
                    onKeyDown={handleKeyPress}
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
                    <span>6 AI Features • Gemini Pro</span>
                  </div>
                </div>
              </div>
            </>
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
