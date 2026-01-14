# Implementation Plan - Interview Prep Tracker (Frontend Only)

## Overview & Purpose

This document is an implementation-ready plan for building a frontend-only “Interview Prep Tracker” React app that visually tracks interview skills such as DSA, System Design, and Frontend using a dashboard layout with a navbar, summary cards, a radar chart, and per-skill progress bars. The app will use React functional components, local state, and browser `localStorage` for persistence, and it will not use any backend or authentication.

## Value Proposition

The Interview Prep Tracker provides a portfolio-ready, clean dashboard that makes skill progress visible and actionable. By combining summary metrics, a radar visualization, and granular skill progress tracking, the app helps users quickly understand where they are improving, where they are behind target, and what to work on next, while keeping the implementation lightweight and self-contained in the browser.

## Features & Functionality

The app will implement the following UI sections and behaviors:

It will include a top navigation bar that contains the app title and optional actions (for example, “Reset data” and a theme toggle if theming is kept). It will present summary cards in a responsive grid to surface high-level metrics (for example, total progress, streak, weekly progress, or “skills on track”). It will display a central radar chart comparing current progress (and optionally targets) across DSA, System Design, and Frontend. It will include a skill progress list below the chart with progress bars and controls to update progress. It will store all user data locally so that progress persists across reloads, and the application will be usable fully offline.

## Architecture & Design

### Current repo observations

The repository already contains a Create React App setup using `react-scripts` and React 18, with a single `App` component (`src/App.js`) that demonstrates a light/dark theme toggle by setting `data-theme` on `document.documentElement`. Styling is currently plain CSS in `src/App.css` and `src/index.css`. There is a basic Jest/Testing Library scaffold (`src/App.test.js`, `src/setupTests.js`) from CRA.

The current `App.css` defines CSS variables for theme colors under `:root` and overrides under `[data-theme="dark"]`. The current UI is the default CRA template UI, so the plan below assumes replacing the existing `App` content with the dashboard UI while continuing to use plain CSS (no CSS-in-JS, no framework).

### High-level component architecture

The app will remain a single-page dashboard. The recommended component breakdown is:

- `App`: top-level state owner; loads and saves persisted data; composes the dashboard layout.
- `Navbar`: app title and global actions (reset, optional theme toggle).
- `SummaryCards`: container for multiple `SummaryCard` components.
- `SummaryCard`: reusable metric card.
- `RadarChart`: renders the radar chart visualization.
- `SkillProgressList`: container rendering multiple `SkillProgressItem` rows.
- `SkillProgressItem`: per-skill row with label, progress bar, and controls to adjust progress.
- `ProgressBar`: shared progress bar component used by skills and/or summary views.

All components should be functional components. Data should flow down via props, and updates should flow up via callbacks. Side effects (loading/saving `localStorage`) should live in `useEffect` in `App`.

### Navbar

The navbar will be a fixed-height top section with the app name (“Interview Prep Tracker”). It should include action buttons aligned to the right. At minimum, it should include a “Reset” action that restores the default data model. If the current theme toggle is retained, it should live here and continue to toggle `data-theme` on the root element.

### Summary Cards

The summary cards section will be a responsive grid (for example, three cards on desktop, one per row on mobile). Each card should show a title and value. Example metrics that can be computed from the stored data include:

- “Overall Progress”: average of the three skill progress values.
- “Skills On Track”: count of skills with progress >= target.
- “Last Updated”: date of the most recent history entry across skills.

If the product scope prefers fewer metrics, it is acceptable to keep summary cards minimal as long as the section exists and is visually meaningful.

### Radar Chart

The radar chart will show the three skills as axes. The plotted polygon will represent current progress values (0–100). Optionally, a second polygon may represent targets. The chart should be large and central in the layout per the work item layout description.

Because the project currently has minimal dependencies, the plan includes two approaches (see “Radar chart approach” section).

### Skill Progress List

The skill progress list will display DSA, System Design, and Frontend in a vertical list with a progress bar and controls. Each row should show:

- Skill name
- Current progress value (0–100)
- Target value (0–100)
- Progress bar (based on current progress)
- Controls to increment/decrement progress in consistent steps (for example, ±5), plus an input for direct editing if desired

Each progress update should record a history entry in the data model.

### State and Persistence

All app state is local in React (likely in `App`), persisted to `localStorage`. No backend, no network calls, and no auth.

### Theming

The work item specifies a light theme with these key colors:

