---
name: Skyland Aetheric
colors:
  surface: '#101414'
  surface-dim: '#101414'
  surface-bright: '#363a3a'
  surface-container-lowest: '#0b0f0f'
  surface-container-low: '#181c1c'
  surface-container: '#1c2020'
  surface-container-high: '#272b2b'
  surface-container-highest: '#323535'
  on-surface: '#e0e3e2'
  on-surface-variant: '#bbcabe'
  inverse-surface: '#e0e3e2'
  inverse-on-surface: '#2d3131'
  outline: '#859489'
  outline-variant: '#3c4a41'
  surface-tint: '#41e09a'
  primary: '#66feb5'
  on-primary: '#003822'
  primary-container: '#43e19b'
  on-primary-container: '#00603d'
  inverse-primary: '#006c45'
  secondary: '#c4c7c7'
  on-secondary: '#2d3131'
  secondary-container: '#434747'
  on-secondary-container: '#b2b6b5'
  tertiary: '#e2e4e8'
  on-tertiary: '#2e3134'
  tertiary-container: '#c6c8cc'
  on-tertiary-container: '#515457'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#65fdb4'
  primary-fixed-dim: '#41e09a'
  on-primary-fixed: '#002112'
  on-primary-fixed-variant: '#005233'
  secondary-fixed: '#e0e3e2'
  secondary-fixed-dim: '#c4c7c7'
  on-secondary-fixed: '#181c1c'
  on-secondary-fixed-variant: '#434747'
  tertiary-fixed: '#e1e2e6'
  tertiary-fixed-dim: '#c4c6ca'
  on-tertiary-fixed: '#191c1f'
  on-tertiary-fixed-variant: '#44474a'
  background: '#101414'
  on-background: '#e0e3e2'
  surface-variant: '#323535'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  data-mono:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  panel-padding: 32px
  gutter: 24px
  unit: 4px
  stack-gap: 16px
  margin: 40px
  nav-width: 256px
---

## Brand & Style
Skyland Aetheric is a high-fidelity intelligence interface that blends **Glassmorphism** with a **Cybernetic/Futuristic** aesthetic. The brand personality is authoritative, technical, and hyper-modern, evoking the feeling of a sophisticated AI core or a high-clearance surveillance hub.

The visual style utilizes deep nocturnal backgrounds contrasted with vibrant, glowing emerald accents. It employs heavy backdrop blurs (20px+), thin semi-transparent borders, and radial "aetheric" gradients to create a sense of infinite depth and data immersion. The UI should feel like a holographic projection—precise, luminous, and reactive.

## Colors
The palette is rooted in a "Deep Space" foundation (`#101414`), using a high-chroma Emerald Green (`#43E19B`) as the primary functional and "energy" color. 

- **Primary:** Used for active states, successful identifications, and data-highs. Often accompanied by a 0.6 opacity glow.
- **Secondary:** Acts as the base for sidebar and navigation containers, providing a slightly lighter "ink" feel than the background.
- **Tertiary:** A cool-toned slate used for secondary data points and processing states to avoid visual clutter.
- **Surface Strategy:** Surfaces are rarely solid; they use alpha-transparency and linear gradients (135deg) to simulate light catching on glass edges.

## Typography
The typography system uses a tri-font approach to differentiate between "Human" and "Machine" data:
- **Manrope** is used for primary UI headers, providing a modern, premium feel.
- **Inter** handles standard reading tasks, ensuring clarity in dense information environments.
- **Space Grotesk** is the "Data Layer." Used for technical labels, status readouts, and monolithic caps. It should be used whenever representing system-generated telemetry or code-like outputs.

## Layout & Spacing
The layout follows a **Fixed Sidebar + Fluid Content** model. 
- **The Intelligence Hub** is centered within the viewport using a large `margin` (40px) to allow the background gradients to frame the content.
- **Internal Spacing:** Uses a strict 8px-based grid (represented by `unit` x2). 
- **Containers:** Use `panel-padding` (32px) for major cards to establish a spacious, breathable data environment.
- **Gaps:** The `gutter` (24px) is the standard distance between major content blocks, while `stack-gap` (16px) is used for vertical elements within a module.

## Elevation & Depth
Depth is created through **Glassmorphism and Glows** rather than traditional shadows:
- **Level 0 (Background):** Deep charcoal with a subtle radial gradient emanating from the center.
- **Level 1 (Navigation):** `backdrop-blur-xl` (80% opacity) with a 1px border.
- **Level 2 (Main Card):** `backdrop-blur-[20px]` (40% opacity) with a light-catching 135-degree gradient.
- **Level 3 (Sub-modules):** Higher opacity (`50%`) with standard borders to differentiate nested telemetry.
- **Glows:** Primary elements use a `drop-shadow` or `box-shadow` with the primary color at low opacity (20-50%) to simulate light emission.

## Shapes
The shape language is "Technical-Soft." It avoids sharp brutalist edges to maintain a premium feel but avoids overly playful "bubbly" curves.
- **Standard Corners:** 0.25rem (4px) for small items like list entries.
- **Container Corners:** 0.75rem (12px) for main cards and modules.
- **Status Indicators:** Perfect circles (full-rounded) for telemetry dots and progress bars.
- **Borders:** Consistently 1px wide, utilizing `white/5` or `white/10` to define edges without creating heavy visual lines.

## Components
- **Navigation (Side/Top):** Semi-transparent dark fills. Active states use a "Glow Pulse" and a right-aligned high-contrast border.
- **Progress Bars:** Dual-layered. A "track" with a background-variant color and a "fill" with the primary color and a 10px blur glow. Indeterminate states use a pulse animation.
- **Data Cards:** Glass-filled containers with an 8px bottom-margin header. Headers include a `label-caps` title and an icon.
- **Status Chips:** Small, monochromatic backgrounds (10% opacity of the color) with `data-mono` text.
- **Telemetry Indicators:** Small 8px circles. Active = Primary Glow; Processing = Tertiary; Alert = Error Pulse.
- **Interactive Lists:** Hovering over a list item should transition the border from `white/5` to `primary/30`.