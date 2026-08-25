'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * AppRegistry — maps app component names to dynamic imports.
 * All heavy applications are code-split here so they do NOT
 * load during initial page render.
 *
 * Loading fallback is a simple placeholder so the window
 * renders immediately while the chunk loads.
 */

function AppLoader() {
  return (
    <div className="flex-1 flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
        <span className="text-white/40 text-sm">Loading…</span>
      </div>
    </div>
  );
}

import FinderApp from './apps/Finder';
import NotesApp from './apps/Notes';

function TrashApp() {
  return (
    <div className="flex-1 flex items-center justify-center h-full selectable">
      <p className="text-white/40 text-sm">Trash — Empty</p>
    </div>
  );
}

function LaunchpadApp() {
  return (
    <div className="flex-1 flex items-center justify-center h-full selectable">
      <p className="text-white/40 text-sm">Launchpad is an overlay, not a window app.</p>
    </div>
  );
}

// Lazy apps — each is a separate code-split chunk
const SafariApp = dynamic(() => import('./apps/Safari'), { loading: AppLoader });
const TerminalApp = dynamic(() => import('./apps/Terminal'), { loading: AppLoader });
const MusicApp = dynamic(() => import('./apps/Music'), { loading: AppLoader });
const MessagesApp = dynamic(() => import('./apps/Messages'), { loading: AppLoader });
const CalendarApp = dynamic(() => import('./apps/Calendar'), { loading: AppLoader });
const MapsApp = dynamic(() => import('./apps/Maps'), { loading: AppLoader });
const PhotosApp = dynamic(() => import('./apps/Photos'), { loading: AppLoader });
const SystemSettingsApp = dynamic(() => import('./apps/SystemSettings'), { loading: AppLoader });
const AppStoreApp = dynamic(() => import('./apps/AppStore'), { loading: AppLoader });
const VoiceAssistantApp = dynamic(() => import('./apps/VoiceAssistant'), { loading: AppLoader });

const COMPONENT_MAP: Record<string, ComponentType> = {
  Finder: FinderApp,
  Safari: SafariApp,
  Terminal: TerminalApp,
  Music: MusicApp,
  Messages: MessagesApp,
  Calendar: CalendarApp,
  Maps: MapsApp,
  Photos: PhotosApp,
  Notes: NotesApp,
  SystemSettings: SystemSettingsApp,
  AppStore: AppStoreApp,
  Trash: TrashApp,
  Launchpad: LaunchpadApp,
  VoiceAssistant: VoiceAssistantApp,
};

interface AppRendererProps {
  componentName: string;
}

export function AppRenderer({ componentName }: AppRendererProps) {
  const Component = COMPONENT_MAP[componentName];

  if (!Component) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <p className="text-white/40 text-sm">Unknown app: {componentName}</p>
      </div>
    );
  }

  return <Component />;
}