- Primary: `#3b82f6`
- Success: `#06b6d4`
- Secondary: `#64748b`
- Background: `#f9fafb`
- Surface: `#ffffff`
- Text: `#111827`

The current repo includes a light/dark theme toggle and CSS variables. For this project, the recommended approach is to keep theming via CSS variables but adjust the “light” variables to match the provided style guide and treat dark theme as optional. If dark mode is not required, the toggle can be removed or left as a non-blocking enhancement.

## Technical Requirements

The implementation must meet these technical constraints:

The app must be frontend-only and run entirely in the browser. It must use React functional components and follow unidirectional data flow. It must use plain CSS for styling (consistent with the current repository). It must persist all user data to `localStorage` and restore it on page load. It must implement the required UI sections (navbar, summary cards, radar chart, skill progress list) and be responsive.

No backend integration should be introduced. No authentication should be added. No environment variables are required for functionality, even though the container defines several `REACT_APP_*` variables.

## Data model

### Skills and stored structure

The app will track exactly these skills:

- DSA
- System Design
- Frontend

A minimal, implementation-ready data model in JavaScript object form is:

```js
{
  version: 1,
  lastUpdatedAt: "2026-01-14T00:00:00.000Z",
  skills: {
    dsa: {
      id: "dsa",
      name: "DSA",
      progress: 35,
      target: 70,
      history: [
        { at: "2026-01-14T00:00:00.000Z", progress: 35, note: "Initialized" }
      ]
    },
    systemDesign: {
      id: "systemDesign",
      name: "System Design",
      progress: 25,
      target: 65,
      history: [
        { at: "2026-01-14T00:00:00.000Z", progress: 25, note: "Initialized" }
      ]
    },
    frontend: {
      id: "frontend",
      name: "Frontend",
      progress: 40,
      target: 75,
      history: [
        { at: "2026-01-14T00:00:00.000Z", progress: 40, note: "Initialized" }
      ]
    }
  }
}
```

This model supports the required “structure with progress, targets, history”. The `history` array provides a timeline for future enhancements (trend charts, streaks, weekly deltas). `lastUpdatedAt` can be updated whenever any skill changes.

### Derived values

The UI should compute derived values rather than store them:

- Overall progress: average of the three `progress` values.
- On-track count: number of skills where `progress >= target`.
- Most recent update: maximum `history.at` value across skills.

## Configuration & Setup

The project is a CRA application under `interview_prep_tracker_frontend/`. Standard setup is:

1. Install dependencies with `npm install`.
2. Run the dev server with `npm start`.
3. Run tests with `CI=true npm test`.
4. Build with `npm run build`.

No backend configuration is needed. No `.env` values are required for the frontend-only scope.

## Usage Examples

A typical usage flow is:

The user opens the app and sees the dashboard showing summary cards, a radar chart, and progress rows for DSA, System Design, and Frontend. The user increments a skill’s progress (for example, DSA from 35 to 40). The progress bar and radar chart update immediately. The user reloads the page and sees the updated values restored from `localStorage`.

If a reset feature is included, the user can click “Reset” in the navbar to restore the default starting values, and the dashboard updates accordingly.

## Limitations & Assumptions

This plan assumes there is no backend and no multi-device sync, so the data is limited to the browser and device where it was entered. It assumes only three skills are tracked initially. It assumes the app is a single-page dashboard without routing. It also assumes the existing CRA tooling remains in place and styling stays with plain CSS.

Because the existing repository currently uses React 18.2 and caret versions in `package.json`, this plan does not require dependency upgrades to implement the frontend features, but package/version alignment may be considered a follow-up maintenance task.

## Success Metrics & Future Enhancements

### Local state + localStorage strategy (load/save patterns)

Persistence will be implemented using a predictable load/save pattern:

On first load, `App` attempts to read a JSON blob from `localStorage` (for example, under a key like `ipt:data`). If parsing fails or data is missing, `App` initializes default state and writes it to storage. After initialization, any state change that affects the persisted model triggers a save in an effect.

A recommended structure is:

- `loadState()`: read key, parse JSON, validate minimal shape, return default if invalid.
- `saveState(state)`: serialize state, write key.
- `useEffect(() => setState(loadState()), [])`: initial load.
- `useEffect(() => saveState(state), [state])`: persist on change.

To reduce write frequency, optional debouncing can be applied later, but for this small data model it is typically acceptable to write on each update.

### Radar chart approach

