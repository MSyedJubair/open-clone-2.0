Here is the updated, production-ready DESIGN.md file optimized for your AI agent. It clearly instructs the agent to use your custom Tailwind CSS utility classes instead of raw CSS or standard Tailwind colors. [1] 
------------------------------
## DESIGN.md## 🌌 Core Aesthetic & Philosophy
Our design system is dark-mode-first, high-contrast, and deeply immersive. It relies heavily on functional semantic tokens mapped directly to our Tailwind CSS configuration. [2] 
------------------------------
## 🎨 Color System & Tailwind Utility Classes
The AI must never hardcode hex values or use standard Tailwind colors (e.g., bg-zinc-900, text-emerald-500). You must strictly use the custom utility classes mapped to our semantic variables.
## 1. Structural Surfaces
Use these classes to establish visual hierarchy, depth, and layout layering. [3] 

| Component Target [4] | Tailwind Utility Class | Underlying CSS Variable | Application Example |
|---|---|---|---|
| Background | bg-app-bg | --color-app-bg | Deepest layout layer, main app canvas body. |
| Surface Canvas | bg-app-surface | --color-app-surface | Elevated containers, cards, sidebars, modals. |

## 2. Brand Accents
Reserved for key highlights, interactive states, branding moments, and visual energy.

| Tailwind Class | Underlying CSS Variable | Usage Guidelines |
|---|---|---|
| bg-brand-indigo / text-brand-indigo | --color-brand-indigo | Primary CTAs, active states, focus indicators. |
| bg-brand-purple / text-brand-purple | --color-brand-purple | Secondary accents, gradient stops, visual badges. |
| bg-brand-pink / text-brand-pink | --color-brand-pink | Decorative elements, trend lines, high-energy states. |

## 3. Functional & Status Indicators
Used to communicate system telemetry, publishing states, or platform mechanics instantly.

| Tailwind Class [5] | Underlying CSS Variable | Semantic Meaning |
|---|---|---|
| bg-status-live / text-status-live | --color-status-live | Active, publishing, online, or real-time events. |
| bg-status-draft / text-status-draft | --color-status-draft | Work-in-progress, queue, unreleased, or testing. |
| bg-status-token / text-status-token | --color-status-token | Value metrics, premium stats, rewards, or currency. |

------------------------------
## 🤖 AI Code Generation Rules

* Strict Class Compliance: Always use the custom utility format when writing HTML or JSX.
* Example (Do): <div class="bg-app-surface text-brand-indigo">
   * Example (Don't): <div class="bg-zinc-900 text-indigo-500"> [6] 
* Layout Layering: Always place a container with bg-app-surface on top of a base layout using bg-app-bg. This creates the correct visual depth.
* Component Interactions: Use Tailwind modifiers exclusively with your custom tokens for states.
* Example for hover: hover:bg-brand-indigo or hover:bg-opacity-90 [7] 
* Accessibility (WCAG AA): Ensure text layered over your background surfaces passes a minimum 4.5:1 contrast check. Do not use brand colors for dense, body-sized paragraph text. [8, 9] 

------------------------------
## 🚫 Guardrails (Do's and Don'ts)

* ✅ DO combine classes for complex components, e.g., border border-app-surface bg-app-bg.
* ✅ DO utilize Tailwind's opacity modifiers if fine-tuning a state, e.g., bg-brand-indigo/80.
* ❌ DO NOT use standard Tailwind gray scales (bg-slate-X, bg-zinc-X, bg-neutral-X).
* ❌ DO NOT inject inline styles using style={{ backgroundColor: 'var(--color-app-bg)' }} unless custom utilities are structurally impossible to use in that context.