# System Architecture

## High-Level

Browser
  │
  ├── Desktop UI
  │
  ├── Window Manager
  │
  ├── Application Registry
  │
  └── Voice Assistant
          │
          │ WebRTC
          ▼
      Voice Gateway
          │
          ▼
      Voice Runtime
          │
     ┌────┼────┐
     ▼    ▼    ▼
    VAD   ASR  LLM
              │
              ▼
             TTS
              │
              ▼
          Audio Output

Voice Runtime
      │
      ▼
Agent Runtime
      │
      ├── Portfolio Search
      ├── Project Search
      ├── GitHub Tool
      ├── Resume Tool
      ├── Open App Tool
      └── Navigation Tool