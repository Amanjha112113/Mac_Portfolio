'use client';

import { useState } from 'react';
import { PERSONAL } from '@config/personal.config';
import { PROJECTS } from '@config/projects.config';
import { cn } from '@/lib/cn';
import { 
  Settings, User, FileText, GraduationCap, Briefcase, 
  Monitor, Info, Download, ExternalLink, ChevronRight, Phone, Mail, MapPin 
} from 'lucide-react';
import Image from 'next/image';
import { useWindowStore } from '@/stores/useWindowStore';

const SETTINGS_SECTIONS = [
  { id: 'general', label: 'General / Profile', icon: User, color: 'bg-blue-500' },
  { id: 'wallpaper', label: 'Desktop & Wallpaper', icon: Monitor, color: 'bg-teal-500' },
  { id: 'resume', label: 'Resume / CV', icon: FileText, color: 'bg-red-500' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: 'bg-green-500' },
  { id: 'experience', label: 'Work Experience', icon: Briefcase, color: 'bg-amber-500' },
  { id: 'system', label: 'System Report', icon: Info, color: 'bg-gray-500' },
];

export default function SystemSettings() {
  const [activeSection, setActiveSection] = useState('general');
  const { wallpaper: currentWallpaper, setWallpaper } = useWindowStore();

  return (
    <div className="flex h-full bg-[#1e1e1e] text-white overflow-hidden rounded-b-xl select-none font-sans">
      {/* Sidebar */}
      <div className="w-56 bg-[#232326] border-r border-white/10 flex flex-col py-4 shrink-0 overflow-y-auto">
        <div className="px-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow">
            AJ
          </div>
          <div>
            <div className="font-semibold text-[13px]">{PERSONAL.name}</div>
            <div className="text-[11px] text-white/50">Apple ID Simulator</div>
          </div>
        </div>

        <div className="px-3 mb-2">
          <div className="w-full bg-white/5 rounded-lg px-2.5 py-1 border border-white/10 flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Search Settings" 
              className="bg-transparent border-none outline-none text-[12px] text-white/70 placeholder:text-white/30 w-full"
              disabled
            />
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 mt-2">
          {SETTINGS_SECTIONS.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 text-left text-[13px] transition-colors",
                activeSection === sec.id ? "bg-blue-500 text-white" : "text-white/80 hover:bg-white/5"
              )}
            >
              <div className={cn("p-1 rounded text-white shrink-0", sec.color)}>
                <sec.icon size={14} />
              </div>
              <span className="flex-1 truncate">{sec.label}</span>
              <ChevronRight size={12} className="opacity-30" />
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 bg-[#1a1a1e] overflow-y-auto p-8 selectable">
        {activeSection === 'general' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-xl font-bold border-b border-white/10 pb-3">About Aman Jha</h1>
            
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#3478F6] to-[#7C4DFF] flex items-center justify-center text-4xl text-white shadow-lg shrink-0">
                👨‍💻
              </div>
              <div className="space-y-3 text-center md:text-left">
                <div>
                  <h2 className="text-lg font-bold">{PERSONAL.name}</h2>
                  <p className="text-sm text-[#3478F6] font-medium">{PERSONAL.title}</p>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{PERSONAL.tagline}</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl border border-white/10 divide-y divide-white/5">
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm text-white/60">Location</span>
                <span className="text-sm font-medium flex items-center gap-1.5"><MapPin size={14} className="text-[#3478F6]" /> {PERSONAL.location}</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm text-white/60">Email</span>
                <span className="text-sm font-medium flex items-center gap-1.5"><Mail size={14} className="text-[#3478F6]" /> <a href={`mailto:${PERSONAL.email}`} className="hover:underline">{PERSONAL.email}</a></span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm text-white/60">GitHub</span>
                <span className="text-sm font-medium flex items-center gap-1.5"><ExternalLink size={14} className="text-[#3478F6]" /> <a href={PERSONAL.github} target="_blank" rel="noreferrer" className="hover:underline">{PERSONAL.githubUsername}</a></span>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'wallpaper' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-xl font-bold border-b border-white/10 pb-3">Desktop Wallpaper</h1>
            <p className="text-xs text-white/50">Select a backdrop style to personalize your interactive macOS desktop shell.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { name: 'macOS Sonoma', value: '/wallpaper.jpg', style: { backgroundImage: "url('/wallpaper.jpg')", backgroundSize: 'cover' } },
                { name: 'Aurora Blue', value: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)', style: { background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)' } },
                { name: 'Twilight Orange', value: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)', style: { background: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)' } },
                { name: 'Forest Mint', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', style: { background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' } },
                { name: 'Solid Charcoal', value: '#121214', style: { background: '#121214' } }
              ].map((wp) => (
                <button
                  key={wp.name}
                  onClick={() => setWallpaper(wp.value)}
                  className={cn(
                    "flex flex-col rounded-xl overflow-hidden border transition-all text-left bg-white/5",
                    currentWallpaper === wp.value ? "border-blue-500 ring-2 ring-blue-500/20" : "border-white/10 hover:border-white/20"
                  )}
                >
                  <div className="h-24 w-full" style={wp.style} />
                  <div className="p-3">
                    <span className="text-[12px] font-semibold text-white/90">{wp.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'resume' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h1 className="text-xl font-bold">Resume / Curriculum Vitae</h1>
              <a 
                href={PERSONAL.resumeUrl} 
                download
                className="flex items-center gap-2 bg-[#3478F6] hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors shadow"
              >
                <Download size={14} /> Download PDF
              </a>
            </div>

            <div className="bg-white/5 p-8 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="p-4 bg-red-500/10 rounded-full text-red-500 mb-2">
                <FileText size={40} />
              </div>
              <h3 className="font-bold text-base">Aman_Jha_Resume.pdf</h3>
              <p className="text-xs text-white/50 max-w-sm">
                Get the full, print-ready PDF resume containing complete details of academic highlights, certifications, and technical projects.
              </p>
              <a 
                href={PERSONAL.resumeUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-[#3478F6] hover:underline font-semibold flex items-center gap-1"
              >
                View PDF in Safari <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}

        {activeSection === 'education' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-xl font-bold border-b border-white/10 pb-3">Education</h1>
            
            {PERSONAL.education.map((edu, idx) => (
              <div key={idx} className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-white/95">{edu.degree}</h3>
                    <p className="text-sm text-[#3478F6] font-medium">{edu.field}</p>
                    <p className="text-xs text-white/50">{edu.institution} · {edu.location}</p>
                  </div>
                  <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-white/80 font-medium">
                    {edu.startYear} - {edu.endYear}
                  </span>
                </div>
                {edu.gpa && (
                  <div className="text-xs text-emerald-400 font-semibold bg-emerald-400/10 px-2.5 py-1 rounded w-fit">
                    GPA: {edu.gpa}
                  </div>
                )}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <h4 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Highlights</h4>
                  <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                    {edu.highlights.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'experience' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-xl font-bold border-b border-white/10 pb-3">Work Experience</h1>
            
            {PERSONAL.experience.map((exp, idx) => (
              <div key={idx} className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-white/95">{exp.title}</h3>
                    <p className="text-sm text-[#3478F6] font-medium">{exp.company}</p>
                    <p className="text-xs text-white/50">{exp.location}</p>
                  </div>
                  <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-white/80 font-medium">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <ul className="list-disc list-inside text-sm text-white/70 space-y-1.5">
                    {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {exp.technologies.map(tech => (
                    <span key={tech} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[11px] text-white/60">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'system' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-xl font-bold border-b border-white/10 pb-3">System Report</h1>
            
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden divide-y divide-white/5">
              <div className="p-4 flex justify-between text-sm">
                <span className="text-white/60">Portfolio Runtime</span>
                <span className="font-semibold">Next.js 16.3.2 (Webpack Core)</span>
              </div>
              <div className="p-4 flex justify-between text-sm">
                <span className="text-white/60">Styling Engine</span>
                <span className="font-semibold">Tailwind CSS v4</span>
              </div>
              <div className="p-4 flex justify-between text-sm">
                <span className="text-white/60">Voice transport</span>
                <span className="font-semibold text-emerald-400">WebRTC DataChannel / Audio stream ready</span>
              </div>
              <div className="p-4 flex justify-between text-sm">
                <span className="text-white/60">State management</span>
                <span className="font-semibold">Zustand Stores</span>
              </div>
              <div className="p-4 flex justify-between text-sm">
                <span className="text-white/60">Total projects index</span>
                <span className="font-semibold">{PROJECTS.length} Systems Registered</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
