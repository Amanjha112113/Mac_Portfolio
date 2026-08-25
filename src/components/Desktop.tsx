'use client';

import { useState, useCallback, useEffect } from 'react';
import { useWindowStore } from '@/stores/useWindowStore';
import { MenuBar } from './desktop/MenuBar';
import { Dock } from './desktop/Dock';
import { Spotlight } from './desktop/Spotlight';
import { Launchpad } from './desktop/Launchpad';
import { ContextMenu } from './desktop/ContextMenu';
import { MobileFallback } from './MobileFallback';
import { Window } from './window/Window';
import { AppRenderer } from './AppRegistry';
import { APPS } from '@config/apps.config';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { cn } from '@/lib/cn';
import { AnimatePresence } from 'framer-motion';

const MENU_BAR_HEIGHT = 32;

/**
 * Desktop — root interactive desktop environment.
 *
 * Layer order (bottom → top):
 *   0: Wallpaper (fixed)
 *   1: Desktop canvas — windows live here (absolute positioned)
 *   8000: Dock (fixed)
 *   8500: Launchpad (fixed overlay)
 *   8900: Context menu
 *   9000: Menu bar (fixed)
 *   9500: Spotlight (fixed overlay)
 *   99999: Boot screen (first-visit only)
 */
export function Desktop() {
  const windows = useWindowStore((s) => s.windows);
  const wallpaper = useWindowStore((s) => s.wallpaper);
  const openWindows = Object.values(windows).filter((w) => w.isOpen);

  // ── Boot screen state ─────────────────────────────────────────────
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // ── Overlay state ──────────────────────────────────────────────────
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; isOpen: boolean }>({
    x: 0, y: 0, isOpen: false,
  });

  // ── Mobile detection ───────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Spotlight handlers ─────────────────────────────────────────────
  const openSpotlight = useCallback(() => {
    setIsLaunchpadOpen(false);
    setContextMenu((m) => ({ ...m, isOpen: false }));
    setIsSpotlightOpen(true);
  }, []);

  const closeSpotlight = useCallback(() => setIsSpotlightOpen(false), []);

  // ── Launchpad handlers ─────────────────────────────────────────────
  const openLaunchpad = useCallback(() => {
    setIsSpotlightOpen(false);
    setContextMenu((m) => ({ ...m, isOpen: false }));
    setIsLaunchpadOpen((v) => !v);
  }, []);

  const closeLaunchpad = useCallback(() => setIsLaunchpadOpen(false), []);

  // ── Context menu handlers ──────────────────────────────────────────
  const openContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsSpotlightOpen(false);
    setContextMenu({ x: e.clientX, y: e.clientY, isOpen: true });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu((m) => ({ ...m, isOpen: false }));
  }, []);

  // ── Listen for custom events from ContextMenu ──────────────────────
  useEffect(() => {
    const onSpotlight = () => openSpotlight();
    const onLaunchpad = () => openLaunchpad();
    window.addEventListener('portfolio:spotlight', onSpotlight);
    window.addEventListener('portfolio:launchpad', onLaunchpad);
    return () => {
      window.removeEventListener('portfolio:spotlight', onSpotlight);
      window.removeEventListener('portfolio:launchpad', onLaunchpad);
    };
  }, [openSpotlight, openLaunchpad]);

  // ── Global keyboard shortcuts ──────────────────────────────────────
  useKeyboardShortcuts({
    onSpotlight: openSpotlight,
    onLaunchpad: openLaunchpad,
  });

  // ── Boot screen ────────────────────────────────────────────────────
  if (isBooting) {
    return (
      <div className="boot-screen">
        {/* Apple Logo */}
        <div className="boot-screen-logo">
          <svg width="56" height="56" viewBox="0 0 170 170" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M150.4 130.2c-2.8 6.5-6.1 12.4-10 17.9-5.3 7.5-9.6 12.7-13 15.6-5.2 4.8-10.7 7.2-16.6 7.4-4.2 0-9.3-1.2-15.3-3.6-6-2.4-11.5-3.6-16.5-3.6-5.3 0-11 1.2-17 3.6-6.1 2.4-11 3.7-14.7 3.8-5.7.3-11.3-2.2-16.9-7.5-3.7-3.2-8.3-8.6-13.8-16.3-5.9-8.3-10.8-17.9-14.6-28.9C-1.8 107.8 0 96.2 0 85.3c0-12.4 2.7-23.1 8-32 4.2-7.2 9.8-12.8 16.8-17 7-4.2 14.6-6.3 22.7-6.5 4.5 0 10.3 1.4 17.6 4.1 7.2 2.7 11.8 4.1 13.8 4.1 1.5 0 6.5-1.6 15.2-4.9 8.2-3 15.1-4.3 20.7-3.8 15.3 1.2 26.8 7.2 34.4 18-13.7 8.3-20.4 19.9-20.2 34.8.2 11.6 4.3 21.3 12.4 28.9 3.7 3.5 7.8 6.2 12.3 8.1-1 2.9-2 5.6-3.3 8.1zM115.4 4.9c0 9.1-3.3 17.6-10 25.4-8 9.4-17.7 14.8-28.2 13.9-.1-1.1-.2-2.2-.2-3.4 0-8.7 3.8-18 10.6-25.6 3.4-3.8 7.7-7 12.9-9.5 5.2-2.5 10.1-3.8 14.7-4.1.1 1.1.2 2.2.2 3.3z"
              fill="rgba(255,255,255,0.85)"
            />
          </svg>
        </div>

        {/* Progress Bar */}
        <div className="boot-progress-bar">
          <div className="boot-progress-fill" />
        </div>
      </div>
    );
  }

  // ── Mobile rendering ───────────────────────────────────────────────
  if (isMobile) {
    return <MobileFallback />;
  }

  return (
    <>
      {/* ── Wallpaper ───────────────────────────── */}
      <div
        className={cn('wallpaper', isLaunchpadOpen && 'launchpad-active')}
        style={{
          backgroundImage: (wallpaper.startsWith('/') || wallpaper.startsWith('http') || wallpaper.includes('.')) 
            ? `url(${wallpaper})` 
            : undefined,
          background: !(wallpaper.startsWith('/') || wallpaper.startsWith('http') || wallpaper.includes('.')) 
            ? wallpaper 
            : undefined,
        }}
        aria-hidden="true"
      />

      {/* Liquid glass overlay (decorative, non-interactive) applied across the desktop */}
      <div
        className="liquid-glass-backdrop absolute inset-0 z-[1] pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Menu Bar ────────────────────────────── */}
      <MenuBar onSpotlightOpen={openSpotlight} />

      {/* ── Desktop Canvas ──────────────────────── */}
      <main
        className="absolute inset-0 overflow-hidden"
        style={{ top: MENU_BAR_HEIGHT }}
        onContextMenu={openContextMenu}
        role="main"
        aria-label="Desktop"
      >
        <AnimatePresence>
          {openWindows
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((win) => {
              const appConfig = APPS.find((a) => a.id === win.appId);
              if (!appConfig) return null;
              return (
                <Window key={win.id} window={win}>
                  <AppRenderer componentName={appConfig.component} />
                </Window>
              );
            })}
        </AnimatePresence>

        {/* Empty desktop — clean, no instructional text */}
      </main>

      {/* ── Dock ────────────────────────────────── */}
      <Dock onLaunchpad={openLaunchpad} />

      {/* ── Launchpad overlay ───────────────────── */}
      <Launchpad isOpen={isLaunchpadOpen} onClose={closeLaunchpad} />

      {/* ── Spotlight overlay ───────────────────── */}
      <Spotlight isOpen={isSpotlightOpen} onClose={closeSpotlight} />

      {/* ── Context menu ────────────────────────── */}
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.isOpen}
        onClose={closeContextMenu}
      />
    </>
  );
}
