# Preferred Tech Stack & Implementation Rules

When generating code or UI components for this brand, you **MUST** strictly adhere to the following technology choices.

## Core Stack
* **Framework:** React 19 (TypeScript preferred) with React Router v7.
* **Styling Engine:** Tailwind CSS (Mandatory). 
* **Component Library:** shadcn/ui (Use these primitives as the base for all new standard UI components, and migrate custom CSS to Tailwind).
* **Icons:** Lucide React
* **3D & Advanced Effects:** THREE.js, `postprocessing`, and `face-api.js` (Permitted for complex cyber-aesthetic visuals like `GridScan` and `Hero3DHub` where standard Tailwind isn't feasible).

## Implementation Guidelines

### 1. Tailwind Usage
* Use utility classes directly in JSX.
* Utilize the color tokens defined in `design-tokens.json`.
* **Dark Mode:** Support dark mode using Tailwind's `dark:` variant modifier, ensuring both the Pitch Black (dark) and Light modes render beautifully.
* Gradually refactor existing custom CSS files (like `style.css` variables) into the `tailwind.config` / Tailwind setup.

### 2. Component Patterns
* **Buttons:** Primary actions must use the solid Crimson Red color. Secondary actions should use the 'Ghost' or 'Outline' variants from shadcn/ui.
* **Forms:** Labels must always be placed *above* input fields. Use standard Tailwind spacing (e.g., `gap-4` between form items).
* **Layout:** Use Flexbox and CSS Grid via Tailwind utilities for all layout structures.
* **Advanced Cyber-UI:** When dealing with background grids or interactive 3D pieces, encapsulate the logic in dedicated components with isolated styles if Tailwind cannot handle the canvas/WebGL complexity.

### 3. Forbidden Patterns
* Do NOT use jQuery.
* Do NOT use Bootstrap classes.
* Avoid creating new raw CSS files for standard UI; keep styles located within component files via Tailwind, except for highly specific WebGL/canvas shaders where Tailwind does not apply.
