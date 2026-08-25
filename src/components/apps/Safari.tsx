'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { PERSONAL } from '@config/personal.config';
import { PROJECTS } from '@config/projects.config';
import { 
  ChevronLeft, ChevronRight, RotateCw, Share2, Plus, 
  ShieldCheck, ExternalLink, Globe, Search, BookOpen, Star,
  Compass, LayoutGrid, ArrowUpRight, Lock, EyeOff
} from 'lucide-react';
import { Icon } from '@iconify/react';

interface Tab {
  id: string;
  title: string;
  url: string;
  isCustomUrl?: boolean;
}

const FAVORITES = [
  { title: 'GitHub', subtitle: 'github.com', icon: 'mdi:github', color: 'bg-zinc-800', url: PERSONAL.github },
  { title: 'LinkedIn', subtitle: 'linkedin.com', icon: 'mdi:linkedin', color: 'bg-[#0077B5]', url: PERSONAL.linkedin },
  { title: 'Aman AI', subtitle: 'Voice Assistant', icon: 'ri:sparkles-fill', color: 'bg-purple-600', url: 'https://amanjha.dev/voice' },
  { title: 'PyTorch Docs', subtitle: 'pytorch.org', icon: 'simple-icons:pytorch', color: 'bg-[#EE4C2C]', url: 'https://pytorch.org' },
  { title: 'FastAPI', subtitle: 'fastapi.tiangolo.com', icon: 'simple-icons:fastapi', color: 'bg-[#009688]', url: 'https://fastapi.tiangolo.com' },
  { title: 'Next.js', subtitle: 'nextjs.org', icon: 'simple-icons:nextdotjs', color: 'bg-black', url: 'https://nextjs.org' },
  { title: 'Hugging Face', subtitle: 'huggingface.co', icon: 'simple-icons:huggingface', color: 'bg-[#FFD21E] text-black', url: 'https://huggingface.co' },
  { title: 'ArXiv AI', subtitle: 'arxiv.org', icon: 'simple-icons:arxiv', color: 'bg-[#B31B1B]', url: 'https://arxiv.org/list/cs.AI/recent' },
];

