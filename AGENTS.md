# Agent Guidelines for GEPT Particle

This is a vanilla JavaScript single-page application with no build system.

## Project Structure

```
GEPT Particle/
├── app.js              # Main application logic (424 lines)
├── index.html          # HTML structure (142 lines)
├── styles.css          # CSS styles (593 lines)
├── GEPT_Intermediate.csv  # Vocabulary data
└── AGENTS.md           # This file
```

## Running the Application

Because the app fetches a CSV file via `fetch()`, it must be served via HTTP (not `file://`). Use any local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (if installed)
npx serve .
```

Then open `http://localhost:8000` in a browser.

## Commands

- No build commands exist
- No test framework is configured
- No linting is set up

If adding tests, prefer Vitest (minimal config, browser-compatible via Playwright).

## Code Style Guidelines

### JavaScript Conventions

- **Language**: ES6+ (const/let, arrow functions, async/await, template literals)
- **No TypeScript** - do not add TypeScript unless explicitly requested
- **No build system** - keep as vanilla JS unless requested otherwise
- **DOM access**: Use `document.getElementById()` (existing pattern)
- **State management**: Single global `state` object at top of file
- **Element references**: Single global `elements` object caching DOM elements
- **Error handling**: Use try/catch with meaningful error messages in Chinese

### Naming Conventions

- **Variables/functions**: camelCase (`applyFilters`, `state.items`)
- **Constants**: SCREAMING_SNAKE_CASE for true constants, camelCase for module-level config objects
- **CSS classes**: kebab-case (`.card-panel`, `.btn-filled`)
- **IDs**: kebab-case (`filterLevel`, `drawerOverlay`)

### Import Guidelines

- No imports/exports - this is a single-file script loaded via `<script src="app.js">`
- If adding modularity, use ES modules only

### Formatting

- **Indentation**: 2 spaces (matching existing code)
- **Line endings**: LF (Unix-style)
- **Maximum line length**: None enforced, but keep lines readable (~100 chars target)
- **Semicolons**: Use semicolons (existing pattern)
- **Braces**: K&R style (opening brace on same line)

### CSS Guidelines

- Use CSS custom properties (variables) for theming
- Follow Material Design 3 naming (`--md-sys-color-*`)
- Use `:root` for light theme, `body[data-theme="dark"]` for dark overrides
- Use `clamp()` for responsive typography
- Prefer flexbox and grid for layout

### Error Handling

- Wrap async operations in try/catch
- Provide user-friendly error messages in Chinese
- Log errors to console for debugging

### HTML Guidelines

- Use semantic HTML5 elements (`<main>`, `<header>`, `<footer>`, `<aside>`)
- Include `aria-*` attributes for accessibility (e.g., `aria-live="polite"`)
- Use `lang="zh-Hant"` for Traditional Chinese

## Adding Features

- Keep `app.js` as a single file unless complexity demands modules
- Add new state properties to the `state` object, new DOM refs to `elements`
- Write functions as standalone (not wrapped in IIFE or class)
- Follow existing function order: constants → state → utility functions → UI functions → init

## Future Considerations

If you add a build system, prefer Vite over Webpack (simpler, faster). If you add TypeScript, run `tsc --init` and configure `strict: true`.