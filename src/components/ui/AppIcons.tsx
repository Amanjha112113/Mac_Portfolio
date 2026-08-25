'use client';

import React from 'react';

interface IconWrapperProps {
  gradient: string;
  children: React.ReactNode;
  size?: number;
  className?: string;
  shadow?: boolean;
}

/**
 * Squircle icon wrapper — creates the macOS-style rounded rectangle
 * with glossy highlight, depth shadow, and gradient background.
 */
export function IconWrapper({
  gradient,
  children,
  size = 48,
  className = '',
  shadow = true,
}: IconWrapperProps) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        background: gradient,
        boxShadow: shadow
          ? `0 1px 3px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)`
          : 'none',
        overflow: 'hidden',
      }}
    >
      {/* Glossy highlight */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 100%)',
          borderRadius: `${size * 0.22}px ${size * 0.22}px 0 0`,
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
}

/* ─── Finder ─────────────────────────────────────────────── */
export function FinderIcon({ size = 48 }: { size?: number }) {
  const innerSize = size * 0.65;
  return (
    <IconWrapper size={size} gradient="linear-gradient(180deg, #A1C4FD 0%, #C2E9FB 100%)">
      <svg width={innerSize} height={innerSize} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M42 6H6C3.79 6 2 7.79 2 10V38C2 40.21 3.79 42 6 42H42C44.21 42 46 40.21 46 38V10C46 7.79 44.21 6 42 6Z" fill="#29B6F6"/>
        <path d="M24 6V42C24 42 16.5 35 16.5 24C16.5 13 24 6 24 6Z" fill="#0288D1"/>
        <path d="M24 6V42C24 42 31.5 35 31.5 24C31.5 13 24 6 24 6Z" fill="#03A9F4"/>
        <path d="M12 20C13.6569 20 15 18.6569 15 17C15 15.3431 13.6569 14 12 14C10.3431 14 9 15.3431 9 17C9 18.6569 10.3431 20 12 20Z" fill="#FFFFFF"/>
        <path d="M36 20C37.6569 20 39 18.6569 39 17C39 15.3431 37.6569 14 36 14C34.3431 14 33 15.3431 33 17C33 18.6569 34.3431 20 36 20Z" fill="#FFFFFF"/>
        <path d="M14 28C14 28 17 34 24 34C31 34 34 28 34 28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
        <path d="M24 16V28H21" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </IconWrapper>
  );
}

/* ─── Safari ─────────────────────────────────────────────── */
export function SafariIcon({ size = 48 }: { size?: number }) {
  const innerSize = size * 0.7;
  return (
    <IconWrapper size={size} gradient="linear-gradient(180deg, #FFFFFF 0%, #ECEFF1 100%)">
      <svg width={innerSize} height={innerSize} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="26" fill="url(#safari-grad)" stroke="#0D47A1" strokeWidth="1.5"/>
        <circle cx="32" cy="32" r="23" stroke="#FFF" strokeWidth="1" strokeDasharray="2,2" opacity="0.6"/>
        <path d="M44 20L35 35L20 44L29 29L44 20Z" fill="url(#safari-needle-red)"/>
        <path d="M20 44L29 29L35 35L20 44Z" fill="url(#safari-needle-blue)"/>
        <circle cx="32" cy="32" r="2.5" fill="#FFF" stroke="#0D47A1" strokeWidth="1"/>
        <defs>
          <linearGradient id="safari-grad" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4FC3F7"/>
            <stop offset="100%" stopColor="#1565C0"/>
          </linearGradient>
          <linearGradient id="safari-needle-red" x1="20" y1="20" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF1744"/>
            <stop offset="100%" stopColor="#D50000"/>
          </linearGradient>
          <linearGradient id="safari-needle-blue" x1="20" y1="44" x2="35" y2="29" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E0F7FA"/>
            <stop offset="100%" stopColor="#B2EBF2"/>
          </linearGradient>
        </defs>
      </svg>
    </IconWrapper>
  );
}

/* ─── Terminal ───────────────────────────────────────────── */
export function TerminalIcon({ size = 48 }: { size?: number }) {
  const innerSize = size * 0.6;
  return (
    <IconWrapper size={size} gradient="linear-gradient(180deg, #37474F 0%, #212121 100%)">
      <svg width={innerSize} height={innerSize} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="40" height="36" rx="6" fill="#1e1e24" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <path d="M12 16L20 22L12 28" stroke="#38EF7D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="22" y1="28" x2="34" y2="28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </IconWrapper>
  );
}