export default function Safari() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'start', title: 'Start Page', url: 'safari://start-page' },
  ]);
  const [activeTabId, setActiveTabId] = useState('start');
  const [urlInput, setUrlInput] = useState('safari://start-page');
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivacyReport, setShowPrivacyReport] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const handleNavigate = (targetUrl: string, title?: string) => {
    setIsLoading(true);
    let finalUrl = targetUrl;
    if (!targetUrl.startsWith('safari://') && !targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      finalUrl = `https://${targetUrl}`;
    }
    
    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        return {
          ...t,
          url: finalUrl,
          title: title || (finalUrl === 'safari://start-page' ? 'Start Page' : new URL(finalUrl.startsWith('safari://') ? 'https://apple.com' : finalUrl).hostname),
          isCustomUrl: !finalUrl.startsWith('safari://')
        };
      }
      return t;
    }));
    setUrlInput(finalUrl);
    setTimeout(() => setIsLoading(false), 400);
  };

  const handleAddTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab: Tab = { id: newId, title: 'Start Page', url: 'safari://start-page' };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
    setUrlInput('safari://start-page');
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const remainingTabs = tabs.filter(t => t.id !== tabId);
    setTabs(remainingTabs);
    if (activeTabId === tabId) {
      const nextTab = remainingTabs[remainingTabs.length - 1];
      setActiveTabId(nextTab.id);
      setUrlInput(nextTab.url);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e22] text-white/90 overflow-hidden font-sans select-none">
      {/* Safari Window Header & Tab Bar */}
      <div className="bg-[#2a2a2f] border-b border-white/10 shrink-0 pt-2 px-3 flex flex-col gap-2">
        {/* Tab strip */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => {
                setActiveTabId(tab.id);
                setUrlInput(tab.url);
              }}
              className={cn(
                "group relative flex items-center justify-between gap-2 px-3 py-1.5 rounded-t-lg text-xs max-w-[200px] min-w-[120px] transition-all cursor-pointer border-t border-x",
                activeTabId === tab.id 
                  ? "bg-[#1e1e22] text-white border-white/15 font-medium shadow-sm" 
                  : "bg-transparent text-white/50 hover:bg-white/5 border-transparent"
              )}
            >
              <div className="flex items-center gap-1.5 truncate">
                <Globe size={12} className={activeTabId === tab.id ? "text-blue-400" : "text-white/40"} />
                <span className="truncate">{tab.title}</span>
              </div>
              {tabs.length > 1 && (
                <button 
                  onClick={(e) => handleCloseTab(e, tab.id)}
                  className="opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded p-0.5 text-white/60 transition-opacity"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button 
            onClick={handleAddTab}
            className="p-1 hover:bg-white/10 text-white/50 hover:text-white rounded-md transition-colors"
            title="New Tab"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Toolbar with Navigation & Smart Search field */}
        <div className="flex items-center gap-3 pb-2">
          <div className="flex items-center gap-1 text-white/70">
            <button 
              onClick={() => handleNavigate('safari://start-page')}
              className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="Back"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              className="p-1.5 rounded-md hover:bg-white/10 text-white/30 cursor-not-allowed"
              title="Forward"
            >
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => handleNavigate(activeTab.url)}
              className={cn("p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors", isLoading && "animate-spin")}
              title="Reload"
            >
              <RotateCw size={14} />
            </button>
          </div>

          {/* Smart Address / Search Field */}
          <div className="flex-1 relative flex items-center">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleNavigate(urlInput);
              }}
              className="w-full flex items-center bg-black/40 hover:bg-black/60 focus-within:bg-black/70 rounded-lg px-3 py-1.5 border border-white/10 focus-within:border-blue-500 transition-all text-xs shadow-inner"
            >
              <div className="flex items-center gap-1.5 text-white/40 mr-2 shrink-0">
                {activeTab.url.startsWith('safari://') ? (
                  <Compass size={13} className="text-blue-400" />
                ) : (
                  <Lock size={12} className="text-emerald-400" />
                )}
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Search or enter website name"
                className="w-full bg-transparent border-none outline-none text-white/90 text-xs font-mono placeholder:text-white/30"
              />
              <button 
                type="button" 
                onClick={() => setShowPrivacyReport(!showPrivacyReport)}
                className="p-1 rounded text-white/40 hover:text-white/80 transition-colors"
                title="Privacy Report"
              >
                <ShieldCheck size={14} className="text-emerald-400" />
              </button>
            </form>
            {isLoading && (
              <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-blue-500 animate-pulse rounded-full" />
            )}
          </div>

          <div className="flex items-center gap-1 text-white/60">
            <button 
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(activeTab.url);
                  alert('URL copied to clipboard!');
                }
              }}
              className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="Share"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Safari Viewport */}
      <div className="flex-1 overflow-y-auto relative bg-[#18181b] selectable">
        {activeTab.url === 'safari://start-page' ? (
          /* Start Page View */
          <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
            {/* Favorites Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star size={16} className="text-yellow-400" />
                <h2 className="text-sm font-semibold text-white/90">Favorites</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                {FAVORITES.map((fav, i) => (
                  <div
                    key={i}
                    onClick={() => handleNavigate(fav.url, fav.title)}
                    className="group flex flex-col items-center gap-2 p-2.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform",
                      fav.color
                    )}>
                      <Icon icon={fav.icon} className="text-2xl text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-white/90 truncate max-w-[80px]">{fav.title}</p>
                      <p className="text-[10px] text-white/40 truncate max-w-[80px]">{fav.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Report Summary Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-emerald-900/20 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white/90">Intelligent Tracking Prevention</h3>
                  <p className="text-xs text-white/50">In the last 30 days, Safari prevented 48 trackers from profiling you across websites.</p>
                </div>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 font-medium">
                100% Protected
              </span>
            </div>

            {/* Reading List & Featured Work */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={16} className="text-blue-400" />
                <h2 className="text-sm font-semibold text-white/90">Aman's Featured Systems</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROJECTS.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => handleNavigate(proj.githubUrl || 'https://github.com', proj.title)}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex justify-between items-start group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white/90 group-hover:text-blue-400 transition-colors">{proj.title}</span>
                        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 font-medium">{proj.year}</span>
                      </div>
                      <p className="text-xs text-white/60 line-clamp-2">{proj.shortDescription}</p>
                      <div className="flex gap-1.5 pt-1">
                        {proj.technologies.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ArrowUpRight size={16} className="text-white/40 group-hover:text-white transition-colors shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Live Web or Web Proxy View */
          <div className="w-full h-full flex flex-col items-center justify-between p-6">
            <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-4 my-auto">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
                <Globe size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white/90">{activeTab.title}</h3>
                <p className="text-xs text-white/50 font-mono mt-1">{activeTab.url}</p>
              </div>
              <p className="text-sm text-white/70 max-w-md mx-auto">
                Direct cross-origin browser embedding for this destination is securely contained. You can launch this site in an external window or browse the portfolio tabs.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <a
                  href={activeTab.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-colors"
                >
                  <span>Open in External Browser</span>
                  <ExternalLink size={13} />
                </a>
                <button
                  onClick={() => handleNavigate('safari://start-page')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white/80 rounded-xl text-xs font-semibold transition-colors"
                >
                  Return to Start Page
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
