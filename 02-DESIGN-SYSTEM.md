# Design System

## Visual Direction

macOS-inspired
Liquid glass
Minimal
Premium
Technical
Elegant
Fast

Do not blindly clone Apple UI.

Create an original visual identity.

## Typography

Use system fonts:

- -apple-system
- BlinkMacSystemFont
- Segoe UI
- Roboto
- sans-serif

Terminal:

- SFMono-Regular
- Menlo
- Monaco
- Consolas
- monospace

## Desktop

Full viewport.

Use:

width: 100%
height: 100dvh

Do NOT force a 1920x1080 canvas.

Do NOT use global transform scaling for the entire application.

The interface must be responsive.

## Menu Bar

Height approximately 32px.

Use translucent glass.

Avoid expensive backdrop-filter effects on every element.

Use backdrop blur selectively.

## Dock

Floating glass dock.

Magnification should use transform.

Do not trigger layout recalculation during hover.

## Windows

- rounded corners
- subtle border
- subtle shadow
- glass background
- traffic lights
- draggable title bar
- resize handles
- focus state
- minimize animation
- maximize animation

## Animation

Prefer transform and opacity.

Avoid animating:

- width
- height
- top
- left

unless required.

Use:

transform
opacity

for smooth animations.

Respect:

prefers-reduced-motion.