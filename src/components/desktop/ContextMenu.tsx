'use client';

import { useEffect, useCallback } from 'react';
import { cn } from '@/lib/cn';
import { useWindowStore } from '@/stores/useWindowStore';

interface ContextMenuItem {
  label: string;
  shortcut?: string;
  action: () => void;
  separator?: false;
}

interface ContextMenuSeparator {
  separator: true;
}

type ContextMenuEntry = ContextMenuItem | ContextMenuSeparator;

interface ContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ContextMenu({ x, y, isOpen, onClose }: ContextMenuProps) {
  const { openApp, setWallpaper } = useWindowStore();

  const items: ContextMenuEntry[] = [
    {
      label: 'New Window',
      shortcut: '⌘N',
      action: () => { openApp('finder'); onClose(); },
    },
    { separator: true },
    {
      label: 'Open Spotlight',
      shortcut: '⌘K',
      action: () => {
        // Dispatch a custom event that Desktop.tsx listens to
        window.dispatchEvent(new CustomEvent('portfolio:spotlight'));
        onClose();
      },
    },
    {
      label: 'Open Launchpad',
      shortcut: 'F4',
      action: () => {
        window.dispatchEvent(new CustomEvent('portfolio:launchpad'));
        onClose();
      },
    },
    { separator: true },
    {
      label: 'Use macOS Sonoma Backdrop',
      action: () => { setWallpaper('/wallpaper.jpg'); onClose(); },
    },
    {
      label: 'Use Aurora Blue Backdrop',
      action: () => { setWallpaper('linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)'); onClose(); },
    },
    {
      label: 'Use Twilight Orange Backdrop',
      action: () => { setWallpaper('linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)'); onClose(); },
    },
    {
      label: 'Use Solid Charcoal Backdrop',
      action: () => { setWallpaper('#121214'); onClose(); },
    },
    { separator: true },
    {
      label: 'About This Mac',
      action: () => { openApp('system-settings'); onClose(); },
    },
  ];

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Clamp position to viewport
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  const menuW = 220;
  const menuH = 200;
  const clampedX = Math.min(x, vw - menuW - 8);
  const clampedY = Math.min(y, vh - menuH - 8);

  return (
    <>
      {/* Invisible backdrop to catch outside clicks */}
      <div
        className="fixed inset-0 z-[8900]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <div
        className={cn(
          'fixed z-[8901]',
          'rounded-[var(--radius-menu)] py-1.5',
          'min-w-[200px]',
          'shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)]',
        )}
        style={{
          left: clampedX,
          top: clampedY,
          background: 'rgba(28,30,40,0.96)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        }}
        role="menu"
        aria-label="Desktop context menu"
      >
        {items.map((item, index) => {
          if ('separator' in item && item.separator) {
            return (
              <div
                key={`sep-${index}`}
                className="my-1 mx-2 h-px bg-white/8"
                role="separator"
              />
            );
          }

          const menuItem = item as ContextMenuItem;
          return (
            <button
              key={menuItem.label}
              className={cn(
                'w-full flex items-center justify-between',
                'px-3.5 py-1.5 text-[13px]',
                'text-white/85 hover:text-white',
                'hover:bg-[var(--color-accent-blue)]',
                'cursor-default select-none',
                'transition-colors duration-75',
                'rounded-sm mx-1 w-[calc(100%-8px)]',
              )}
              role="menuitem"
              onClick={menuItem.action}
            >
              <span>{menuItem.label}</span>
              {menuItem.shortcut && (
                <span className="text-[11px] opacity-50 ml-4 font-mono">
                  {menuItem.shortcut}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

/**
 * Hook to manage context menu state.
 * Returns state and handlers to bind to the desktop element.
 */
export function useContextMenu() {
  // Returns { x, y, isOpen, handlers }
  const closeMenu = useCallback(() => {
    // handled by state in component
  }, []);

  return { closeMenu };
}
