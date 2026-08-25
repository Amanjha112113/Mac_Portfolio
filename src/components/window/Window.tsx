'use client';

/**
 * Window — macOS-inspired window component.
 *
 * Design decisions:
 * - Title bar has unified toolbar appearance with vibrancy
 * - Traffic lights (close/minimize/maximize) show symbols on hover
 * - Unfocused windows have dimmed traffic lights and muted title
 * - Dragging uses transient refs (not React state) for 60fps performance
 * - Resize handles are invisible 6px strips around edges
 * - Minimize animates with scale+translate (GPU-accelerated)
 * - Window shadow changes based on focus state
 * - Content area has frosted glass background
 */

import { useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { useWindowStore } from '@/stores/useWindowStore';
import type { WindowState } from '@/types/window.types';
import { motion } from 'framer-motion';

const MENU_BAR_HEIGHT = 32;
const DOCK_HEIGHT = 80;

interface WindowProps {
  window: WindowState;
  children: React.ReactNode;
}

export function Window({ window: win, children }: WindowProps) {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize);
  const moveWindow = useWindowStore((s) => s.moveWindow);
  const resizeWindow = useWindowStore((s) => s.resizeWindow);

  // Transient drag state in refs (no re-renders during drag)
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    startWinX: number;
    startWinY: number;
  }>({ active: false, startX: 0, startY: 0, startWinX: 0, startWinY: 0 });

  // Transient resize state in refs
  const resizeRef = useRef<{
    active: boolean;
    edge: ResizeEdge | null;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startWinX: number;
    startWinY: number;
  }>({
    active: false,
    edge: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startWinX: 0,
    startWinY: 0,
  });

  const windowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: win.x, y: win.y, width: win.width, height: win.height });

  useEffect(() => {
    if (!dragRef.current.active && !resizeRef.current.active) {
      posRef.current = { x: win.x, y: win.y, width: win.width, height: win.height };
    }
  }, [win.x, win.y, win.width, win.height]);

  const applyTransform = useCallback(() => {
    const el = windowRef.current;
    if (!el) return;
    const { x, y, width, height } = posRef.current;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
  }, []);

  // ── Drag ──────────────────────────────────────────────────

  const onTitleBarPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      if ((e.target as HTMLElement).closest('button')) return;

      focusWindow(win.id);

      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        startWinX: posRef.current.x,
        startWinY: posRef.current.y,
      };

      e.currentTarget.setPointerCapture(e.pointerId);
      e.preventDefault();
    },
    [focusWindow, win.id],
  );

  const onTitleBarPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current.active) return;

      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      const vw = globalThis.innerWidth ?? 1440;
      const vh = globalThis.innerHeight ?? 900;

      const newX = Math.max(
        0,
        Math.min(dragRef.current.startWinX + dx, vw - posRef.current.width),
      );
      const newY = Math.max(
        MENU_BAR_HEIGHT,
        Math.min(dragRef.current.startWinY + dy, vh - DOCK_HEIGHT - 40),
      );

      posRef.current.x = newX;
      posRef.current.y = newY;

      requestAnimationFrame(applyTransform);
    },
    [applyTransform],
  );

  const onTitleBarPointerUp = useCallback(() => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    moveWindow(win.id, posRef.current.x, posRef.current.y);
  }, [moveWindow, win.id]);

  // ── Resize ────────────────────────────────────────────────

  const onResizePointerDown = useCallback(
    (edge: ResizeEdge) => (e: React.PointerEvent<HTMLDivElement>) => {
      e.stopPropagation();
      focusWindow(win.id);

      resizeRef.current = {
        active: true,
        edge,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: posRef.current.width,
        startHeight: posRef.current.height,
        startWinX: posRef.current.x,
        startWinY: posRef.current.y,
      };

      e.currentTarget.setPointerCapture(e.pointerId);
      e.preventDefault();
    },
    [focusWindow, win.id],
  );

  const onResizePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!resizeRef.current.active || !resizeRef.current.edge) return;

      const { startX, startY, startWidth, startHeight, startWinX, startWinY, edge } =
        resizeRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newX = startWinX;
      let newY = startWinY;
      let newW = startWidth;
      let newH = startHeight;

      if (edge.includes('right')) newW = startWidth + dx;
      if (edge.includes('bottom')) newH = startHeight + dy;
      if (edge.includes('left')) { newW = startWidth - dx; newX = startWinX + dx; }
      if (edge.includes('top')) { newH = startHeight - dy; newY = startWinY + dy; }

      posRef.current = { x: newX, y: newY, width: newW, height: newH };
      requestAnimationFrame(applyTransform);
    },
    [applyTransform],
  );

  const onResizePointerUp = useCallback(() => {
    if (!resizeRef.current.active) return;
    resizeRef.current.active = false;
    const { x, y, width, height } = posRef.current;
    resizeWindow(win.id, width, height, x, y);
  }, [resizeWindow, win.id]);

  // ── Styles ────────────────────────────────────────────────

  const isMaximized = win.isMaximized;

  const windowStyle: React.CSSProperties = isMaximized
    ? {
        position: 'fixed',
        left: 0,
        top: MENU_BAR_HEIGHT,
        width: '100%',
        height: `calc(100dvh - ${MENU_BAR_HEIGHT}px - ${DOCK_HEIGHT}px)`,
        zIndex: win.zIndex,
        transformOrigin: 'top center',
      }
    : {
        position: 'absolute',
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
        transformOrigin: 'bottom center',
      };

  if (!win.isOpen) return null;

  return (
    <motion.div
      ref={windowRef}
      style={windowStyle}
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ 
        opacity: win.isMinimized ? 0 : 1, 
        scale: win.isMinimized ? 0.35 : 1,
        y: win.isMinimized ? 400 : 0
      }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }}
      transition={{ 
        type: "spring", 
        stiffness: 320, 
        damping: 28, 
        mass: 1 
      }}
      className={cn(
        'flex flex-col',
        'overflow-hidden',
        win.isMinimized && 'pointer-events-none'
      )}
      onPointerDown={() => focusWindow(win.id)}
      role="dialog"
      aria-label={win.title}
      aria-modal="false"
    >
      {/* Window frame — provides shadow and border */}
      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{
          borderRadius: isMaximized ? 0 : 12,
          boxShadow: win.isFocused
            ? `0 0 0 0.5px rgba(255,255,255,0.15),
               0 4px 8px rgba(0,0,0,0.3),
               0 12px 28px rgba(0,0,0,0.5),
               0 32px 64px rgba(0,0,0,0.4)`
            : `0 0 0 0.5px rgba(255,255,255,0.08),
               0 2px 4px rgba(0,0,0,0.2),
               0 8px 16px rgba(0,0,0,0.35)`,
          border: '0.5px solid rgba(255,255,255,0.1)',
          transition: 'box-shadow 200ms ease, border-radius 200ms ease',
        }}
      >
        {/* ── Title bar ── */}
        <div
          className={cn(
            'relative flex items-center shrink-0',
            'h-[52px] px-4',
            'select-none',
            !isMaximized && 'cursor-grab active:cursor-grabbing',
          )}
          style={{
            background: win.isFocused
              ? 'rgba(38, 38, 42, 0.96)'
              : 'rgba(42, 42, 46, 0.92)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: '0.5px solid rgba(255,255,255,0.06)',
          }}
          onPointerDown={!isMaximized ? onTitleBarPointerDown : undefined}
          onPointerMove={!isMaximized ? onTitleBarPointerMove : undefined}
          onPointerUp={!isMaximized ? onTitleBarPointerUp : undefined}
          onDoubleClick={() => toggleMaximize(win.id)}
        >
          {/* Traffic lights */}
          <div
            className={cn(
              'flex items-center gap-2 z-10 group/lights',
              !win.isFocused && 'opacity-60',
            )}
            role="group"
            aria-label="Window controls"
          >
            <TrafficButton
              color="#FF5F57"
              hoverColor="#FF3B30"
              hoverIcon={<CloseIcon />}
              onClick={() => closeWindow(win.id)}
              aria-label={`Close ${win.title}`}
              title="Close"
              isFocused={win.isFocused}
            />
            <TrafficButton
              color="#FEBD2F"
              hoverColor="#FFA500"
              hoverIcon={<MinimizeIcon />}
              onClick={() => minimizeWindow(win.id)}
              aria-label={`Minimize ${win.title}`}
              title="Minimize"
              isFocused={win.isFocused}
            />
            <TrafficButton
              color="#27C840"
              hoverColor="#00B300"
              hoverIcon={<MaximizeIcon />}
              onClick={() => toggleMaximize(win.id)}
              aria-label={`${isMaximized ? 'Restore' : 'Maximize'} ${win.title}`}
              title={isMaximized ? 'Restore' : 'Maximize'}
              isFocused={win.isFocused}
            />
          </div>

          {/* Window title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className={cn(
                'text-[13px] font-medium',
                win.isFocused ? 'text-white/80' : 'text-white/35',
                'transition-colors duration-200',
                'truncate max-w-[60%]',
              )}
            >
              {win.title}
            </span>
          </div>
        </div>

        {/* ── Content area ── */}
        <div
          className="flex-1 overflow-hidden relative"
          style={{
            background: 'rgba(18, 18, 22, 0.98)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
        >
          {children}
        </div>
      </div>

      {/* Resize handles — only when not maximized */}
      {!isMaximized && (
        <ResizeHandles
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
        />
      )}
    </motion.div>
  );
}

