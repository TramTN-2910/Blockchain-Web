'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  RotateCcw,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';
import { Mascot } from 'page-mascot';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  provider?: string;
  model?: string;
}

const SUGGESTED_PROMPTS = [
  '⚡ SHA-256 tạo ra mã băm như thế nào?',
  '⛏️ Tại sao thợ đào phải tìm Nonce trong Proof of Work?',
  '🔐 Chữ ký số RSA bảo vệ giao dịch ra sao?',
  '🌲 Cây Merkle giúp xác thực giao dịch nhanh thế nào?',
  '🛡️ Hiệu ứng Tuyết lở (Avalanche Effect) là gì?',
  '⛓️ Vì sao chuỗi khối không thể bị sửa đổi dữ liệu?',
];

export default function FloatingChatbot() {
  const pathname = usePathname();

  // Do NOT render chatbot on any admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Xin chào! Tôi là **HubBlock AI** 🤖✨\n\nTôi hỗ trợ giải đáp nhanh & trọng tâm về **SHA-256, Proof of Work, RSA, Cây Merkle và Blockchain**. Bạn cần hỏi gì?`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Send message history to /api/chat
      const apiMessages = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          provider: data.provider,
          model: data.model,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Không nhận được phản hồi từ AI.');
      }
    } catch (err: any) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Đã xảy ra lỗi:** ${err?.message || 'Không thể kết nối với máy chủ AI. Vui lòng thử lại sau.'}`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Cuộc trò chuyện đã được làm mới! Bạn muốn tìm hiểu kiến thức Blockchain nào tiếp theo?`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Floating Action Otter Mascot Trigger (No border, no tooltip) */}
      <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative cursor-pointer select-none"
            >
              {/* Mascot component - stand free without circular border */}
              <div className="relative filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]">
                <Mascot
                  directions="/mascots/otter-directions.webp"
                  reactions="/mascots/otter-reactions.webp"
                  size={115}
                  label="HubBlock Otter AI Mascot"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Window Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[430px] h-[580px] max-h-[85vh] rounded-3xl bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-2xl border border-indigo-200/80 dark:border-slate-800 shadow-2xl shadow-indigo-950/20 dark:shadow-black/70 flex flex-col overflow-hidden"
          >
            {/* Header (No Avatar & No Groq LPU badge) */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-between flex-shrink-0 shadow-md">
              <div className="flex items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold tracking-tight">HubBlock AI</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-indigo-100/90 font-medium mt-0.5">
                    Trợ lý Mật mã học & Blockchain
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Làm mới cuộc trò chuyện"
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Thu nhỏ khung chat"
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body with Markdown Rendering */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs no-scrollbar bg-slate-50/50 dark:bg-slate-900/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl p-3.5 relative group shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-sm'
                    }`}
                  >
                    {/* Message text with Markdown rendering */}
                    <div className="leading-relaxed break-words">
                      {msg.role === 'user' ? (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      ) : (
                        <div className="text-xs text-slate-800 dark:text-slate-100 space-y-2 [&_p]:leading-relaxed [&_strong]:font-bold [&_strong]:text-indigo-600 dark:[&_strong]:text-indigo-300 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-1 [&_code]:bg-slate-100 dark:[&_code]:bg-slate-700/80 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-[11px] [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-2.5 [&_pre]:rounded-xl [&_pre]:overflow-x-auto">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>

                    {/* Copy Button on Assistant Message */}
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="absolute top-2 right-2 p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 dark:bg-slate-700"
                        title="Sao chép câu trả lời"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 px-1 mt-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Typing / Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3 max-w-[130px]">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[11px] font-medium ml-1">AI trả lời...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer with Sticky Horizontal Suggestion Chips */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex-shrink-0 space-y-2.5">
              {/* Horizontal Scrollable Suggestions Row */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 select-none -mx-1 px-1">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt.replace(/^[^\s]+\s/, ''))}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 text-[11px] font-medium transition-all shadow-sm hover:scale-[1.02] whitespace-nowrap active:scale-95"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Text Input Row */}
              <div className="relative flex items-center gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Hỏi về SHA-256, PoW, RSA, Blockchain..."
                  rows={1}
                  className="flex-1 max-h-24 resize-none px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-sans shadow-inner"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all shadow-md ${
                    input.trim() && !isLoading
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 active:scale-95 shadow-indigo-500/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                  title="Gửi tin nhắn"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span>Nhấn Enter để gửi, Shift+Enter để xuống dòng</span>
                <span className="flex items-center gap-1 text-indigo-500 font-medium">
                  <ShieldCheck className="w-3 h-3" /> Blockchain Knowledge
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
