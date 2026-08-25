'use client';

/**
 * Launchpad — fullscreen app grid overlay.
 *
 * Features:
 * - Blurred backdrop with grid of all launchpad-enabled apps
 * - macOS-style app icons (from AppIcons component)
 * - Live search filtering
 * - Keyboard navigation (arrows, Enter, Escape)
 * - Click outside or Esc to dismiss
 * - Smooth entrance/exit transitions
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useWindowStore } from '@/stores/useWindowStore';
import { LAUNCHPAD_APPS } from '@config/apps.config';
import { APP_ICON_MAP } from '@/components/ui/AppIcons';
import type { AppConfig } from '@config/apps.config';

interface LaunchpadProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LaunchpadIconProps {
  app: AppConfig;
  onOpen: () => void;
  isFocused: boolean;
}

function LaunchpadIcon({ app, onOpen, isFocused }: LaunchpadIconProps) {
  const IconComponent = APP_ICON_MAP[app.icon];

  return (
    <button
      onClick={onOpen}
      className={cn(
        'flex flex-col items-center gap-2.5 p-3',
        'rounded-2xl cursor-default',
        'transition-all duration-150',
        'hover:bg-white/8 active:scale-95',
        'focus-visible:outline-2 focus-visible:outline-white',
        'group',
        isFocused && 'bg-white/8',
      )}
      aria-label={`Open ${app.title}`}
    >
      {/* Icon */}
      <div
        className={cn(
          'transition-transform duration-150',
          'group-hover:scale-110 group-active:scale-100',
        )}
      >
        {IconComponent ? (
          <IconComponent size={64} />
        ) : (
          <div
            className="w-16 h-16 rounded-[22%] flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))',
              boxShadow: '0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >
            <span className="text-3xl">{app.icon}</span>
          </div>
        )}
      </div>

      {/* Label */}
      <span
        className={cn(
          'text-[12px] font-medium text-white/85 text-center',
          'w-20 truncate',
          'drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]',
        )}
      >
        {app.title}
      </span>
    </button>
  );
}

/** Search icon SVG */
function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-white/45 shrink-0">
      <circle cx="6" cy="6" r="5" />
      <line x1="10" y1="10" x2="13" y2="13" />
    </svg>
  );
}

export function Launchpad({ isOpen, onClose }: LaunchpadProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const openApp = useWindowStore((s) => s.openApp);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      setQuery('');
      setFocused(0);
      inputRef.current?.focus();
    }, 10);
    return () => clearTimeout(t);
  }, [isOpen]);

  const filteredApps = query.trim()
    ? LAUNCHPAD_APPS.filter((app) => {
        const text = `${app.title} ${app.description ?? ''} ${(app.keywords ?? []).join(' ')}`.toLowerCase();
        return text.includes(query.toLowerCase());
      })
    : LAUNCHPAD_APPS;

  const handleOpen = useCallback(
    (appId: string) => {
      openApp(appId);
      onClose();
    },
    [openApp, onClose],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const COLS = 7;
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowRight':
          e.preventDefault();
          setFocused((i) => Math.min(i + 1, filteredApps.length - 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setFocused((i) => Math.max(i - 1, 0));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocused((i) => Math.min(i + COLS, filteredApps.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocused((i) => Math.max(i - COLS, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredApps[focused]) {
            handleOpen(filteredApps[focused].id);
          }
          break;
      }
    },
    [filteredApps, focused, onClose, handleOpen],
  );

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[8500]',
        'flex flex-col items-center',
        'pt-24',
        'liquid-glass-backdrop'
      )}
      style={{
        background: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(40px) saturate(160%)',
        WebkitBackdropFilter: 'blur(40px) saturate(160%)',
        animation: 'fade-in 200ms ease-out',
      }}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Launchpad"
    >
      {/* Center panel with stronger liquid-glass surface */}
      <div className="w-full max-w-5xl px-6 py-8 rounded-2xl liquid-glass-surface">
        {/* Search bar */}
        <div
          className={cn(
            'flex items-center gap-2.5 px-4 py-2.5',
            'rounded-lg mb-8',
            'w-64',
          )}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '0.5px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.45)',
          }}
        >
          <SearchIcon />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setFocused(0); }}
            placeholder="Search"
            className="flex-1 bg-transparent text-white/90 text-[14px] outline-none placeholder:text-white/35 selectable"
            aria-label="Search applications"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-white/40 hover:text-white/70 transition-colors">
              <X size={13} />
            </button>
          )}
        </div>

        {/* App grid */}
        <div
          className="grid gap-y-6 gap-x-3 px-6 w-full justify-items-center"
          style={{
            gridTemplateColumns: 'repeat(7, 1fr)',
          }}
          role="grid"
          aria-label="Applications"
        >
          {filteredApps.map((app, index) => (
            <div
              key={app.id}
              role="gridcell"
              onMouseEnter={() => setFocused(index)}
            >
              <LaunchpadIcon
                app={app}
                onOpen={() => handleOpen(app.id)}
                isFocused={focused === index}
              />
            </div>
          ))}

          {filteredApps.length === 0 && (
            <div className="col-span-full text-center text-white/30 py-16 text-sm">
              No apps match &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Page dots indicator (decorative) */}
        <div className="mt-6 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/60" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}
