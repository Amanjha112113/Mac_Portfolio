/**
 * useWindowStore.ts
 * Zustand store for the window manager.
 *
 * Design decisions:
 * - Z-index is a monotonically increasing counter to ensure correct stacking.
 * - Drag/resize transient state is NOT in this store — it lives in refs inside
 *   the window component to avoid flooding React with re-renders at 60fps.
 * - Opening an already-open app focuses it rather than creating a duplicate.
 * - Windows are constrained to remain within the usable viewport.
 */

import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { APPS, getApp } from '@config/apps.config';
import type {
  WindowState,
  WindowManagerState,
  WindowManagerActions,
} from '@/types/window.types';

// Menu bar height — windows must stay below this
const MENU_BAR_HEIGHT = 32;
// Minimum distance from viewport edges
const VIEWPORT_MARGIN = 8;
// Cascade offset for new windows
const CASCADE_OFFSET = 24;

type WindowStore = WindowManagerState & WindowManagerActions;

/** Get the next Z-index, higher than any current window */
function getNextZIndex(windows: Record<string, WindowState>): number {
  const max = Object.values(windows).reduce(
    (acc, w) => Math.max(acc, w.zIndex),
    100,
  );
  return max + 1;
}

/** Calculate initial cascade position for a new window */
function getCascadePosition(
  windows: Record<string, WindowState>,
  width: number,
  height: number,
): { x: number; y: number } {
  const existing = Object.values(windows).filter((w) => w.isOpen && !w.isMinimized);
  const offset = (existing.length % 8) * CASCADE_OFFSET;

  // Safe viewport dimensions (will be clamped at runtime)
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

  const x = Math.max(VIEWPORT_MARGIN, Math.min(offset + 80, vw - width - VIEWPORT_MARGIN));
  const y = Math.max(
    MENU_BAR_HEIGHT + VIEWPORT_MARGIN,
    Math.min(offset + MENU_BAR_HEIGHT + 40, vh - height - VIEWPORT_MARGIN),
  );

  return { x, y };
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: {},
  maxZIndex: 100,
  wallpaper: '/wallpaper.jpg',

  openWindow: (appId: string, overrides?: Partial<WindowState>): string => {
    const appConfig = getApp(appId);
    const { windows } = get();
    const zIndex = getNextZIndex(windows);
    const { x, y } = getCascadePosition(
      windows,
      appConfig.defaultSize.width,
      appConfig.defaultSize.height,
    );

    const id = nanoid();
    const newWindow: WindowState = {
      id,
      appId,
      title: appConfig.title,
      x,
      y,
      width: appConfig.defaultSize.width,
      height: appConfig.defaultSize.height,
      zIndex,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      isFocused: true,
      ...overrides,
    };

    // Defocus all other windows
    const updatedWindows = Object.fromEntries(
      Object.entries(windows).map(([k, w]) => [k, { ...w, isFocused: false }]),
    );

    set({
      windows: { ...updatedWindows, [id]: newWindow },
      maxZIndex: zIndex,
    });

    return id;
  },

  openApp: (appId: string): string => {
    const { windows } = get();

    // Find an existing open (non-minimized) window for this app
    const existing = Object.values(windows).find(
      (w) => w.appId === appId && w.isOpen,
    );

    if (existing) {
      if (existing.isMinimized) {
        get().restoreWindow(existing.id);
      } else {
        get().focusWindow(existing.id);
      }
      return existing.id;
    }

    return get().openWindow(appId);
  },

  closeWindow: (id: string): void => {
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _removed, ...rest } = state.windows;
      return { windows: rest };
    });
  },

  focusWindow: (id: string): void => {
    set((state) => {
      const window = state.windows[id];
      if (!window) return state;

      const zIndex = getNextZIndex(state.windows);
      const updatedWindows = Object.fromEntries(
        Object.entries(state.windows).map(([k, w]) => [
          k,
          { ...w, isFocused: k === id, zIndex: k === id ? zIndex : w.zIndex },
        ]),
      );

      return { windows: updatedWindows, maxZIndex: zIndex };
    });
  },

  bringToFront: (id: string): void => {
    get().focusWindow(id);
  },

  minimizeWindow: (id: string): void => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isMinimized: true, isFocused: false },
      },
    }));
  },

  restoreWindow: (id: string): void => {
    set((state) => {
      const zIndex = getNextZIndex(state.windows);
      const updatedWindows = Object.fromEntries(
        Object.entries(state.windows).map(([k, w]) => [
          k,
          { ...w, isFocused: false, zIndex: k === id ? zIndex : w.zIndex },
        ]),
      );

      return {
        windows: {
          ...updatedWindows,
          [id]: {
            ...updatedWindows[id],
            isMinimized: false,
            isFocused: true,
          },
        },
        maxZIndex: zIndex,
      };
    });
  },

  maximizeWindow: (id: string): void => {
    set((state) => {
      const win = state.windows[id];
      if (!win || win.isMaximized) return state;

      return {
        windows: {
          ...state.windows,
          [id]: {
            ...win,
            isMaximized: true,
            preMaximize: { x: win.x, y: win.y, width: win.width, height: win.height },
          },
        },
      };
    });
  },

  toggleMaximize: (id: string): void => {
    const win = get().windows[id];
    if (!win) return;

    if (win.isMaximized) {
      // Restore
      set((state) => ({
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            isMaximized: false,
            x: state.windows[id].preMaximize?.x ?? state.windows[id].x,
            y: state.windows[id].preMaximize?.y ?? state.windows[id].y,
            width: state.windows[id].preMaximize?.width ?? state.windows[id].width,
            height: state.windows[id].preMaximize?.height ?? state.windows[id].height,
            preMaximize: undefined,
          },
        },
      }));
    } else {
      get().maximizeWindow(id);
    }
  },

  moveWindow: (id: string, x: number, y: number): void => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], x, y },
      },
    }));
  },

  resizeWindow: (id: string, width: number, height: number, x?: number, y?: number): void => {
    const win = get().windows[id];
    if (!win) return;

    const appConfig = APPS.find((a) => a.id === win.appId);
    const minWidth = appConfig?.minSize.width ?? 320;
    const minHeight = appConfig?.minSize.height ?? 240;

    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          width: Math.max(minWidth, width),
          height: Math.max(minHeight, height),
          ...(x !== undefined ? { x } : {}),
          ...(y !== undefined ? { y } : {}),
        },
      },
    }));
  },

  setWallpaper: (wallpaper: string): void => {
    set({ wallpaper });
  },
}));

// Selector helpers — use these to avoid subscribing to the entire store
export const selectWindow = (id: string) => (state: WindowStore) =>
  state.windows[id];

export const selectOpenWindows = (state: WindowStore) =>
  Object.values(state.windows).filter((w) => w.isOpen);

export const selectFocusedWindow = (state: WindowStore) =>
  Object.values(state.windows).find((w) => w.isFocused && w.isOpen);
