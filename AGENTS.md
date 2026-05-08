# Agent Guidelines for GEPT Particle

This repository is a plain HTML/CSS/JS single-page app. Keep edits small, avoid new
dependencies, and follow existing patterns in `index.html`, `styles.css`, and `app.js`.

## Build / Lint / Test Commands

There is no build, lint, or test tooling configured today.

### Run Locally (required for CSV fetch)

Use a static server because the app fetches `GEPT_Intermediate.csv` via HTTP.

```bash
# Python 3
python -m http.server 8000

# Node.js (if installed)
npx serve .

# PHP
php -S localhost:8000
```

Open `http://localhost:8000` in a browser.

### Single-Test Command

No tests exist. If you add a test runner, document a single-test command here
(example: `npx vitest run path/to/file.spec.js`).

## Repository Layout

```
GEPT Particle/
├── app.js
├── index.html
├── styles.css
├── GEPT_Intermediate.csv
└── AGENTS.md
```

## Code Style Guidelines

### General

- Keep the app vanilla JS/CSS/HTML unless explicitly asked to add tooling.
- Use ASCII by default; Traditional Chinese UI text is expected where needed.
- Prefer small, local edits over broad refactors.
- Avoid adding dependencies unless required for functionality.
- Do not remove CSV fetch behavior unless explicitly requested.
- Preserve existing UX patterns and the single-page flow.

### JavaScript

- Use `const`/`let`, arrow functions, and async/await.
- Use semicolons and 2-space indentation.
- Keep DOM references in the `elements` object near the top of `app.js`.
- Keep app state in the `state` object near the top of `app.js`.
- Group functions by purpose in this order: constants, utilities, state mutators,
  render/UI, event handlers, init.
- Avoid globals outside `elements`, `state`, and true constants.
- Prefer explicit null/undefined checks when nodes may not exist.
- Keep functions short and purpose-focused; avoid hidden side effects.
- Favor pure helpers for parsing and filtering logic.

### Naming

- Variables/functions: `camelCase`.
- True constants: `UPPER_SNAKE_CASE` (rare in this repo).
- Booleans: use `is/has/should` prefixes when it helps clarity.
- CSS classes: `kebab-case`.
- IDs: `camelCase` (matches existing DOM ids).

### Imports / Modules

- No modules are used; `app.js` is loaded via a normal `<script>` tag.
- If modularization is required, use ES modules and keep it minimal.
- Avoid bundlers unless the user explicitly requests them.

### Error Handling

- Wrap async operations in `try/catch`.
- Show user-facing messages in Traditional Chinese.
- Log errors to console for debugging.
- Do not use `alert()`.
- Fail gracefully when CSV fetch or parsing fails; keep the UI usable.

### Formatting

- Indentation: 2 spaces.
- Line length: keep reasonable (~100 chars), no hard limit.
- Use K&R braces.
- Avoid trailing whitespace.
- Keep blank lines between major sections for readability.

### HTML

- Keep HTML semantic and minimal.
- Use ARIA labels for icon-only buttons.
- Keep `lang="zh-Hant"`.
- Prefer button elements for actions; avoid click handlers on non-interactive tags.

### CSS

- Keep theme variables in `:root`; override in `body[data-theme="dark"]`.
- Prefer flex/grid over absolute positioning.
- Avoid inline styles.
- Reuse existing utility classes and spacing patterns where possible.

### Types

- This is plain JavaScript; do not add TypeScript unless requested.
- Use JSDoc only when it clarifies non-obvious data shapes.

## Behavior Notes

- The app loads `GEPT_Intermediate.csv` via `fetch()`.
- Always use a local HTTP server for testing.
- Keep CSV parsing and filtering behavior stable unless asked to change.
- Do not introduce persistent storage without explicit request.

## Cursor / Copilot Rules

No Cursor rules or Copilot instructions are present in this repo.
