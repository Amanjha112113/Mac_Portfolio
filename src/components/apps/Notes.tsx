'use client';

import { useState } from 'react';
import { PERSONAL } from '@config/personal.config';
import { cn } from '@/lib/cn';
import { Edit, Trash2, Share, FileText, ChevronLeft, ChevronRight, Lock, CheckCircle2 } from 'lucide-react';

const NOTES = [
  { id: 'bio', title: 'About Aman', preview: 'AI/ML Engineer & Researcher...', date: 'Today' },
  { id: 'skills', title: 'Technical Skills', preview: 'Machine Learning, Deep Learning...', date: 'Yesterday' },
  { id: 'achievements', title: 'Achievements', preview: 'Awards and recognitions...', date: 'Previous 7 Days' },
];

export default function Notes() {
  const [activeNoteId, setActiveNoteId] = useState('bio');

  const activeNote = NOTES.find(n => n.id === activeNoteId);

  return (
    <div className="flex flex-col h-full bg-[#f6f6f6] dark:bg-[#1e1e1e] text-[#1a1a1a] dark:text-white overflow-hidden rounded-b-xl font-sans">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#f0f0f0] dark:bg-[#2a2a2e] border-b border-black/10 dark:border-white/10 shrink-0 h-[52px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-black/40 dark:text-white/40">
              <ChevronLeft size={18} />
            </button>
            <button className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-black/40 dark:text-white/40">
              <ChevronRight size={18} />
            </button>
          </div>
          <button className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-black/40 dark:text-white/40">
            <Trash2 size={16} />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-black/40 dark:text-white/40">
            <Lock size={16} />
          </button>
          <button className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-black/40 dark:text-white/40">
            <Share size={16} />
          </button>
          <button className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-black/40 dark:text-white/40">
            <Edit size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-[#f0f0f0] dark:bg-[#232326] border-r border-black/10 dark:border-white/10 flex flex-col shrink-0">
          <div className="px-4 py-2 text-[11px] font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider">iCloud</div>
          <div className="flex-1 overflow-y-auto">
            {NOTES.map(note => (
              <button 
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={cn(
                  "w-full text-left px-4 py-3 border-b border-black/5 dark:border-white/5 transition-colors",
                  activeNoteId === note.id ? "bg-[#e5b550] dark:bg-[#a67a28] text-white" : "hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                <div className="font-semibold text-[13px] mb-0.5 truncate">{note.title}</div>
                <div className="flex items-center gap-2 text-[12px]">
                  <span className={activeNoteId === note.id ? "text-white/90" : "text-black/60 dark:text-white/60"}>{note.date}</span>
                  <span className={cn("truncate", activeNoteId === note.id ? "text-white/70" : "text-black/40 dark:text-white/40")}>{note.preview}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Note Content */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-[#1a1a1e] p-8 lg:p-12 selectable">
          <div className="max-w-3xl mx-auto">
            <div className="text-[12px] text-center text-black/40 dark:text-white/40 mb-8 font-medium">
              {activeNote?.date} at 9:41 AM
            </div>

            {activeNoteId === 'bio' && (
              <div className="prose dark:prose-invert max-w-none">
                <h1 className="text-3xl font-bold text-black/90 dark:text-white/90 mb-4">{PERSONAL.name}</h1>
                <p className="text-xl text-[#e5b550] dark:text-[#d49a2a] font-medium mb-6">{PERSONAL.title}</p>
                <p className="text-lg leading-relaxed text-black/70 dark:text-white/80 mb-8 whitespace-pre-line">
                  {PERSONAL.bio}
                </p>
                
                <h3 className="text-lg font-bold mt-8 mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-[#e5b550]" /> Contact & Links
                </h3>
                <ul className="space-y-2 text-sm text-black/70 dark:text-white/70">
                  <li><strong>Location:</strong> {PERSONAL.location}</li>
                  <li><strong>Email:</strong> {PERSONAL.email}</li>
                  <li><strong>GitHub:</strong> <a href={PERSONAL.github} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{PERSONAL.githubUsername}</a></li>
                  <li><strong>LinkedIn:</strong> <a href={PERSONAL.linkedin} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Profile</a></li>
                </ul>
              </div>
            )}

            {activeNoteId === 'skills' && (
              <div className="prose dark:prose-invert max-w-none">
                <h1 className="text-3xl font-bold text-black/90 dark:text-white/90 mb-8">Technical Skills</h1>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-[#e5b550]">
                      <CheckCircle2 size={18} /> AI & Machine Learning
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {PERSONAL.skills.ai.map(skill => (
                        <span key={skill} className="bg-black/5 dark:bg-white/10 px-3 py-1.5 rounded-md text-sm">{skill}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-[#e5b550]">
                      <CheckCircle2 size={18} /> Programming Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {PERSONAL.skills.languages.map(skill => (
                        <span key={skill} className="bg-black/5 dark:bg-white/10 px-3 py-1.5 rounded-md text-sm">{skill}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-[#e5b550]">
                      <CheckCircle2 size={18} /> Frameworks & Libraries
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {PERSONAL.skills.frameworks.map(skill => (
                        <span key={skill} className="bg-black/5 dark:bg-white/10 px-3 py-1.5 rounded-md text-sm">{skill}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-[#e5b550]">
                      <CheckCircle2 size={18} /> Tools & Platforms
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {PERSONAL.skills.tools.map(skill => (
                        <span key={skill} className="bg-black/5 dark:bg-white/10 px-3 py-1.5 rounded-md text-sm">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeNoteId === 'achievements' && (
              <div className="prose dark:prose-invert max-w-none">
                <h1 className="text-3xl font-bold text-black/90 dark:text-white/90 mb-8">Achievements & Awards</h1>
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-black/10 dark:before:via-white/10 before:to-transparent">
                  {PERSONAL.achievements.map((achievement, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white dark:border-[#1a1a1e] bg-[#e5b550] dark:bg-[#d49a2a] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow absolute left-0 md:left-1/2 -translate-x-1/2 translate-y-1"></div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] ml-8 md:ml-0 bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-sm text-black/90 dark:text-white/90">{achievement.title}</h4>
                          <span className="text-[11px] font-medium text-[#e5b550] dark:text-[#d49a2a] bg-[#e5b550]/10 dark:bg-[#d49a2a]/20 px-2 py-0.5 rounded-full">{achievement.year}</span>
                        </div>
                        <p className="text-sm text-black/60 dark:text-white/60">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
