'use client';

import { ExternalLink, Code2, Users, FileText, Mic } from 'lucide-react';
import { PERSONAL } from '@config/personal.config';
import { FEATURED_PROJECTS } from '@config/projects.config';
import { cn } from '@/lib/cn';

/**
 * MobileFallback — shown on small screens (< 768px) where the desktop
 * environment doesn't make sense. Provides a clean, responsive portfolio.
 */
export function MobileFallback() {
  return (
    <div
      className={cn(
        'min-h-dvh flex flex-col',
        'bg-gradient-to-br from-[hsl(220,25%,8%)] via-[hsl(240,20%,10%)] to-[hsl(220,25%,8%)]',
        'text-white px-6 py-8',
        'overflow-y-auto',
      )}
    >
      {/* Header */}
      <header className="text-center mb-10 pt-4">
        {/* Avatar placeholder */}
        <div
          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
          style={{
            background: 'linear-gradient(135deg, hsl(212,100%,50%), hsl(270,80%,60%))',
            boxShadow: '0 0 32px hsla(212,100%,50%,0.3)',
          }}
        >
          AJ
        </div>

        <h1 className="text-2xl font-bold text-white mb-1">{PERSONAL.name}</h1>
        <p className="text-sm text-white/60 mb-3">{PERSONAL.title}</p>
        <p className="text-[13px] text-white/45 leading-relaxed max-w-xs mx-auto">
          {PERSONAL.tagline}
        </p>

        {/* Social links */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <a
            href={PERSONAL.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-white/70 hover:text-white bg-white/8 hover:bg-white/14 transition-all"
            aria-label="GitHub"
          >
            <Code2 size={14} />
            GitHub
          </a>
          <a
            href={PERSONAL.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-white/70 hover:text-white bg-white/8 hover:bg-white/14 transition-all"
            aria-label="LinkedIn"
          >
            <Users size={14} />
            LinkedIn
          </a>
          <a
            href={PERSONAL.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-white/70 hover:text-white bg-white/8 hover:bg-white/14 transition-all"
            aria-label="Resume"
          >
            <FileText size={14} />
            Resume
          </a>
        </div>
      </header>

      {/* Desktop upgrade prompt */}
      <div
        className="rounded-2xl p-4 mb-8 text-center"
        style={{
          background: 'rgba(99,102,241,0.12)',
          border: '1px solid rgba(99,102,241,0.25)',
        }}
      >
        <div className="text-2xl mb-2">🖥️</div>
        <p className="text-[13px] text-white/70 leading-relaxed">
          For the full interactive macOS-inspired experience with the{' '}
          <span className="text-[hsl(212,100%,70%)] font-medium">Aman AI voice assistant</span>,
          open this page on a desktop or laptop.
        </p>
      </div>

      {/* Skills */}
      <section className="mb-8" aria-label="Skills">
        <h2 className="text-[11px] uppercase tracking-widest text-white/35 mb-3 font-medium">
          Core Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {[...PERSONAL.skills.ai.slice(0, 6), ...PERSONAL.skills.languages.slice(0, 4)].map(
            (skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-md text-[12px] text-white/70 bg-white/6 border border-white/8"
              >
                {skill}
              </span>
            ),
          )}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="mb-8" aria-label="Featured Projects">
        <h2 className="text-[11px] uppercase tracking-widest text-white/35 mb-3 font-medium">
          Featured Projects
        </h2>
        <div className="space-y-3">
          {FEATURED_PROJECTS.slice(0, 4).map((project) => (
            <div
              key={project.id}
              className="rounded-xl p-4 border border-white/6 bg-white/4"
            >
              <h3 className="text-[14px] font-semibold text-white/90 mb-1">
                {project.title}
              </h3>
              <p className="text-[12px] text-white/50 leading-relaxed mb-3">
                {project.shortDescription}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/8 text-white/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              {project.githubUrl && !project.githubUrl.includes('TODO') && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[12px] text-[hsl(212,100%,65%)] hover:underline"
                >
                  <ExternalLink size={11} />
                  View on GitHub
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Voice AI teaser */}
      <div
        className="rounded-2xl p-5 mb-8 flex items-center gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(16,185,129,0.1))',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(99,102,241,0.25)' }}
        >
          <Mic size={22} className="text-indigo-300" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-white/90 mb-0.5">Aman AI</h3>
          <p className="text-[12px] text-white/50">
            Realtime voice AI assistant built on WebRTC. Available on desktop.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-[11px] text-white/20 mt-auto pt-4">
        <p>Built by {PERSONAL.name} · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
