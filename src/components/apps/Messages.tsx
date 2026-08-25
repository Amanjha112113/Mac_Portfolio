'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { PERSONAL } from '@config/personal.config';
import { 
  Send, Video, Phone, Info, Search, Sparkles, 
  Smile, Paperclip, CheckCheck, Circle, Clock
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'aman' | 'user';
  text: string;
  timestamp: string;
  status?: 'Sent' | 'Delivered' | 'Read';
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: 'aman',
    text: "Hey! 👋 Welcome to my interactive macOS portfolio.",
    timestamp: '9:41 AM',
    status: 'Read',
  },
  {
    id: '2',
    sender: 'aman',
    text: `I'm an AI/ML engineer specialized in Voice AI, Computer Vision, and Agentic Systems. Drop a message below to connect or inquire about opportunities!`,
    timestamp: '9:42 AM',
    status: 'Read',
  },
];

export default function Messages() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `msg-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: time,
      status: 'Delivered',
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Call /api/contact in the background
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      setTimeout(() => {
        setIsTyping(false);
        const replyMsg: ChatMessage = {
          id: `reply-${Date.now()}`,
          sender: 'aman',
          text: data.reply || "Thanks for your message! I've noted it down.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Delivered',
        };
        setMessages(prev => [...prev, replyMsg]);
      }, 1200);
    } catch {
      setTimeout(() => {
        setIsTyping(false);
        const fallbackMsg: ChatMessage = {
          id: `reply-${Date.now()}`,
          sender: 'aman',
          text: "Thanks for reaching out! You can also email me directly at " + PERSONAL.email,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Delivered',
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }, 1000);
    }
  };

  return (
    <div className="flex h-full bg-[#1e1e24] text-white/90 overflow-hidden font-sans select-none">
      {/* Sidebar: Conversation List */}
      <div className="w-64 bg-[#141418] border-r border-white/10 flex flex-col shrink-0">
        {/* Search */}
        <div className="p-3 border-b border-white/5">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2.5 py-1.5 border border-white/10 text-xs">
            <Search size={13} className="text-white/40" />
            <input
              type="text"
              placeholder="Search Messages"
              className="bg-transparent border-none outline-none text-white/90 placeholder:text-white/30 text-xs w-full"
              disabled
            />
          </div>
        </div>

        {/* Pinned Contacts */}
        <div className="p-3 border-b border-white/5 flex justify-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md text-sm border-2 border-blue-400/40">
                AJ
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#141418]" />
            </div>
            <span className="text-[11px] font-medium text-white/90">Aman Jha</span>
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto p-1 space-y-1">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-semibold text-xs shrink-0 text-white shadow">
              AJ
            </div>
            <div className="truncate flex-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-xs text-white">Aman Jha</span>
                <span className="text-[10px] text-white/40">9:42 AM</span>
              </div>
              <p className="text-[11px] text-white/60 truncate mt-0.5">
                {messages[messages.length - 1]?.text || 'No messages'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Pane */}
      <div className="flex-1 flex flex-col bg-[#1e1e24] overflow-hidden">
        {/* Chat Header */}
        <div className="h-14 bg-[#23232a] border-b border-white/10 px-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow">
              AJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white">Aman Jha</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">iMessage</span>
              </div>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                <Circle size={6} className="fill-emerald-400" /> Active Now
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white/60">
            <button className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors" title="FaceTime">
              <Video size={16} />
            </button>
            <button className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors" title="Call">
              <Phone size={15} />
            </button>
            <button className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors" title="Details">
              <Info size={16} />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 selectable">
          <div className="text-center">
            <span className="text-[10px] text-white/30 font-medium uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-full">
              Today 9:41 AM
            </span>
          </div>

          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={cn("flex flex-col max-w-[70%]", isUser ? "ml-auto items-end" : "mr-auto items-start")}
              >
                <div
                  className={cn(
                    "px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-md",
                    isUser
                      ? "bg-[#0B84FE] text-white rounded-br-xs font-medium"
                      : "bg-[#2c2c34] text-white/95 rounded-bl-xs border border-white/5"
                  )}
                >
                  {msg.text}
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-white/40 px-1">
                  <span>{msg.timestamp}</span>
                  {isUser && <span>• {msg.status || 'Delivered'}</span>}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="mr-auto flex items-center gap-1 bg-[#2c2c34] px-4 py-3 rounded-2xl rounded-bl-xs border border-white/5 w-16">
              <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-[#23232a] border-t border-white/10 shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-[#17171d] rounded-full px-4 py-2 border border-white/10 focus-within:border-blue-500 transition-colors shadow-inner">
              <input
                type="text"
                placeholder="iMessage"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-xs text-white placeholder:text-white/30"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-transform shrink-0",
                  inputText.trim() ? "bg-[#0B84FE] text-white hover:scale-105" : "bg-white/10 text-white/30 cursor-not-allowed"
                )}
              >
                <Send size={12} className="ml-0.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