// ── Traffic light button ───────────────────────────────────

interface TrafficButtonProps {
  color: string;
  hoverColor: string;
  hoverIcon: React.ReactNode;
  onClick: () => void;
  isFocused: boolean;
  'aria-label': string;
  title: string;
}

function TrafficButton({ color, hoverColor, hoverIcon, onClick, isFocused, ...props }: TrafficButtonProps) {
  return (
    <button
      className={cn(
        'w-[13px] h-[13px] rounded-full',
        'flex items-center justify-center',
        'group/traffic',
        'transition-all duration-100',
        'focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-1',
        // When unfocused, show gray dots instead of colors
        !isFocused && 'group-hover/lights:!opacity-100',
      )}
      style={{
        background: isFocused ? color : 'rgba(255,255,255,0.15)',
        boxShadow: isFocused
          ? `inset 0 0 0 0.5px rgba(0,0,0,0.2), 0 0.5px 1px rgba(0,0,0,0.15)`
          : 'none',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = hoverColor;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = isFocused ? color : 'rgba(255,255,255,0.15)';
      }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      {...props}
    >
      <span className="opacity-0 group-hover/traffic:opacity-100 transition-opacity duration-75">
        {hoverIcon}
      </span>
    </button>
  );
}

// Tiny SVG icons for traffic lights
const CloseIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="rgba(70,0,0,0.7)" strokeWidth="1.4" strokeLinecap="round">
    <line x1="2" y1="2" x2="6" y2="6" />
    <line x1="6" y1="2" x2="2" y2="6" />
  </svg>
);

const MinimizeIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="rgba(100,60,0,0.7)" strokeWidth="1.4" strokeLinecap="round">
    <line x1="1.5" y1="4" x2="6.5" y2="4" />
  </svg>
);

const MaximizeIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="rgba(0,60,0,0.7)" strokeWidth="1.2" strokeLinecap="round">
    <path d="M1.5 5.5 L1.5 1.5 L5.5 1.5" />
    <path d="M6.5 2.5 L6.5 6.5 L2.5 6.5" />
  </svg>
);

// ── Resize handles ─────────────────────────────────────────

type ResizeEdge =
  | 'top' | 'bottom' | 'left' | 'right'
  | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface ResizeHandlesProps {
  onPointerDown: (edge: ResizeEdge) => (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
}

const RESIZE_HANDLE_SIZE = 6;

function ResizeHandles({ onPointerDown, onPointerMove, onPointerUp }: ResizeHandlesProps) {
  const edges: { edge: ResizeEdge; style: React.CSSProperties; cursor: string }[] = [
    { edge: 'top', style: { top: 0, left: RESIZE_HANDLE_SIZE, right: RESIZE_HANDLE_SIZE, height: RESIZE_HANDLE_SIZE }, cursor: 'ns-resize' },
    { edge: 'bottom', style: { bottom: 0, left: RESIZE_HANDLE_SIZE, right: RESIZE_HANDLE_SIZE, height: RESIZE_HANDLE_SIZE }, cursor: 'ns-resize' },
    { edge: 'left', style: { top: RESIZE_HANDLE_SIZE, bottom: RESIZE_HANDLE_SIZE, left: 0, width: RESIZE_HANDLE_SIZE }, cursor: 'ew-resize' },
    { edge: 'right', style: { top: RESIZE_HANDLE_SIZE, bottom: RESIZE_HANDLE_SIZE, right: 0, width: RESIZE_HANDLE_SIZE }, cursor: 'ew-resize' },
    { edge: 'top-left', style: { top: 0, left: 0, width: RESIZE_HANDLE_SIZE, height: RESIZE_HANDLE_SIZE }, cursor: 'nwse-resize' },
    { edge: 'top-right', style: { top: 0, right: 0, width: RESIZE_HANDLE_SIZE, height: RESIZE_HANDLE_SIZE }, cursor: 'nesw-resize' },
    { edge: 'bottom-left', style: { bottom: 0, left: 0, width: RESIZE_HANDLE_SIZE, height: RESIZE_HANDLE_SIZE }, cursor: 'nesw-resize' },
    { edge: 'bottom-right', style: { bottom: 0, right: 0, width: RESIZE_HANDLE_SIZE, height: RESIZE_HANDLE_SIZE }, cursor: 'nwse-resize' },
  ];

  return (
    <>
      {edges.map(({ edge, style, cursor }) => (
        <div
          key={edge}
          style={{ ...style, position: 'absolute', zIndex: 10, cursor }}
          onPointerDown={onPointerDown(edge)}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
