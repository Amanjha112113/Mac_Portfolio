'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useWindowStore } from '@/stores/useWindowStore';
import { SEARCHABLE_APPS } from '@config/apps.config';
import { PROJECTS } from '@config/projects.config';
import { PERSONAL } from '@config/personal.config';
import { APP_ICON_MAP } from '@/components/ui/AppIcons';

// ── Search result types ────────────────────────────────────────────────

type ResultType = 'app' | 'project' | 'skill' | 'action';

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  icon?: string;
  action: () => void;
}

// ── Fuzzy match ────────────────────────────────────────────────────────

function fuzzyMatch(query: string, text: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  // Character-by-character fuzzy
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

function scoreMatch(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 60;
  return 20;
}

// ── Spotlight component ────────────────────────────────────────────────

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Spotlight({ isOpen, onClose }: SpotlightProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const openApp = useWindowStore((s) => s.openApp);

  // Reset on open/close — wrapped in setTimeout to avoid synchronous setState in effect
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      setQuery('');
      setSelectedIndex(0);
      inputRef.current?.focus();
    }, 10);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Build results from query
  const results: SearchResult[] = useCallback(() => {
    if (!query.trim()) return [];

    const r: SearchResult[] = [];

    // Apps
    SEARCHABLE_APPS.forEach((app) => {
      const searchText = `${app.title} ${app.description ?? ''} ${(app.keywords ?? []).join(' ')}`;
      if (fuzzyMatch(query, searchText)) {
        r.push({
          id: `app-${app.id}`,
          type: 'app',
          title: app.title,
          subtitle: app.description ?? 'Application',
          icon: app.icon,
          action: () => { openApp(app.id); onClose(); },
        });
      }
    });

    // Projects
    PROJECTS.forEach((project) => {
      const searchText = `${project.title} ${project.shortDescription} ${project.technologies.join(' ')}`;
      if (fuzzyMatch(query, searchText)) {
        r.push({
          id: `project-${project.id}`,
          type: 'project',
          title: project.title,
          subtitle: project.shortDescription,
          icon: 'Folder',
          action: () => { openApp('finder'); onClose(); },
        });
      }
    });

    // Skills
    const allSkills = [
      ...PERSONAL.skills.ai,
      ...PERSONAL.skills.languages,
      ...PERSONAL.skills.frameworks,
      ...PERSONAL.skills.tools,
    ];
    allSkills.forEach((skill) => {
      if (fuzzyMatch(query, skill)) {
        r.push({
          id: `skill-${skill}`,
          type: 'skill',
          title: skill,
          subtitle: 'Skill',
          action: () => { openApp('notes'); onClose(); },
        });
      }
    });

    // Sort by relevance score
    return r
      .sort((a, b) => {
        const scoreA = scoreMatch(query, a.title);
        const scoreB = scoreMatch(query, b.title);
        return scoreB - scoreA;
      })
      .slice(0, 8);
  }, [query, openApp, onClose])();

  // Reset selected index when results change
  useEffect(() => {
    const t = setTimeout(() => setSelectedIndex(0), 0);
    return () => clearTimeout(t);
  }, [results.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            results[selectedIndex].action();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [results, selectedIndex, onClose],
  );

  if (!isOpen) return null;

  const typeLabels: Record<ResultType, string> = {
    app: 'Application',
    project: 'Project',
    skill: 'Skill',
    action: 'Action',
  };

  const typeColors: Record<ResultType, string> = {
    app: 'text-blue-400',
    project: 'text-purple-400',
    skill: 'text-green-400',
    action: 'text-orange-400',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9500] bg-black/40 backdrop-blur-sm liquid-glass-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Spotlight panel */}
      <div
        className={cn(
          'fixed z-[9501]',
          'left-1/2 -translate-x-1/2',
          'top-[20%]',
          'w-full max-w-[640px] mx-4',
          'rounded-2xl overflow-hidden',
          'border border-white/10',
          'shadow-[0_32px_64px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.05)]',
          'liquid-glass-surface'
        )}
        style={{
          background: 'rgba(28,30,40,0.95)',
          backdropFilter: 'blur(40px) saturate(180%)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Spotlight search"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-white/40 shrink-0"><circle cx="7.5" cy="7.5" r="6" /><line x1="12" y1="12" x2="16" y2="16" /></svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search apps, projects, skills…"
            className={cn(
              'flex-1 bg-transparent text-white/90 text-[16px]',
              'placeholder:text-white/28',
              'outline-none border-none',
              'selectable',
            )}
            aria-label="Spotlight search input"
            aria-autocomplete="list"
            aria-controls="spotlight-results"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-white/30 hover:text-white/60 text-[12px] px-1.5 py-0.5 rounded border border-white/10 transition-colors"
              aria-label="Clear search"
            >
              ESC
            </button>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul
            id="spotlight-results"
            className="py-1.5 max-h-80 overflow-y-auto"
            role="listbox"
            aria-label="Search results"
          >
            {results.map((result, index) => {
              const IconComponent = APP_ICON_MAP[result.icon ?? ''];
              const isSelected = index === selectedIndex;

              return (
                <li key={result.id} role="option" aria-selected={isSelected}>
                  <button
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5',
                      'text-left cursor-default',
                      'transition-colors duration-75',
                      isSelected
                        ? 'bg-[var(--color-accent-blue)] text-white'
                        : 'text-white/80 hover:bg-white/6',
                    )}
                    onClick={result.action}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {/* Icon */}
                    <div className="shrink-0">
                      {IconComponent ? (
                        <IconComponent size={32} />
                      ) : (
                        <div
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center',
                            isSelected ? 'bg-white/20' : 'bg-white/8',
                          )}
                        >
                          <span className="text-sm">{result.icon}</span>
                        </div>
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium truncate">
                        {result.title}
                      </div>
                      <div
                        className={cn(
                          'text-[11px] truncate',
                          isSelected ? 'text-white/70' : 'text-white/40',
                        )}
                      >
                        {result.subtitle}
                      </div>
                    </div>

                    {/* Type badge */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={cn(
                          'text-[10px] font-medium uppercase tracking-wider',
                          isSelected ? 'text-white/60' : typeColors[result.type],
                        )}
                      >
                        {typeLabels[result.type]}
                      </span>
                      <ChevronRight
                        size={12}
                        className={isSelected ? 'text-white/50' : 'text-white/20'}
                      />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Empty state */}
        {query && results.length === 0 && (
          <div className="py-8 text-center text-white/30 text-[13px]">
            No results for &ldquo;{query}&rdquo;
          </div>
        )}

        {/* Hint bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/6">
          <div className="flex items-center gap-3 text-[11px] text-white/25">
            <span><kbd className="font-mono">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono">↵</kbd> open</span>
            <span><kbd className="font-mono">esc</kbd> close</span>
          </div>
          <span className="text-[11px] text-white/20">Spotlight</span>
        </div>
      </div>
    </>
  );
}