Two implementation options are acceptable:

Option A: Custom SVG (recommended for minimal dependencies).
The radar chart can be built with a small, deterministic SVG renderer. It computes axis angles for three skills, draws a background grid (circles or polygons), draws axis lines and labels, then computes polygon points for progress (and optionally target). This approach avoids adding any charting library and keeps bundle size minimal. It requires careful layout math and label placement, but with only three axes it is straightforward.

Option B: Small dependency (only if needed).
If a chart library is preferred, add a small and well-supported dependency and render a radar chart with it. This adds dependency/version risk and styling work to align with the theme, but it reduces custom math code. If this option is chosen, lock exact versions in `package.json` and verify it works with CRA and React 18.

### Styling guidelines (light theme)

The app should follow the provided light theme with these colors:

- Primary: `#3b82f6`
- Success: `#06b6d4`
- Secondary: `#64748b`
- Background: `#f9fafb`
- Surface: `#ffffff`
- Text: `#111827`

The recommended approach is to define CSS variables in `App.css` (or a new global CSS file, still plain CSS) such as:

- `--color-bg: #f9fafb`
- `--color-surface: #ffffff`
- `--color-text: #111827`
- `--color-primary: #3b82f6`
- `--color-success: #06b6d4`
- `--color-secondary: #64748b`
- `--color-border: rgba(17, 24, 39, 0.1)`

Cards should use `--color-surface` with subtle borders and soft shadows. Buttons should use `--color-primary`. Progress bars can use `--color-primary` for the fill and `--color-success` to indicate “on track” state. The layout should use generous padding and consistent spacing to feel modern and portfolio-ready.

### Accessibility and responsiveness notes

The navbar actions and any inputs must be keyboard accessible. Buttons should have clear focus states and accessible labels. Progress bars should include text equivalents (for example, “DSA progress 40 of 100”). Color contrast should be sufficient, especially for secondary text.

Responsiveness should be achieved via CSS grid and media queries. Summary cards should collapse from multi-column to single-column on small screens. The radar chart should scale down while maintaining readability, with labels adjusted for small widths. The skill list should remain legible and allow touch-friendly controls.

### Step-by-step implementation plan with tasks

1) Scaffold components.
Create the component structure (Navbar, SummaryCards/SummaryCard, RadarChart, SkillProgressList/SkillProgressItem, ProgressBar) and wire them into `App` with placeholder props. Replace the default CRA template markup with the dashboard layout.

2) Implement state and persistence.
Define the data model and defaults in `App`. Implement load and save functions for `localStorage`, including basic validation and a schema `version` field. Ensure state updates are immutable and only occur via React state setters.

3) Implement UI layout.
Build the main layout according to the work item: navbar on top, summary cards in a grid, radar chart centered and large, progress list below. Apply light theme variables and create base typography styles. Ensure the layout is responsive.

4) Implement radar chart.
Choose Option A (custom SVG) by default and implement a 3-axis radar chart. Render the polygon for current progress and optionally a second polygon for targets. Style the chart to match the theme (grid lines subtle, polygon fill with low opacity, stroke with primary).

5) Implement progress bars and controls.
For each skill, render a progress bar and controls to change progress and target. Clamp values to 0–100. On update, append a history entry with timestamp and update `lastUpdatedAt`.

6) Polish.
Add “Reset data” behavior. Add focus states, ARIA labels, and ensure buttons are discoverable. Validate responsive behavior on mobile widths. Ensure persisted data survives reload and that the app behaves gracefully if `localStorage` contains malformed data.

### Risks and mitigations

Package versions and CRA constraints are a risk if a charting library is introduced, because CRA tooling and React peer dependency constraints can cause installation conflicts. This can be mitigated by preferring the custom SVG radar chart (Option A) and keeping dependencies minimal.

Charting tradeoffs are a risk because a custom chart requires correct geometry and label placement. This can be mitigated by limiting scope to three skills, using a fixed and well-tested mapping from progress percentage to radius, and keeping the SVG implementation simple. If label collisions occur on small screens, the chart can fall back to abbreviated labels or a compact mode at a breakpoint.

### Acceptance criteria

The implementation is considered complete when the app shows a navbar, summary cards, a radar chart, and a skill progress list for DSA, System Design, and Frontend. Skill progress updates must persist across page reloads using `localStorage`. The layout must be responsive and remain usable on mobile widths. The app must not require or call any backend services, and it must not introduce authentication.
