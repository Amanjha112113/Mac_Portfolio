# Performance Engineering Specification

## 1. Objective

Performance is a first-class requirement of the portfolio.

The application must feel fast, responsive, and native-like even though it contains:

- Desktop/window management
- Multiple interactive applications
- GitHub/API integrations
- Realtime voice AI
- Streaming ASR
- Streaming LLM
- Streaming TTS
- Agentic tool calling
- Animations
- Dynamic content

The implementation must optimize for:

1. Fast initial rendering
2. Low JavaScript execution cost
3. Smooth interaction
4. Minimal network requests
5. Low memory usage
6. Low voice latency
7. Fast application opening
8. Graceful degradation
9. Efficient realtime streaming
10. Stable performance on normal laptops

Do not sacrifice reliability or functionality merely to achieve benchmark numbers.

---

# 2. Performance Philosophy

The application should follow:

> Load less → execute less → request less → render less → stream earlier → cache intelligently.

Never optimize by introducing unnecessary complexity.

Prefer browser-native capabilities and existing project dependencies before adding new libraries.

---

# 3. Core Performance Targets

These are engineering targets rather than guaranteed SLAs.

## Initial Page

Target:

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.0s
- Time to Interactive: < 3.0s
- Cumulative Layout Shift: < 0.1

Targets assume a reasonable broadband connection and production deployment.

Do not block initial rendering on optional APIs.

The desktop shell must render independently.

---

# 4. Critical Rendering Path

The initial page should contain only what is necessary to display:

- Wallpaper/background
- Menu bar
- Desktop
- Dock
- Window manager
- App registry
- Critical CSS
- Minimal application state

Do NOT wait for:

- GitHub API
- Maps
- Music
- Spotify
- Voice backend
- ASR
- LLM
- TTS
- Resume PDF
- Analytics
- Non-critical images

before rendering the desktop.

The portfolio must become visually usable as quickly as possible.

---

# 5. JavaScript Bundle Strategy

The initial JavaScript bundle must remain as small as reasonably possible.

Avoid importing heavy libraries globally.

Heavy functionality must be dynamically imported.

Examples:

```text
Voice Engine
PDF Viewer
Maps
Charts
Terminal enhancements
Advanced GitHub visualization
Audio visualization
Developer diagnostics