/* ─── Music / Spotify ────────────────────────────────────── */
export function MusicIcon({ size = 48 }: { size?: number }) {
  const innerSize = size * 0.65;
  return (
    <IconWrapper size={size} gradient="linear-gradient(180deg, #1f1f23 0%, #121214 100%)">
      <svg width={innerSize} height={innerSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-1.022-.336.073-.668-.14-.74-.476-.072-.335.14-.668.477-.74 3.847-.878 7.14-.51 9.81.127.294.18.386.565.206.86zm1.225-2.72c-.227.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.076-1.182-.413.125-.85-.107-.975-.52-.125-.413.107-.85.52-.975 3.66-1.11 8.224-.567 11.343 1.35.367.228.488.708.262 1.075zm.106-2.833C14.692 8.98 9.243 8.8 6.07 9.762c-.493.15-1.012-.13-1.162-.624-.15-.493.13-1.012.624-1.162 3.655-1.11 9.65-.9 13.385 1.317.444.263.59.837.327 1.28-.263.444-.838.59-1.28.327z" fill="#1DB954"/>
      </svg>
    </IconWrapper>
  );
}

/* ─── Messages / Slack ───────────────────────────────────── */
export function MessagesIcon({ size = 48 }: { size?: number }) {
  const innerSize = size * 0.65;
  return (
    <IconWrapper size={size} gradient="linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)">
      <svg width={innerSize} height={innerSize} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 55.5C22 49.7 26.7 45 32.5 45C38.3 45 43 49.7 43 55.5V66C43 71.8 38.3 76.5 32.5 76.5C26.7 76.5 22 71.8 22 66V55.5Z" fill="#36C5F0"/>
        <path d="M32.5 35C38.3 35 43 30.3 43 24.5C43 18.7 38.3 14 32.5 14C26.7 14 22 18.7 22 24.5V35H32.5Z" fill="#E01E5A"/>
        <path d="M45 32.5C45 38.3 49.7 43 55.5 43H66C71.8 43 76.5 38.3 76.5 32.5C76.5 26.7 71.8 22 66 22H55.5V32.5Z" fill="#ECB22E"/>
        <path d="M67.5 45C61.7 45 57 49.7 57 55.5C57 61.3 61.7 66 67.5 66H78C83.8 66 88.5 61.3 88.5 55.5C88.5 49.7 83.8 45 78 45H67.5Z" fill="#2EB67D"/>
        <path d="M57 67.5C57 61.7 61.7 57 67.5 57C73.3 57 78 61.7 78 67.5V78C78 83.8 73.3 88.5 67.5 88.5C61.7 88.5 57 83.8 57 78V67.5Z" fill="#36C5F0"/>
        <path d="M45 67.5C45 61.7 40.3 57 34.5 57H24C18.2 57 13.5 61.7 13.5 67.5C13.5 73.3 18.2 78 24 78H34.5V67.5Z" fill="#E01E5A"/>
        <path d="M45 55.5C45 49.7 49.7 45 55.5 45C61.3 45 66 49.7 66 55.5V66C66 71.8 61.3 76.5 55.5 76.5C49.7 76.5 45 71.8 45 66V55.5Z" fill="#ECB22E"/>
        <path d="M55.5 35C49.7 35 45 30.3 45 24.5V14C45 8.2 49.7 3.5 55.5 3.5C61.3 3.5 66 8.2 66 14V24.5C66 30.3 61.3 35 55.5 35Z" fill="#2EB67D"/>
      </svg>
    </IconWrapper>
  );
}

/* ─── Calendar ───────────────────────────────────────────── */
export function CalendarIcon({ size = 48 }: { size?: number }) {
  const day = new Date().getDate();
  const month = new Date().toLocaleString('en', { month: 'short' }).toUpperCase();
  const s = size * 0.72;
  return (
    <IconWrapper size={size} gradient="linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)">
      <div
        style={{
          width: s,
          height: s,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Red header bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '32%',
            background: 'linear-gradient(180deg, #FF3B30, #D32F2F)',
            borderRadius: `${size * 0.04}px ${size * 0.04}px 0 0`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: size * 0.14,
              fontWeight: 700,
              color: 'white',
              letterSpacing: '0.5px',
            }}
          >
            {month}
          </span>
        </div>
        {/* Day number */}
        <span
          style={{
            fontSize: size * 0.34,
            fontWeight: 300,
            color: '#1a1a1a',
            marginTop: size * 0.12,
            lineHeight: 1,
          }}
        >
          {day}
        </span>
      </div>
    </IconWrapper>
  );
}

/* ─── Maps ───────────────────────────────────────────────── */
export function MapsIcon({ size = 48 }: { size?: number }) {
  const innerSize = size * 0.65;
  return (
    <IconWrapper size={size} gradient="linear-gradient(180deg, #81C784 0%, #43A047 100%)">
      <svg width={innerSize} height={innerSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" fill="none" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
        <circle cx="12" cy="11" r="2" fill="currentColor" />
        <path d="M12 2C9 5 9 9 12 13C15 9 15 5 12 2Z" fill="currentColor" />
      </svg>
    </IconWrapper>
  );
}

/* ─── Photos ─────────────────────────────────────────────── */
export function PhotosIcon({ size = 48 }: { size?: number }) {
  const innerSize = size * 0.65;
  return (
    <IconWrapper size={size} gradient="linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)">
      <svg width={innerSize} height={innerSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C10.9 2 10 2.9 10 4V12H2V14H10V20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20V14H22V12H14V4C14 2.9 13.1 2 12 2Z" fill="#FF2D55" opacity="0.8"/>
        <path d="M4 10H12V2H14V10H22V12H14V20H12V12H4V10Z" fill="#FF9500" transform="rotate(45 12 12)" opacity="0.8"/>
        <path d="M12 6C8.7 6 6 8.7 6 12C6 15.3 8.7 18 12 18C15.3 18 18 15.3 18 12C18 8.7 15.3 6 12 6Z" fill="#34A853" opacity="0.6"/>
      </svg>
    </IconWrapper>
  );
}

/* ─── Notes ──────────────────────────────────────────────── */
export function NotesIcon({ size = 48 }: { size?: number }) {
  const innerSize = size * 0.65;
  return (
    <IconWrapper size={size} gradient="linear-gradient(180deg, #FFF9C4 0%, #FFC107 100%)">
      <svg width={innerSize} height={innerSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-900">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    </IconWrapper>
  );
}

/* ─── System Settings ────────────────────────────────────── */
export function SystemSettingsIcon({ size = 48 }: { size?: number }) {
  const innerSize = size * 0.65;
  return (
    <IconWrapper size={size} gradient="linear-gradient(180deg, #CFD8DC 0%, #90A4AE 100%)">
      <svg width={innerSize} height={innerSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </IconWrapper>
  );
}

/* ─── App Store ──────────────────────────────────────────── */
export function AppStoreIcon({ size = 48 }: { size?: number }) {
  const innerSize = size * 0.65;
  return (
    <IconWrapper size={size} gradient="linear-gradient(180deg, #29B6F6 0%, #0288D1 100%)">
      <svg width={innerSize} height={innerSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="3" />
      </svg>
    </IconWrapper>
  );
}

/* ─── Trash ──────────────────────────────────────────────── */
export function TrashIcon({ size = 48 }: { size?: number }) {
  const innerSize = size * 0.65;
  return (
    <IconWrapper size={size} gradient="linear-gradient(180deg, #CFD8DC 0%, #78909C 100%)">
      <svg width={innerSize} height={innerSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    </IconWrapper>
  );
}

/* ─── Launchpad ──────────────────────────────────────────── */
export function LaunchpadIcon({ size = 48 }: { size?: number }) {
  const innerSize = size * 0.65;
  return (
    <IconWrapper size={size} gradient="linear-gradient(180deg, #424242 0%, #212121 100%)">
      <svg width={innerSize} height={innerSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <rect x="3" y="3" width="7" height="7" fill="currentColor" />
        <rect x="14" y="3" width="7" height="7" fill="currentColor" />
        <rect x="14" y="14" width="7" height="7" fill="currentColor" />
        <rect x="3" y="14" width="7" height="7" fill="currentColor" />
      </svg>
    </IconWrapper>
  );
}

/* ─── Voice / Aman AI ────────────────────────────────────── */
export function VoiceIcon({ size = 48 }: { size?: number }) {
  const innerSize = size * 0.65;
  return (
    <IconWrapper size={size} gradient="linear-gradient(135deg, #7C4DFF 0%, #651FFF 50%, #4A148C 100%)">
      <svg width={innerSize} height={innerSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" fill="currentColor" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    </IconWrapper>
  );
}

/* ─── Icon Map ───────────────────────────────────────────── */
export const APP_ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  Folder: FinderIcon,
  Globe: SafariIcon,
  Terminal: TerminalIcon,
  Music: MusicIcon,
  MessageSquare: MessagesIcon,
  Calendar: CalendarIcon,
  Map: MapsIcon,
  Image: PhotosIcon,
  FileText: NotesIcon,
  Settings: SystemSettingsIcon,
  ShoppingBag: AppStoreIcon,
  Trash2: TrashIcon,
  Grid3x3: LaunchpadIcon,
  Mic: VoiceIcon,
};
