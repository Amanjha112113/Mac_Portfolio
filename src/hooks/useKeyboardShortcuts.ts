'use client';

import { useEffect, useCallback } from 'react';
import { useWindowStore } from '@/stores/useWindowStore';

/**
 * useKeyboardShortcuts — global keyboard shortcut handler.
 * Must be mounted once at the desktop level.
 *
 * Shortcuts:
 *   Cmd/Ctrl + K     → Open Spotlight
 *   Cmd/Ctrl + W     → Close focused window
 *   Cmd/Ctrl + M     → Minimize focused window
 *   Escape           → Close active overlay (handled at overlay level)
 */
export function useKeyboardShortcuts({
  onSpotlight,
  onLaunchpad,
}: {
  onSpotlight: () => void;
  onLaunchpad: () => void;
}) {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);

  const getFocusedWindowId = useCallback((): string | null => {
    const windows = useWindowStore.getState().windows;
    const focused = Object.values(windows).find((w) => w.isFocused && w.isOpen);
    return focused?.id ?? null;
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMeta = e.metaKey || e.ctrlKey;

      // Spotlight: Cmd+K or Cmd+Space (but don't intercept actual Spotlight on macOS)
      if (isMeta && e.key === 'k') {
        e.preventDefault();
        onSpotlight();
        return;
      }

      // Launchpad: F4 (like macOS) — no modifier needed
      if (e.key === 'F4') {
        e.preventDefault();
        onLaunchpad();
        return;
      }

      // Close window: Cmd+W
      if (isMeta && e.key === 'w') {
        e.preventDefault();
        const id = getFocusedWindowId();
        if (id) closeWindow(id);
        return;
      }

      // Minimize window: Cmd+M
      if (isMeta && e.key === 'm') {
        e.preventDefault();
        const id = getFocusedWindowId();
        if (id) minimizeWindow(id);
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSpotlight, onLaunchpad, getFocusedWindowId, closeWindow, minimizeWindow]);
}
