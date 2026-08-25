# Aman Jha — Interactive macOS-Inspired AI Portfolio
## Master Engineering Specification

## 1. Project Identity

Build a production-quality, macOS-inspired interactive portfolio for Aman Jha.

This is NOT a pixel-perfect Apple/macOS clone.

It is an original portfolio application inspired by desktop operating-system interaction patterns.

The portfolio should communicate:

- AI/ML engineering
- Agentic AI
- Real-time voice AI
- Full-stack development
- Computer vision
- Data science
- Software engineering
- Projects
- GitHub activity
- Achievements
- Resume
- Technical personality

The desktop UI is the presentation layer.

The actual portfolio content and engineering systems are the product.

---

## 2. Primary Technical Goals

The application must prioritize:

1. Very low perceived latency.
2. Fast initial page rendering.
3. Smooth 60 FPS interaction where practical.
4. Lazy loading of expensive applications.
5. No unnecessary API requests.
6. Minimal JavaScript shipped to the initial page.
7. Responsive behavior across desktop and laptop screens.
8. Keyboard accessibility.
9. Robust window management.
10. Real-time conversational voice interaction.
11. Interruptible voice responses.
12. Provider-independent AI architecture.
13. Secure server-side secrets.
14. Graceful degradation when APIs fail.

---

## 3. Core Architecture

Frontend:

Next.js
React
TypeScript
Tailwind CSS
Zustand
Framer Motion only where animation is actually necessary

Backend:

Python
FastAPI
asyncio

Realtime:

WebRTC is the PRIMARY realtime audio transport.

Do NOT make Agora a core dependency.

Agora may exist only as an optional transport adapter in the future.

AI:

Streaming ASR
Streaming LLM
Streaming TTS
VAD
Turn Detection
Barge-in
Cancellation

Agent:

Portfolio RAG
Tool calling
UI control
Project search
GitHub information
Resume information

---

## 4. Architectural Principle

Use:

Voice Engine → Agent Runtime → Portfolio Tools

Do NOT mix UI logic directly into the voice engine.

The voice engine must remain reusable.

---

## 5. Performance Principle

Never optimize by making the application less functional.

Optimize through:

- code splitting
- lazy loading
- streaming
- caching
- memoization
- prefetching
- avoiding unnecessary renders
- efficient state updates
- WebRTC
- local VAD where practical
- cancellable async tasks
- server-side API calls
- image optimization
- minimal dependencies

---

## 6. Source of Truth

All application definitions must originate from:

config/apps.config.ts

All personal information must originate from:

config/personal.config.ts

All voice providers must originate from:

config/voice.config.ts

All runtime configuration must originate from environment variables.

Never duplicate these values across components.

---

## 7. Non-Negotiable Rules

Do not:

- expose private API keys
- put secrets in client bundles
- send realtime audio through ordinary REST requests
- wait for complete LLM responses before beginning TTS
- wait for complete TTS responses before playback
- continue playing stale audio after interruption
- create unnecessary global state
- load all applications during initial page load
- install a dependency when native browser APIs are sufficient
- introduce Agora as a mandatory dependency
- create fake backend APIs when a real implementation is possible
- hardcode application definitions inside UI components

---

## 8. Definition of Done

The portfolio is complete only when:

- desktop shell works
- windows can open/close/minimize/maximize
- windows can be dragged and resized
- dock works
- Launchpad works
- Spotlight works
- portfolio apps work
- GitHub data loads securely
- terminal works
- voice assistant works
- voice interruption works
- AI can control portfolio UI through approved tools
- loading states are polished
- error states are polished
- mobile fallback exists
- accessibility is reasonable
- performance is measured
- production build succeeds
- no secrets are exposed
- no critical console errors exist