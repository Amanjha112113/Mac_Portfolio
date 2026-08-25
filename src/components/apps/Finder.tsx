'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { PROJECTS, getProjectsByCategory, ProjectCategory } from '@config/projects.config';
import { Search, Grid, List, Folder, ChevronRight, ChevronLeft, ChevronDown, Clock, Star, Tag } from 'lucide-react';
import { useWindowStore } from '@/stores/useWindowStore';

type ViewMode = 'grid' | 'list';

const SIDEBAR_ITEMS = [
  { id: 'recent', label: 'Recents', icon: Clock, color: 'text-blue-400' },
  { id: 'featured', label: 'Featured', icon: Star, color: 'text-yellow-400' },
  { id: 'all', label: 'All Projects', icon: Folder, color: 'text-blue-400' },
];

const CATEGORIES: { id: ProjectCategory; label: string }[] = [
  { id: 'voice-ai', label: 'Voice AI' },
  { id: 'agentic-ai', label: 'Agentic AI' },
  { id: 'ai-ml', label: 'AI/ML' },
  { id: 'computer-vision', label: 'Computer Vision' },
  { id: 'data-science', label: 'Data Science' },
  { id: 'nlp', label: 'NLP' },
  { id: 'full-stack', label: 'Full Stack' },
];

export default function Finder() {
  const [selectedSidebar, setSelectedSidebar] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const openApp = useWindowStore((s) => s.openApp);

  let displayedProjects = PROJECTS;
  
  if (selectedSidebar === 'recent') {
    displayedProjects = [...PROJECTS].sort((a, b) => b.year - a.year);
  } else if (selectedSidebar === 'featured') {
    displayedProjects = PROJECTS.filter((p) => p.featured);
  } else if (CATEGORIES.some(c => c.id === selectedSidebar)) {
    displayedProjects = getProjectsByCategory(selectedSidebar as ProjectCategory);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    displayedProjects = displayedProjects.filter(
      p => p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white overflow-hidden rounded-b-xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2a2a2e] border-b border-white/10 shrink-0 h-[52px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-white/10 text-white/40"><ChevronLeft size={18} /></button>
            <button className="p-1 rounded hover:bg-white/10 text-white/40"><ChevronRight size={18} /></button>
          </div>
          <span className="text-[13px] font-semibold text-white/90">
            {SIDEBAR_ITEMS.find(i => i.id === selectedSidebar)?.label || 
             CATEGORIES.find(c => c.id === selectedSidebar)?.label || 'Finder'}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/5 rounded-md p-1 border border-white/10">
            <button 
              className={cn("p-1 rounded-sm", viewMode === 'grid' ? "bg-white/20 text-white" : "text-white/50")}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={14} />
            </button>
            <button 
              className={cn("p-1 rounded-sm", viewMode === 'list' ? "bg-white/20 text-white" : "text-white/50")}
              onClick={() => setViewMode('list')}
            >
              <List size={14} />
            </button>
          </div>
          <div className="flex items-center gap-2 bg-black/20 rounded-md px-2 py-1 border border-white/10 focus-within:ring-1 focus-within:ring-blue-500 w-48">
            <Search size={14} className="text-white/40 shrink-0" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent border-none outline-none text-[12px] text-white/90 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-[#232326] border-r border-white/10 flex flex-col py-3 overflow-y-auto shrink-0">
          <div className="px-3 mb-2 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Favorites</div>
          {SIDEBAR_ITEMS.map((item) => (
            <button 
              key={item.id}
              onClick={() => setSelectedSidebar(item.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 mx-2 rounded-md text-[13px] transition-colors",
                selectedSidebar === item.id ? "bg-blue-500 text-white" : "text-white/70 hover:bg-white/5"
              )}
            >
              <item.icon size={16} className={selectedSidebar === item.id ? "text-white" : item.color} />
              <span>{item.label}</span>
            </button>
          ))}
          
          <div className="px-3 mt-6 mb-2 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Categories</div>
          {CATEGORIES.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setSelectedSidebar(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 mx-2 rounded-md text-[13px] transition-colors",
                selectedSidebar === cat.id ? "bg-blue-500 text-white" : "text-white/70 hover:bg-white/5"
              )}
            >
              <Tag size={14} className={selectedSidebar === cat.id ? "text-white" : "text-white/40"} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-[#1a1a1e] p-6 selectable">
          {displayedProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/40">
              <Folder size={48} className="mb-4 opacity-20" />
              <p>No projects found</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="group flex flex-col bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => openApp('safari')}
                >
                  <div className="h-32 bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-b border-white/10 flex items-center justify-center">
                    <Folder size={40} className="text-blue-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-[14px] font-semibold text-white/90 mb-1 line-clamp-1">{project.title}</h3>
                    <p className="text-[12px] text-white/50 line-clamp-2">{project.shortDescription}</p>
                    <div className="mt-3 flex gap-2">
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/70">{project.year}</span>
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/70">{project.category[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex px-4 py-2 text-[12px] font-semibold text-white/40 border-b border-white/10 uppercase tracking-wider">
                <div className="w-1/3">Name</div>
                <div className="w-1/2">Description</div>
                <div className="w-1/6">Year</div>
              </div>
              {displayedProjects.map((project) => (
                <div 
                  key={project.id}
                  className="flex items-center px-4 py-3 border-b border-white/5 hover:bg-white/5 cursor-pointer text-[13px]"
                  onClick={() => openApp('safari')}
                >
                  <div className="w-1/3 font-medium text-white/90 flex items-center gap-2">
                    <Folder size={16} className="text-blue-400" />
                    <span className="truncate pr-4">{project.title}</span>
                  </div>
                  <div className="w-1/2 text-white/50 truncate pr-4">{project.shortDescription}</div>
                  <div className="w-1/6 text-white/40">{project.year}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
