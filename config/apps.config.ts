/**
 * apps.config.ts
 * Single source of truth for all application definitions.
 * The dock, launchpad, spotlight, and window manager all derive
 * their data from this file. Do NOT hardcode app definitions elsewhere.
 */

export interface AppConfig {
  /** Unique application identifier. Used as a stable key throughout the system. */
  id: string;
  /** Display title shown in dock tooltip, window title bar, launchpad. */
  title: string;
  /** Lucide icon name or emoji fallback for icon. */
  icon: string;
  /** Component name — resolved dynamically via the app registry. */
  component: string;
  /** Default window dimensions on open. */
  defaultSize: {
    width: number;
    height: number;
  };
  /** Minimum window dimensions enforced by the window manager. */
  minSize: {
    width: number;
    height: number;
  };
  /** If true, the component is dynamically imported (code-split chunk). */
  lazy: boolean;
  /** If true, appears in the dock. */
  dock: boolean;
  /** If true, appears in the launchpad grid. */
  launchpad: boolean;
  /** If true, included in spotlight and launchpad search results. */
  searchable: boolean;
  /** Short description for spotlight/search results. */
  description?: string;
  /** Keywords for spotlight search. */
  keywords?: string[];
}

export const APPS: AppConfig[] = [
  {
    id: 'finder',
    title: 'Finder',
    icon: 'Folder',
    component: 'Finder',
    defaultSize: { width: 860, height: 560 },
    minSize: { width: 600, height: 400 },
    lazy: false,
    dock: true,
    launchpad: true,
    searchable: true,
    description: 'Browse projects and files',
    keywords: ['files', 'projects', 'browse', 'folder'],
  },
  {
    id: 'safari',
    title: 'Safari',
    icon: 'Globe',
    component: 'Safari',
    defaultSize: { width: 960, height: 640 },
    minSize: { width: 640, height: 480 },
    lazy: true,
    dock: true,
    launchpad: true,
    searchable: true,
    description: 'Browse the web and portfolio links',
    keywords: ['browser', 'web', 'github', 'links'],
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: 'Terminal',
    component: 'Terminal',
    defaultSize: { width: 720, height: 480 },
    minSize: { width: 520, height: 360 },
    lazy: true,
    dock: true,
    launchpad: true,
    searchable: true,
    description: 'Portfolio terminal — type help to start',
    keywords: ['terminal', 'shell', 'cli', 'command'],
  },
  {
    id: 'music',
    title: 'Music',
    icon: 'Music',
    component: 'Music',
    defaultSize: { width: 800, height: 520 },
    minSize: { width: 600, height: 400 },
    lazy: true,
    dock: true,
    launchpad: true,
    searchable: true,
    description: 'Aman\'s listening history',
    keywords: ['music', 'spotify', 'playlist'],
  },
  {
    id: 'messages',
    title: 'Messages',
    icon: 'MessageSquare',
    component: 'Messages',
    defaultSize: { width: 720, height: 520 },
    minSize: { width: 520, height: 400 },
    lazy: true,
    dock: true,
    launchpad: true,
    searchable: true,
    description: 'Contact Aman',
    keywords: ['contact', 'message', 'email', 'reach out'],
  },
  {
    id: 'calendar',
    title: 'Calendar',
    icon: 'Calendar',
    component: 'Calendar',
    defaultSize: { width: 760, height: 560 },
    minSize: { width: 560, height: 420 },
    lazy: true,
    dock: true,
    launchpad: true,
    searchable: true,
    description: 'Timeline and availability',
    keywords: ['calendar', 'schedule', 'timeline', 'events'],
  },
  {
    id: 'maps',
    title: 'Maps',
    icon: 'Map',
    component: 'Maps',
    defaultSize: { width: 800, height: 560 },
    minSize: { width: 560, height: 400 },
    lazy: true,
    dock: false,
    launchpad: true,
    searchable: true,
    description: 'Aman\'s location',
    keywords: ['map', 'location', 'where'],
  },
  {
    id: 'photos',
    title: 'Photos',
    icon: 'Image',
    component: 'Photos',
    defaultSize: { width: 860, height: 600 },
    minSize: { width: 600, height: 440 },
    lazy: true,
    dock: false,
    launchpad: true,
    searchable: true,
    description: 'Project screenshots and gallery',
    keywords: ['photos', 'gallery', 'screenshots', 'images'],
  },
  {
    id: 'notes',
    title: 'Notes',
    icon: 'FileText',
    component: 'Notes',
    defaultSize: { width: 680, height: 520 },
    minSize: { width: 480, height: 380 },
    lazy: false,
    dock: true,
    launchpad: true,
    searchable: true,
    description: 'About Aman — bio, skills, and notes',
    keywords: ['about', 'bio', 'skills', 'notes'],
  },
  {
    id: 'system-settings',
    title: 'System Settings',
    icon: 'Settings',
    component: 'SystemSettings',
    defaultSize: { width: 820, height: 580 },
    minSize: { width: 620, height: 440 },
    lazy: true,
    dock: false,
    launchpad: true,
    searchable: true,
    description: 'Resume, education, and system info',
    keywords: ['settings', 'resume', 'cv', 'education', 'about'],
  },
  {
    id: 'app-store',
    title: 'App Store',
    icon: 'ShoppingBag',
    component: 'AppStore',
    defaultSize: { width: 880, height: 620 },
    minSize: { width: 640, height: 480 },
    lazy: true,
    dock: true,
    launchpad: true,
    searchable: true,
    description: 'Browse all of Aman\'s projects',
    keywords: ['projects', 'portfolio', 'apps', 'store'],
  },
  {
    id: 'trash',
    title: 'Trash',
    icon: 'Trash2',
    component: 'Trash',
    defaultSize: { width: 560, height: 400 },
    minSize: { width: 420, height: 320 },
    lazy: false,
    dock: true,
    launchpad: false,
    searchable: false,
  },
  {
    id: 'launchpad',
    title: 'Launchpad',
    icon: 'Grid3x3',
    component: 'Launchpad',
    defaultSize: { width: 0, height: 0 }, // fullscreen overlay
    minSize: { width: 0, height: 0 },
    lazy: false,
    dock: true,
    launchpad: false,
    searchable: false,
    description: 'All applications',
    keywords: ['apps', 'applications', 'launcher'],
  },
  {
    id: 'voice',
    title: 'Aman AI',
    icon: 'Mic',
    component: 'VoiceAssistant',
    defaultSize: { width: 620, height: 680 },
    minSize: { width: 420, height: 520 },
    lazy: true,
    dock: true,
    launchpad: true,
    searchable: true,
    description: 'Talk to Aman\'s AI assistant',
    keywords: ['ai', 'voice', 'assistant', 'talk', 'chat'],
  },
];

/** Look up a single app by ID. Throws if not found. */
export function getApp(id: string): AppConfig {
  const app = APPS.find((a) => a.id === id);
  if (!app) throw new Error(`App not found: ${id}`);
  return app;
}

/** Apps that appear in the dock, in order. */
export const DOCK_APPS = APPS.filter((a) => a.dock);

/** Apps that appear in the launchpad grid. */
export const LAUNCHPAD_APPS = APPS.filter((a) => a.launchpad);

/** Apps included in spotlight search. */
export const SEARCHABLE_APPS = APPS.filter((a) => a.searchable);
