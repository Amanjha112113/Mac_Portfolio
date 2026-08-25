'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { PROJECTS, Project } from '@config/projects.config';
import { 
  ShoppingBag, Compass, Sparkles, Code2, Wrench, LayoutGrid, 
  Search, Star, Download, ExternalLink, ChevronRight, CheckCircle2,
  ShieldCheck, Award, ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import { useWindowStore } from '@/stores/useWindowStore';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'create', label: 'AI & Vision', icon: Sparkles },
  { id: 'develop', label: 'Voice & Agents', icon: Code2 },
  { id: 'categories', label: 'All Projects', icon: LayoutGrid },
];

export default function AppStore() {
  const [activeCategory, setActiveCategory] = useState('discover');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const openApp = useWindowStore((s) => s.openApp);

  let displayedProjects = PROJECTS;
  if (activeCategory === 'create') {
    displayedProjects = PROJECTS.filter(p => p.category.includes('ai-ml') || p.category.includes('computer-vision'));
  } else if (activeCategory === 'develop') {
    displayedProjects = PROJECTS.filter(p => p.category.includes('voice-ai') || p.category.includes('agentic-ai'));
  }

  const heroProject = PROJECTS[3] || PROJECTS[0]; // Aman AI Assistant

  return (
    <div className="flex h-full bg-[#18181b] text-white/90 overflow-hidden font-sans select-none">
      {/* Sidebar */}
      <div className="w-52 bg-[#121214] border-r border-white/10 flex flex-col justify-between p-3 shrink-0">
        <div className="space-y-4">
          <div className="px-3 py-2 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-md">
              <ShoppingBag size={16} />
            </div>
            <span className="font-bold text-sm text-white">App Store</span>
          </div>

          <div className="px-1">
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2.5 py-1.5 border border-white/10 text-xs text-white/40">
              <Search size={13} />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent border-none outline-none text-white text-xs w-full placeholder:text-white/30"
                disabled
              />
            </div>
          </div>

          <nav className="space-y-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedProject(null);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                  activeCategory === cat.id && !selectedProject
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <cat.icon size={15} />
                <span>{cat.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Badge */}
        <div className="p-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
            AJ
          </div>
          <div className="truncate">
            <p className="font-semibold text-xs text-white truncate">Aman Jha</p>
            <p className="text-[10px] text-white/40 truncate">Developer Account</p>
          </div>
        </div>
      </div>

      {/* Main Storefront Area */}
      <div className="flex-1 overflow-y-auto bg-[#1c1c20] p-6 lg:p-8 selectable">
        <AnimatePresence mode="wait">
          {selectedProject ? (
            /* Project Detail Page */
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium mb-4"
              >
                ← Back to Store
              </button>

              <div className="flex items-start gap-6 pb-6 border-b border-white/10">
                <div className="w-28 h-28 rounded-2xl relative overflow-hidden bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-white/10 shadow-xl shrink-0">
                  {selectedProject.imageUrl ? (
                    <Image src={selectedProject.imageUrl} alt={selectedProject.title} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🚀</div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <h1 className="text-2xl font-bold text-white">{selectedProject.title}</h1>
                  <p className="text-xs text-blue-400 font-medium">{selectedProject.category.join(' • ')}</p>
                  <p className="text-xs text-white/60">{selectedProject.shortDescription}</p>

                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href={selectedProject.githubUrl || 'https://github.com'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <span>GET ON GITHUB</span>
                      <ExternalLink size={12} />
                    </a>
                    <div className="flex items-center text-yellow-400 text-xs">
                      <Star size={13} className="fill-yellow-400 mr-1" />
                      <span className="font-bold">5.0</span>
                      <span className="text-white/40 ml-1">(Featured)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Screenshots Gallery */}
              {selectedProject.imageUrl && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Preview</h3>
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                    <Image src={selectedProject.imageUrl} alt="Screenshot" fill className="object-cover" unoptimized />
                  </div>
                </div>
              )}

              {/* Description & Technical Highlights */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Description</h3>
                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">{selectedProject.longDescription}</p>

                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider pt-2">Key Highlights</h3>
                <ul className="space-y-2">
                  {selectedProject.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider pt-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((t) => (
                    <span key={t} className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-xs text-white/80 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* Main Browse Store View */
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {/* Hero Featured App Banner */}
              <div
                onClick={() => setSelectedProject(heroProject)}
                className="group relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900/60 via-purple-900/50 to-pink-900/40 border border-white/15 p-8 shadow-2xl cursor-pointer hover:border-white/30 transition-all"
              >
                <div className="relative z-10 max-w-lg space-y-3">
                  <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider bg-blue-500/20 px-2.5 py-1 rounded-full border border-blue-500/30">
                    Featured Release
                  </span>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">{heroProject.title}</h2>
                  <p className="text-xs text-white/70 leading-relaxed line-clamp-2">{heroProject.shortDescription}</p>

                  <div className="flex items-center gap-3 pt-2">
                    <button className="px-5 py-2 bg-white text-black hover:bg-white/90 rounded-full font-bold text-xs shadow-lg transition-transform group-hover:scale-105">
                      VIEW DETAILS
                    </button>
                    <span className="text-xs text-white/50 font-medium">Realtime WebRTC Agent</span>
                  </div>
                </div>

                {heroProject.imageUrl && (
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-40 group-hover:opacity-60 transition-opacity hidden md:block">
                    <Image src={heroProject.imageUrl} alt="Hero" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>

              {/* Apps Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">All Systems & Applications</h3>
                  <span className="text-xs text-white/40">{displayedProjects.length} Apps</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayedProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center justify-between group shadow-sm hover:shadow-lg"
                    >
                      <div className="flex items-center gap-3.5 truncate">
                        <div className="w-14 h-14 rounded-xl relative overflow-hidden bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-white/10 shrink-0">
                          {project.imageUrl ? (
                            <Image src={project.imageUrl} alt={project.title} fill className="object-cover" unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">⚡</div>
                          )}
                        </div>
                        <div className="truncate">
                          <h4 className="font-bold text-xs text-white group-hover:text-blue-400 transition-colors truncate">
                            {project.title}
                          </h4>
                          <p className="text-[11px] text-white/50 truncate">{project.category[0]}</p>
                          <div className="flex items-center gap-1 text-yellow-400 text-[10px] mt-1">
                            <Star size={10} className="fill-yellow-400" />
                            <span>5.0</span>
                            <span className="text-white/30 ml-1">• {project.year}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (project.id === 'voice-ai-portfolio') {
                            openApp('voice');
                          } else {
                            setSelectedProject(project);
                          }
                        }}
                        className="px-4 py-1.5 bg-white/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-full font-bold text-xs transition-colors shrink-0"
                      >
                        {project.id === 'voice-ai-portfolio' ? 'LAUNCH' : 'GET'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
