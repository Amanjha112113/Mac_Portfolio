'use client';

/**
 * Dock — macOS-inspired application dock with magnification.
 *
 * Key behaviors:
 * - Floating glass pill at the bottom of the viewport
 * - Magnification effect on hover (pure CSS transform)
 * - Neighbour-aware scaling: adjacent icons scale slightly
 * - Active dot indicator for open apps
 * - Separator before Trash
 * - Tooltip on hover
 * - Bounce animation on app launch
 */

import { useRef, useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/cn';
import { useWindowStore } from '@/stores/useWindowStore';
import { DOCK_APPS } from '@config/apps.config';
import { APP_ICON_MAP } from '@/components/ui/AppIcons';
import type { AppConfig } from '@config/apps.config';

const ICON_SIZE = 52;
const ICON_SIZE_MAX = 72;
const MAGNIFICATION_RANGE = 200; // px range for magnification effect

interface DockIconProps {
  app: AppConfig;
  isOpen: boolean;
  isBouncing: boolean;
  scale: number;
  onClick?: () => void;
}

function DockIcon({ app, isOpen, isBouncing, scale, onClick }: DockIconProps) {
  const openApp = useWindowStore((s) => s.openApp);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      openApp(app.id);
    }
  }, [app.id, openApp, onClick]);

  const IconComponent = APP_ICON_MAP[app.icon];

  const iconSize = ICON_SIZE * scale;

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      <div
        className={cn(
          'absolute bottom-full mb-2 px-3 py-1.5',
          'rounded-lg text-[12px] font-medium text-white/95',
          'pointer-events-none select-none',
          'transition-all duration-150 ease-out',
          showTooltip
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-2',
        )}
        style={{
          background: 'rgba(30, 30, 30, 0.92)',
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.1)',
          whiteSpace: 'nowrap',
          zIndex: 10,
        }}
        role="tooltip"
      >
        {app.title}
        {/* Tooltip arrow */}
        <div
          style={{
            position: 'absolute',
            bottom: -4,
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: 8,
            height: 8,
            background: 'rgba(30, 30, 30, 0.92)',
          }}
        />
      </div>

      {/* Icon container with magnification */}
      <button
        onClick={handleClick}
        className={cn(
          'relative flex items-center justify-center',
          'cursor-default',
          'transition-[filter] duration-100',
          'hover:brightness-110',
          'focus-visible:outline-2 focus-visible:outline-[var(--color-accent-blue)] focus-visible:outline-offset-2',
          isBouncing && 'animate-dock-bounce',
        )}
        style={{
          width: iconSize,
          height: iconSize,
          marginBottom: (iconSize - ICON_SIZE) / 2,
          transition: 'width 150ms ease-out, height 150ms ease-out, margin-bottom 150ms ease-out',
        }}
        aria-label={`Open ${app.title}`}
        title={app.title}
      >
        {IconComponent ? (
          <IconComponent size={iconSize} />
        ) : (
          <div
            style={{
              width: iconSize,
              height: iconSize,
              borderRadius: iconSize * 0.22,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: iconSize * 0.45,
            }}
          >
            {app.icon}
          </div>
        )}
      </button>

      {/* Active dot indicator */}
      <div
        className={cn(
          'w-1 h-1 rounded-full',
          'transition-all duration-200 ease-out',
          isOpen
            ? 'bg-white/80 opacity-100 scale-100'
            : 'opacity-0 scale-0',
        )}
        style={{ marginTop: 2 }}
        aria-hidden="true"
      />
    </div>
  );
}

interface DockProps {
  onLaunchpad?: () => void;
}

export function Dock({ onLaunchpad }: DockProps) {
  const windows = useWindowStore((s) => s.windows);
  const dockRef = useRef<HTMLElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [dockRect, setDockRect] = useState<{ left: number; width: number } | null>(null);
  const [bouncingApp, setBouncingApp] = useState<string | null>(null);

  // Determine which apps have open windows
  const openAppIds = useMemo(() => {
    const ids = new Set<string>();
    Object.values(windows).forEach((w) => {
      if (w.isOpen) ids.add(w.appId);
    });
    return ids;
  }, [windows]);

  // Track mouse position for magnification — also capture dock rect from the ref in the event handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX);
    if (dockRef.current) {
      const r = dockRef.current.getBoundingClientRect();
      setDockRect({ left: r.left, width: r.width });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
    setDockRect(null);
  }, []);

  // Calculate scale for each icon based on mouse proximity (uses dockRect state instead of reading ref during render)
  const getScale = useCallback(
    (index: number): number => {
      if (mouseX === null || !dockRect) return 1;

      const iconCount = DOCK_APPS.length;
      const totalWidth = dockRect.width;
      const iconSpacing = totalWidth / iconCount;
      const iconCenter = dockRect.left + iconSpacing * (index + 0.5);
      const distance = Math.abs(mouseX - iconCenter);

      if (distance > MAGNIFICATION_RANGE) return 1;

      const maxScale = ICON_SIZE_MAX / ICON_SIZE;
      return 1 + (maxScale - 1) * Math.cos((distance / MAGNIFICATION_RANGE) * (Math.PI / 2));
    },
    [mouseX, dockRect],
  );

  const handleAppClick = useCallback(
    (appId: string) => {
      setBouncingApp(appId);
      setTimeout(() => setBouncingApp(null), 600);
    },
    [],
  );

  return (
    <nav
      ref={dockRef}
      className={cn(
        'fixed bottom-2 left-1/2 -translate-x-1/2',
        'z-[8000]',
        'flex items-end px-3 pb-2 pt-1.5',
      )}
      style={{
        gap: '2px',
        borderRadius: 18,
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(40px) saturate(200%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
        border: '0.5px solid rgba(255, 255, 255, 0.18)',
        boxShadow: `
          0 0 0 0.5px rgba(255, 255, 255, 0.08),
          0 8px 32px rgba(0, 0, 0, 0.5),
          0 24px 64px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.12),
          inset 0 -1px 0 rgba(0, 0, 0, 0.1)
        `,
      }}
      role="navigation"
      aria-label="Dock"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {DOCK_APPS.map((app, index) => {
        const isTrash = app.id === 'trash';
        const prevApp = DOCK_APPS[index - 1];
        const showSeparator = isTrash && prevApp && prevApp.id !== 'trash';
        const isLaunchpad = app.id === 'launchpad';

        return (
          <div key={app.id} className="flex items-end" style={{ gap: '2px' }}>
            {showSeparator && (
              <div
                className="self-stretch mx-1.5"
                style={{
                  width: 1,
                  background: 'rgba(255, 255, 255, 0.15)',
                }}
                aria-hidden="true"
              />
            )}
            <DockIcon
              app={app}
              isOpen={openAppIds.has(app.id)}
              isBouncing={bouncingApp === app.id}
              scale={getScale(index)}
              onClick={
                isLaunchpad
                  ? onLaunchpad
                  : () => handleAppClick(app.id)
              }
            />
          </div>
        );
      })}
    </nav>
  );
}
