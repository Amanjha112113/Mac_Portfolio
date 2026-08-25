'use client';

/**
 * MenuBar — macOS-inspired translucent menu bar.
 *
 * Features:
 * - Apple-style logo (custom SVG monogram)
 * - App menus with dropdown support
 * - System tray: Wi-Fi, Battery, Volume, Spotlight, Clock
 * - Glass morphism with translucent background
 * - Live clock with date
 */

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/cn';

interface MenuBarItem {
  label: string;
  items?: { label: string; shortcut?: string; divider?: boolean }[];
}

const APP_MENU_ITEMS: MenuBarItem[] = [
  {
    label: 'File',
    items: [
      { label: 'New Window', shortcut: '⌘N' },
      { label: 'Open…', shortcut: '⌘O' },
      { label: '', divider: true },
      { label: 'Close Window', shortcut: '⌘W' },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo', shortcut: '⌘Z' },
      { label: 'Redo', shortcut: '⇧⌘Z' },
      { label: '', divider: true },
      { label: 'Cut', shortcut: '⌘X' },
      { label: 'Copy', shortcut: '⌘C' },
      { label: 'Paste', shortcut: '⌘V' },
      { label: 'Select All', shortcut: '⌘A' },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'Zoom In', shortcut: '⌘+' },
      { label: 'Zoom Out', shortcut: '⌘-' },
      { label: '', divider: true },
      { label: 'Enter Full Screen', shortcut: '⌃⌘F' },
    ],
  },
  {
    label: 'Window',
    items: [
      { label: 'Minimize', shortcut: '⌘M' },
      { label: 'Zoom' },
      { label: '', divider: true },
      { label: 'Bring All to Front' },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'Aman AI Help' },
      { label: 'About Portfolio' },
    ],
  },
];

interface MenuBarProps {
  onSpotlightOpen?: () => void;
}

function Clock() {
  const [time, setTime] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      );
      setDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) {
    return <span className="opacity-0 select-none w-[140px]">Mon Jan 1 12:00 PM</span>;
  }

  return (
    <time
      className="flex items-center gap-2 text-[13px] font-medium tabular-nums text-white/90"
      title={date ?? undefined}
    >
      <span className="text-white/80">{date}</span>
      <span className="text-white/90">{time}</span>
    </time>
  );
}

/** Apple logo SVG — a minimal stylized 'A' monogram for Aman */
function AppleLogo() {
  return (
    <svg width="14" height="17" viewBox="0 0 14 17" fill="currentColor">
      <path d="M13.13 12.06c-.3.66-.65 1.27-1.06 1.83-.55.76-1 1.29-1.35 1.58-.54.48-1.12.73-1.73.74-.44 0-.97-.12-1.59-.38-.62-.25-1.19-.38-1.71-.38-.55 0-1.13.13-1.76.38-.63.26-1.13.39-1.52.41-.59.03-1.18-.23-1.77-.79C.28 15.11-.07 14.53-.07 14.53c-.35-.56-.72-1.25-1.1-2.08-.41-.89-.74-1.78-.99-2.67 0 0 .67-1.28 1.07-1.83.34-.47.75-.84 1.23-1.12.48-.28 1-.42 1.55-.43.47 0 1.08.14 1.85.43.76.29 1.25.43 1.46.43.16 0 .7-.17 1.61-.5.86-.31 1.59-.44 2.19-.38 1.62.13 2.83.77 3.65 1.93-1.45.88-2.17 2.11-2.15 3.69.02 1.23.46 2.25 1.32 3.06.39.37.83.66 1.31.86-.1.31-.22.6-.34.87zM9.88.37c0 .96-.35 1.86-1.05 2.69-.84.98-1.86 1.55-2.97 1.46a2.99 2.99 0 01-.02-.36c0-.93.4-1.92 1.11-2.73.36-.41.81-.75 1.36-1.02C8.86.14 9.38-.02 9.86-.05c.02.14.02.28.02.42z" transform="translate(0.5, 0.5)" />
    </svg>
  );
}

/** Wi-Fi icon */
function WifiIcon() {
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 4.5C3.5 2.5 6 1.5 7.5 1.5c1.5 0 4 1 6 3" opacity="0.5" />
      <path d="M3.5 7C4.5 6 6 5.5 7.5 5.5S10.5 6 11.5 7" opacity="0.7" />
      <circle cx="7.5" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Battery icon */
function BatteryIcon() {
  return (
    <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
      <rect x="0.5" y="0.5" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1" />
      <rect x="2" y="2" width="13" height="7" rx="1" fill="currentColor" opacity="0.8" />
      <path d="M19.5 3.5v4c.8-.3 1.5-1 1.5-2s-.7-1.7-1.5-2z" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

/** Search/Spotlight icon */
function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="5.5" cy="5.5" r="4.5" />
      <line x1="9" y1="9" x2="12" y2="12" />
    </svg>
  );
}

/** Control Center icon */
function ControlCenterIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor" opacity="0.8">
      <rect x="1" y="1" width="5" height="4" rx="1" />
      <rect x="8" y="1" width="5" height="4" rx="1" opacity="0.5" />
      <rect x="1" y="7" width="5" height="4" rx="1" opacity="0.5" />
      <rect x="8" y="7" width="5" height="4" rx="1" />
    </svg>
  );
}

