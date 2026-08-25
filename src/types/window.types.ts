/**
 * window.types.ts
 * Core types for the window management system.
 */

export interface WindowState {
  /** Stable, unique window instance ID (not the app ID). */
  id: string;
  /** App ID from apps.config.ts */
  appId: string;
  /** Window title (defaults to app title) */
  title: string;
  /** X position from left edge of desktop */
  x: number;
  /** Y position from top edge of desktop (below menu bar) */
  y: number;
  /** Window width in px */
  width: number;
  /** Window height in px */
  height: number;
  /** Z-index for stacking order */
  zIndex: number;
  /** Whether the window is visible (open) */
  isOpen: boolean;
  /** Whether the window is minimized to dock */
  isMinimized: boolean;
  /** Whether the window is maximized to fill the desktop */
  isMaximized: boolean;
  /** Whether this window currently has keyboard focus */
  isFocused: boolean;
  /** Stored pre-maximize size/position for restore */
  preMaximize?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface WindowManagerActions {
  openWindow: (appId: string, overrides?: Partial<WindowState>) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number, x?: number, y?: number) => void;
  /** Open app by appId: if already open, focus it; otherwise open a new window */
  openApp: (appId: string) => string;
  bringToFront: (id: string) => void;
  setWallpaper: (wallpaper: string) => void;
}

export interface WindowManagerState {
  windows: Record<string, WindowState>;
  /** Monotonically increasing Z-index counter */
  maxZIndex: number;
  /** Active wallpaper file path or css style */
  wallpaper: string;
}
