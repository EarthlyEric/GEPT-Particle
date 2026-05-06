# Agent Guidelines for GEPT Particle

This is a vanilla JavaScript single-page application with no build system.

## Project Structure

```
GEPT Particle/
├── app.js              # Main application logic (519 lines)
├── index.html          # HTML structure (142 lines)
├── styles.css          # CSS styles (593 lines)
├── GEPT_Intermediate.csv  # Vocabulary data (~3000 words)
└── AGENTS.md           # This file
```

## Running the Application

Because the app fetches a CSV file via `fetch()`, it must be served via HTTP (not `file://`). Use any local server:

```bash
# Python 3 (most common)
python -m http.server 8000

# Node.js (if installed)
npx serve .

# PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in a browser.

## Commands

- **No build commands exist** - this is a pure static site
- **No test framework is configured** - no tests currently exist
- **No linting is set up** - no code quality tools configured

If adding tests, prefer Vitest (minimal config, browser-compatible via Playwright). Run a single test file with `npx vitest run filename.spec.js`.

## Code Style Guidelines

### JavaScript Conventions

- **Language**: ES6+ (const/let, arrow functions, async/await, template literals)
- **No TypeScript** - do not add TypeScript unless explicitly requested
- **No build system** - keep as vanilla JS unless requested otherwise
- **DOM access**: Use `document.getElementById()` (existing pattern at app.js:1-39)
- **State management**: Single global `state` object at top of file (app.js:41-52)
- **Element references**: Single global `elements` object caching DOM elements
- **Error handling**: Use try/catch with meaningful error messages in Chinese

### Naming Conventions

- **Variables/functions**: camelCase (`applyFilters`, `state.items`)
- **Constants**: SCREAMING_SNAKE_CASE for true constants (`headerRow`), camelCase for module-level config objects
- **CSS classes**: kebab-case (`.card-panel`, `.btn-filled`)
- **IDs**: kebab-case (`filterLevel`, `drawerOverlay`)
- **Booleans**: Prefix with `is`, `has`, `should` (e.g., `isLoading`, `hasError`)

### Import Guidelines

- No imports/exports - this is a single-file script loaded via `<script src="app.js">`
- If adding modularity, use ES modules only with `<script type="module" src="...">`
- Avoid CDN dependencies unless necessary for functionality

### Function Organization

Follow this order in app.js:
1. Global `elements` object (DOM references)
2. Global `state` object (application state)
3. Constants (CSV header row, etc.)
4. Pure utility functions (parseCsv, data transformation)
5. State-modifying functions (updateStats, navigation)
6. Event handlers and UI functions
7. Initialization function (`init`)

### Formatting

- **Indentation**: 2 spaces (matching existing code)
- **Line endings**: LF (Unix-style) - configure editor to use this
- **Maximum line length**: None enforced, but keep lines readable (~100 chars target)
- **Semicolons**: Use semicolons (existing pattern)
- **Braces**: K&R style (opening brace on same line)
- **Spacing**: Single space after keywords (`if (...)`, `function ()`), no extra spaces in function calls

### CSS Guidelines

- Use CSS custom properties (variables) for theming (e.g., `--md-sys-color-*`)
- Follow Material Design 3 naming conventions
- Use `:root` for light theme, `body[data-theme="dark"]` for dark overrides
- Use `clamp()` for responsive typography
- Prefer flexbox and grid for layout
- Group related styles with comments (e.g., `/* Card Styles */`)
- Avoid inline styles; use CSS classes instead

### Error Handling

- Wrap async operations in try/catch (e.g., fetch calls)
- Provide user-friendly error messages in Chinese (e.g., `setStatus('載入失敗，請稍後重試')`)
- Log errors to console for debugging (`console.error()`)
- Show errors in the status element, not alert() dialogs
- Handle network errors gracefully with fallback UI

### HTML Guidelines

- Use semantic HTML5 elements (`<main>`, `<header>`, `<footer>`, `<aside>`)
- Include `aria-*` attributes for accessibility (e.g., `aria-live="polite"`)
- Use `lang="zh-Hant"` for Traditional Chinese
- Keep HTML minimal; prefer JS-driven UI updates
- Use data-* attributes for state markers on elements

### Accessibility

- All interactive elements must be keyboard accessible
- Use `<button>` for actions, `<a>` for navigation
- Include proper `aria-label` or `aria-labelledby` on icon-only buttons
- Ensure sufficient color contrast (4.5:1 for text)
- Status announcements should use `aria-live="polite"` region

### Performance

- Minimize DOM operations; cache element references in `elements` object
- Use event delegation for repeated elements (e.g., table rows)
- Avoid re-rendering entire lists; update individual cells instead
- Use CSS transforms for animations, avoid layout-triggering properties

### Adding Features

- Keep `app.js` as a single file unless complexity demands modules
- Add new state properties to the `state` object, new DOM refs to `elements` object
- Write functions as standalone (not wrapped in IIFE or class)
- Follow existing function order: constants → state → utility functions → UI functions → init
- Document new functions with brief inline comments for complex logic

### Testing Guidelines (when added)

- Place tests in `tests/` directory
- Use Vitest with `describe`/`it` syntax
- Test one thing per test case
- Mock `fetch` and DOM APIs for unit tests
- Use Playwright for integration/e2e tests (browser environment needed)

## Future Considerations

If adding a build system, prefer Vite over Webpack (simpler, faster). If adding TypeScript, run `tsc --init` and configure `strict: true`.

## Key Files to Know

- `app.js:1-52` - Global state and element references
- `app.js:56-81` - CSV parsing logic (template string handling)
- `app.js:200-300` - Card display and navigation logic
- `app.js:400-450` - Filter and search implementation
- `styles.css:1-100` - CSS custom properties and base styles