export function MenuBar({ onSpotlightOpen }: MenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleMenuToggle = useCallback((label: string) => {
    setActiveMenu((prev) => (prev === label ? null : label));
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!activeMenu) return;
    const handler = () => setActiveMenu(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [activeMenu]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[9000]',
        'flex items-center justify-between',
        'px-3',
        'text-white/90',
        'select-none',
      )}
      style={{
        height: 'var(--menu-bar-height)',
        background: 'rgba(22, 22, 26, 0.72)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        borderBottom: '0.5px solid rgba(255, 255, 255, 0.06)',
      }}
      role="menubar"
      aria-label="Menu bar"
    >
      {/* ── Left: Logo + app menu ── */}
      <div className="flex items-center gap-0">
        {/* Apple/Portfolio logo */}
        <button
          className={cn(
            'px-2.5 py-1 rounded-[4px]',
            'hover:bg-white/10 active:bg-white/15',
            'transition-colors duration-100',
            'text-white/90 cursor-default',
          )}
          aria-label="Aman Jha Portfolio"
          onClick={(e) => e.stopPropagation()}
        >
          <AppleLogo />
        </button>

        {/* Bold app name */}
        <span className="px-2 text-[13px] font-semibold text-white/90">
          Finder
        </span>

        {/* Menu items */}
        {APP_MENU_ITEMS.map((item) => (
          <div key={item.label} className="relative">
            <button
              className={cn(
                'px-2.5 py-1 rounded-[4px] text-[13px]',
                'hover:bg-white/10 active:bg-white/15',
                'transition-colors duration-100',
                'cursor-default',
                activeMenu === item.label
                  ? 'bg-white/15 text-white'
                  : 'text-white/75',
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleMenuToggle(item.label);
              }}
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={activeMenu === item.label}
            >
              {item.label}
            </button>

            {/* Dropdown */}
            {activeMenu === item.label && item.items && (
              <div
                className="absolute top-full left-0 mt-0.5 z-[9001] py-1"
                style={{
                  minWidth: 220,
                  background: 'rgba(28, 28, 32, 0.95)',
                  backdropFilter: 'blur(40px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                  borderRadius: 8,
                  border: '0.5px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3)',
                }}
                role="menu"
                onClick={(e) => e.stopPropagation()}
              >
                {item.items.map((subItem, idx) =>
                  subItem.divider ? (
                    <div
                      key={`div-${idx}`}
                      className="my-1 mx-2"
                      style={{
                        height: 0.5,
                        background: 'rgba(255, 255, 255, 0.1)',
                      }}
                      aria-hidden="true"
                    />
                  ) : (
                    <button
                      key={subItem.label}
                      className={cn(
                        'w-full flex items-center justify-between',
                        'px-3 py-[5px] text-[13px]',
                        'text-white/85 hover:text-white',
                        'hover:bg-[#3478F6] hover:rounded-[4px]',
                        'transition-colors duration-75',
                        'cursor-default mx-1',
                      )}
                      style={{ width: 'calc(100% - 8px)' }}
                      role="menuitem"
                      onClick={() => setActiveMenu(null)}
                    >
                      <span>{subItem.label}</span>
                      {subItem.shortcut && (
                        <span className="text-white/40 text-[12px] ml-8 font-light">
                          {subItem.shortcut}
                        </span>
                      )}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Right: system tray ── */}
      <div className="flex items-center gap-0.5">
        {/* Control Center */}
        <button
          className="p-1.5 rounded-[4px] hover:bg-white/10 transition-colors duration-100 cursor-default text-white/75"
          aria-label="Control Center"
          title="Control Center"
        >
          <ControlCenterIcon />
        </button>

        {/* Spotlight search */}
        <button
          className="p-1.5 rounded-[4px] hover:bg-white/10 transition-colors duration-100 cursor-default text-white/75"
          aria-label="Spotlight search (⌘K)"
          title="Spotlight (⌘K)"
          onClick={onSpotlightOpen}
        >
          <SearchIcon />
        </button>

        {/* Wi-Fi indicator */}
        <button
          className="p-1.5 rounded-[4px] hover:bg-white/10 transition-colors duration-100 cursor-default text-white/75"
          aria-label="Wi-Fi connected"
          title="Wi-Fi"
        >
          <WifiIcon />
        </button>

        {/* Battery */}
        <button
          className="flex items-center gap-1 px-1 py-0.5 rounded-[4px] hover:bg-white/10 transition-colors duration-100 cursor-default text-white/75"
          aria-label="Battery 87%"
          title="Battery"
        >
          <BatteryIcon />
          <span className="text-[12px] text-white/60">87%</span>
        </button>

        {/* Clock */}
        <div className="px-2 py-0.5 rounded-[4px] hover:bg-white/10 transition-colors duration-100 cursor-default">
          <Clock />
        </div>
      </div>
    </header>
  );
}
