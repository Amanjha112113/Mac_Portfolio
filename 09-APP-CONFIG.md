# 11. `09-APP-CONFIG.md`

Your existing config-driven design is good and should remain the source of truth. :contentReference[oaicite:6]{index=6}

I would change it to:

```typescript
export interface AppConfig {
  id: string;
  title: string;
  icon: string;
  component: string;
  defaultSize: {
    width: number;
    height: number;
  };
  minSize: {
    width: number;
    height: number;
  };
  lazy: boolean;
  dock: boolean;
  launchpad: boolean;
  searchable: boolean;
}

Then:

export const APPS: AppConfig[] = [
  {
    id: "launchpad",
    title: "Launchpad",
    icon: "Grid",
    component: "Launchpad",
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 500, height: 400 },
    lazy: false,
    dock: true,
    launchpad: true,
    searchable: true
  },

  // ...

  {
    id: "voice",
    title: "Aman AI",
    icon: "Mic",
    component: "VoiceAssistant",
    defaultSize: { width: 620, height: 680 },
    minSize: { width: 420, height: 520 },
    lazy: true,
    dock: true,
    launchpad: true,
    searchable: true
  }
];