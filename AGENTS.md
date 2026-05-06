# Agent Guidelines for GEPT Particle

This is a vanilla JavaScript single-page app with no build tooling.
Keep changes lightweight and consistent with the existing patterns.

## Commands

No build, lint, or test tools are configured.
Use a local static server to run the app because it fetches the CSV via HTTP.

```bash
# Python 3
python -m http.server 8000

# Node.js (if installed)
npx serve .

# PHP
php -S localhost:8000
```

Open `http://localhost:8000`.

### Single Test Execution

There are no tests today. If you add a test runner, document a single-test command
in this file (e.g., `npx vitest run path/to/file.spec.js`).

## Repository Structure

```
GEPT Particle/
├── app.js
├── index.html
├── styles.css
├── GEPT_Intermediate.csv
└── AGENTS.md
```

## Code Style

### General

- Keep the app as plain JS/CSS/HTML unless asked to introduce a build system.
- Use ASCII in source unless non-ASCII is required (already uses zh-Hant).
- Prefer small, local edits over refactors.
- Avoid adding dependencies unless required for functionality.

### JavaScript

- ES6+ features are fine (`const`, `let`, arrow functions, async/await).
- Use semicolons and 2-space indentation.
- Keep all DOM refs in the `elements` object near the top of `app.js`.
- Keep all app state in the `state` object near the top of `app.js`.
- Keep functions in this order:
  1) constants
  2) pure utilities
  3) state mutators
  4) render/UI
  5) event handlers
  6) init
- Prefer explicit null/undefined checks when reading optional DOM nodes.
- Avoid global variables outside `elements`, `state`, and constants.

### Naming

- Variables/functions: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` only for true constants.
- Booleans: `is/has/should` prefixes where it improves clarity.
- CSS classes: `kebab-case`.
- IDs: `camelCase` (matches existing DOM ids).

### Imports/Modules

- No modules are used. `app.js` is loaded via a normal `<script>` tag.
- If modularization is required, use ES modules and keep it simple.

### Error Handling

- Wrap async operations in `try/catch`.
- Show user-facing messages in Chinese (Traditional).
- Log errors to console for debugging.
- Do not use `alert()`.

### Formatting

- Indentation: 2 spaces.
- Line length: keep reasonable (~100 chars) but no hard limit.
- Use K&R braces.
- Avoid trailing whitespace.

### HTML

- Keep HTML semantic and minimal.
- Use ARIA labels for icon-only buttons.
- `lang="zh-Hant"` should remain.

### CSS

- Use CSS variables for theme values.
- Keep light theme in `:root`, dark overrides in `body[data-theme="dark"]`.
- Prefer flex/grid over absolute positioning.
- Avoid inline styles.

## Behavior Notes

- The app reads `GEPT_Intermediate.csv` via `fetch()`.
- Use a local HTTP server for testing.
- Do not remove the CSV fetch behavior unless requested.

## Cursor/Copilot Rules

No Cursor rules or Copilot instructions are present in this repo.
