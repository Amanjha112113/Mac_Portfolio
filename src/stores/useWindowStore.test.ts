import { describe, it, expect, beforeEach } from 'vitest';
import { useWindowStore } from './useWindowStore';

describe('useWindowStore', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useWindowStore.setState({
      windows: {},
      maxZIndex: 100,
    });
  });

  it('should initialize with empty windows', () => {
    const state = useWindowStore.getState();
    expect(state.windows).toEqual({});
    expect(state.maxZIndex).toBe(100);
  });

  it('should open a window with default settings', () => {
    const { openWindow } = useWindowStore.getState();
    const id = openWindow('finder');

    const state = useWindowStore.getState();
    const win = state.windows[id];

    expect(win).toBeDefined();
    expect(win.appId).toBe('finder');
    expect(win.isOpen).toBe(true);
    expect(win.isFocused).toBe(true);
    expect(win.isMinimized).toBe(false);
    expect(win.isMaximized).toBe(false);
    expect(win.zIndex).toBeGreaterThan(100);
  });

  it('should focus the opened window and defocus others', () => {
    const { openWindow } = useWindowStore.getState();
    const id1 = openWindow('finder');
    const id2 = openWindow('notes');

    const state = useWindowStore.getState();
    expect(state.windows[id1].isFocused).toBe(false);
    expect(state.windows[id2].isFocused).toBe(true);
    expect(state.windows[id2].zIndex).toBeGreaterThan(state.windows[id1].zIndex);
  });

  it('should openApp: open new if not present, focus if already open', () => {
    const { openApp } = useWindowStore.getState();
    const id1 = openApp('finder');

    // Second call should return the same id and focus it
    const id2 = openApp('finder');
    expect(id1).toBe(id2);

    const state = useWindowStore.getState();
    expect(state.windows[id1].isOpen).toBe(true);
    expect(state.windows[id1].isFocused).toBe(true);
  });

  it('should restore minimized window when openApp is called', () => {
    const { openApp, minimizeWindow } = useWindowStore.getState();
    const id = openApp('finder');

    minimizeWindow(id);
    expect(useWindowStore.getState().windows[id].isMinimized).toBe(true);

    openApp('finder');
    const win = useWindowStore.getState().windows[id];
    expect(win.isMinimized).toBe(false);
    expect(win.isFocused).toBe(true);
  });

  it('should close a window', () => {
    const { openWindow, closeWindow } = useWindowStore.getState();
    const id = openWindow('finder');

    closeWindow(id);
    expect(useWindowStore.getState().windows[id]).toBeUndefined();
  });

  it('should minimize and restore a window', () => {
    const { openWindow, minimizeWindow, restoreWindow } = useWindowStore.getState();
    const id = openWindow('finder');

    minimizeWindow(id);
    expect(useWindowStore.getState().windows[id].isMinimized).toBe(true);
    expect(useWindowStore.getState().windows[id].isFocused).toBe(false);

    restoreWindow(id);
    expect(useWindowStore.getState().windows[id].isMinimized).toBe(false);
    expect(useWindowStore.getState().windows[id].isFocused).toBe(true);
  });

  it('should maximize and restore on toggleMaximize', () => {
    const { openWindow, toggleMaximize } = useWindowStore.getState();
    const id = openWindow('finder');

    const initialX = useWindowStore.getState().windows[id].x;
    const initialWidth = useWindowStore.getState().windows[id].width;

    // Toggle once -> Maximize
    toggleMaximize(id);
    let win = useWindowStore.getState().windows[id];
    expect(win.isMaximized).toBe(true);
    expect(win.preMaximize).toEqual({
      x: initialX,
      y: win.preMaximize?.y,
      width: initialWidth,
      height: win.preMaximize?.height,
    });

    // Toggle twice -> Restore
    toggleMaximize(id);
    win = useWindowStore.getState().windows[id];
    expect(win.isMaximized).toBe(false);
    expect(win.x).toBe(initialX);
    expect(win.width).toBe(initialWidth);
  });

  it('should move a window', () => {
    const { openWindow, moveWindow } = useWindowStore.getState();
    const id = openWindow('finder');

    moveWindow(id, 250, 350);
    const win = useWindowStore.getState().windows[id];
    expect(win.x).toBe(250);
    expect(win.y).toBe(350);
  });

  it('should resize a window within constraints', () => {
    const { openWindow, resizeWindow } = useWindowStore.getState();
    const id = openWindow('finder'); // Default size 860x560, minSize 600x400

    // Resize within bounds
    resizeWindow(id, 700, 500);
    expect(useWindowStore.getState().windows[id].width).toBe(700);
    expect(useWindowStore.getState().windows[id].height).toBe(500);

    // Resize below minSize limits
    resizeWindow(id, 100, 100);
    expect(useWindowStore.getState().windows[id].width).toBe(600); // Clamped to minWidth
    expect(useWindowStore.getState().windows[id].height).toBe(400); // Clamped to minHeight
  });
});
