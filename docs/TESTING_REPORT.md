# Software Testing Report — GYAT (Gym App & Tracker)

## 1. Testing Strategy & Approach

### How Requirements and Design Informed Testing

Our testing strategy was directly shaped by the application's requirements and architecture. GYAT is a React + TypeScript single-page application with several high-risk areas identified early in design:

- **Interactive Map** — the core feature allowing gym managers to place, edit, drag, resize, and delete equipment tiles on a floor plan. This was classified as **P0 (highest priority)** for testing due to its complexity and direct impact on the primary user workflow.
- **Authentication & Auth Guards** — login, signup, session persistence, and route-level access control. Incorrect auth behaviour would block all manager functionality, making this P0.
- **API Service Layer** — all CRUD operations for layouts, floors, components, and equipment. Malformed requests or mishandled errors would corrupt gym data, so service contract tests were essential.
- **Theme, Settings & Accessibility** — settings persistence (localStorage), high contrast mode, reduced motion, and font scaling. These affect all users and needed integration-level verification that context changes propagate through the real component tree.

We formalised this risk analysis in our [Test Specification](TEST_SPEC.md) (written 3 March 2026), which categorised quality risks into P0/P1/P2 tiers and defined four test levels: unit, component, integration, and service contract.

### Testing Methodology

We adopted a **bottom-up testing approach** across iterative development cycles:

| Phase | Focus | Test Type |
|-------|-------|-----------|
| **Before implementation** | Identified risks per feature, defined test levels in TEST_SPEC.md | Planning |
| **During implementation** | Wrote unit & component tests alongside each feature | Unit, component |
| **After each iteration** | Ran full suite, addressed regressions, expanded coverage for gaps | Integration, debugging |
| **Final iteration** | Added integration tests for cross-cutting flows (auth, routing, context) | Integration |

### Tools & Infrastructure

| Tool | Purpose |
|------|---------|
| **Vitest 4.0** | Test runner (describe/it/expect), compatible with Vite build |
| **React Testing Library** | Component rendering, user-event simulation, DOM queries |
| **jsdom** | Browser environment simulation for Node.js |
| **@vitest/coverage-v8** | Code coverage via V8 engine instrumentation |

Configuration: `vitest.config.ts` sets up the jsdom environment, global test APIs, and coverage thresholds. A shared setup file (`src/test/setupTests.ts`) loads `@testing-library/jest-dom` matchers.

---

## 2. Coordination, Analysis & Response

### How We Coordinated Testing

<!-- [FILL IN: Describe how your team coordinated testing efforts — e.g., who wrote which tests, how test failures were communicated (Slack, GitHub issues, PR reviews), whether you had a test lead or shared responsibility, and any testing standards/conventions agreed upon.] -->

### How We Analysed Test Results

We used a structured approach to analyse and respond to test failures:

1. **Continuous local runs** — `npm test` executed the full Vitest suite before every commit. Failures blocked merges.
2. **Coverage reports** — `npm test -- --coverage` generated per-file statement, branch, function, and line coverage. We used these to identify undertested areas (e.g., InteractiveMap at 75% branch coverage) and prioritise new tests.
3. **Risk-based triage** — Failures in P0 areas (InteractiveMap, auth, API) were addressed immediately. P2 cosmetic issues (animation props, styling assertions) were deprioritised.

### How We Responded to Failures

During testing we encountered and resolved several categories of issues:

- **Import/export mismatches** — Components using `export default` were imported with named imports in tests, causing silent mock failures. Fixed by aligning all test imports with actual export styles.
- **Component API drift** — As features evolved (e.g., Tile's `onClick` → `onSelect`, MachineModal's Video → Image), tests fell behind. We updated mocks and assertions to match the current API.
- **Event propagation bugs** — The InteractiveMap delete test revealed that a parent container's `onClick` handler was overriding tile selection via event bubbling. The fix (`e.stopPropagation()`) was a genuine bug caught by testing.
- **Mock hoisting issues** — Vitest's `vi.mock()` is hoisted above variable declarations, so referencing constants inside mock factories failed silently. Resolved by inlining mock data.
- **Environment gaps** — jsdom lacks `window.matchMedia`, `ResizeObserver`, and `HTMLCanvasElement.getContext`. We added targeted polyfill mocks for these in integration tests and mocked the Silk 3D background component entirely.

<!-- [FILL IN: Add any additional debugging stories — specific bugs caught by tests, any pair-debugging sessions, how you handled flaky tests, etc.] -->

---

## 3. Types of Testing Used

### 3.1 Unit Tests (29 files, 346 tests)

Unit tests target isolated logic with mocked dependencies. They form the foundation of our test pyramid.

**Components tested (14 files, ~173 tests):**

| Component | Tests | Key Behaviours Verified |
|-----------|-------|------------------------|
| InteractiveMap | 23 | Tile rendering, zoom, modal, edit mode, drag/drop, undo, selection, delete |
| MachineModal | 20 | Equipment details, exercise list, image preview, edit vs. preview modes, close |
| Header | 18 | Navigation highlighting, mobile menu, sound effects, auth state display |
| Tile | 18 | Click/select handlers, edit mode, colour rendering, resize handles, hover |
| SearchBar | 13 | Filtering, selection, keyboard nav, custom rendering |
| ThemeToggle | 11 | Theme switching, icons, accessibility labels |
| TileInfoCard | 11 | Info display, positioning, bounds clamping |
| ToggleSwitch | 10 | Toggle states, styling, accessibility |
| LogOutButton | 7 | Render, logout flow, auth state |
| ShinyText | 7 | Animation, styling, disabled state |
| DragAndDropMenu | 6 | Equipment fetch, drag data payload |
| ProfileButton | 6 | Navigation links, logged in/out states |
| ZoomControls | 6 | Zoom in/out/reset, button states |
| DropDownMenu | 5 | Menu toggle, hover, child integration |

**Pages tested (10 files, ~81 tests):**

| Page | Tests | Key Behaviours Verified |
|------|-------|------------------------|
| EditMapPage | 13 | Edit mode UI, snap-to-grid, floor navigation, drag/drop |
| LoginPage | 10 | Form validation, API calls, error handling, redirect |
| MapPage | 10 | Floor navigation, search, edit button, admin check |
| App (routing) | 8 | All route mappings (/, /login, /signup, /settings, /profile, /map/:id, 404) |
| HomePage | 8 | Title, description, search button, preview map |
| NotFoundPage | 4 | 404 message, home link |
| ProfilePage | 4 | Auth dependency, logout, redirect |
| SignUpPage | — | Form fields, validation, registration |
| SettingsPage | — | Accessibility controls, font scale, toggles |
| SearchMapPage | — | Search and gym selection |

**Services tested (8 files, ~62 tests):**

| Service | Tests | Key Behaviours Verified |
|---------|-------|------------------------|
| tileService | 29 | Component-to-tile mapping (18), floor data (7), preview tiles (4) |
| authService | 11 | Login, register, profile fetch, logout, error parsing |
| apiClient | 8 | GET/POST/PUT/DELETE, 204 handling, error formatting |
| tempAuth | 7 | Temp auth validation, case sensitivity |
| layoutService | 5 | CRUD operations, public vs. authenticated endpoints |
| relationalServices | 5 | Equipment overrides, exercise CRUD |
| componentService | 3 | Create, update, delete components |
| floorService | 3 | Create, update, delete floors |

**Contexts tested (3 files, ~30 tests):**

| Context | Tests | Key Behaviours Verified |
|---------|-------|------------------------|
| AuthContext | 13 | Login/logout state, localStorage persistence, session refresh, route guards |
| ThemeContext | 11 | Theme toggle, localStorage, system preference detection, DOM class |
| SettingsContext | 8 | Font scale, reduced motion, high contrast, sound toggle |

### 3.2 Integration Tests (3 files, 27 tests)

Integration tests render the **full application** (`<App />`) inside real providers (`ThemeProvider`, `SettingsProvider`, `AuthProvider`) with real routing (`MemoryRouter`), and only mock the HTTP layer (`fetch`). This verifies that components, contexts, and the router work together correctly.

**Auth Flow Integration (10 tests):**
- Login form renders with correct fields → user fills in credentials → API called → navigates to home
- Login with invalid credentials → error message displayed
- Already-authenticated user at `/login` → redirected to home
- Signup form renders → password mismatch/length validation → error messages
- Successful registration → redirect to login page
- API error on registration → error displayed

**Route Navigation Integration (10 tests):**
- Public routes render correct content: `/`, `/login`, `/signup`, `/settings`, `/nonexistent`
- Auth guards: `/profile` and `/map/edit/:id` redirect unauthenticated users → `/login`
- Authenticated user can access `/profile`
- Header with navigation appears consistently across pages

**Context Propagation Integration (7 tests):**
- Dark theme setting → `dark` class applied to `document.documentElement`
- Light theme → `dark` class removed
- Theme persisted to `localStorage`
- Settings page renders accessibility controls (font scale, high contrast, reduced motion)
- Auth state persisted in `localStorage` across renders
- Expired session (401 from `/api/profile`) → auth cleared, user redirected to login

---

## 4. Test Results Summary

### Final Test Run

```
 Test Files  41 passed (41)
      Tests  417 passed (417)
   Duration  14.60s
```

### Code Coverage (Unit Tests)

| Category | Statements | Branches | Functions | Lines |
|----------|-----------|----------|-----------|-------|
| **All Files** | **90.33%** | **81.12%** | **91.37%** | **93.20%** |
| Components | 86.52% | 82.50% | 88.23% | 89.97% |
| Pages | 90.38% | 74.37% | 90.00% | 94.06% |
| Services | 97.95% | 88.13% | 97.22% | 98.87% |
| Contexts | 100% | 88.88% | 100% | 100% |
| Hooks | 100% | 100% | 100% | 100% |
| Constants | 100% | 100% | 100% | 100% |

### Requirements Coverage Matrix

| Requirement Area | Unit Tests | Integration Tests | Coverage |
|-----------------|------------|-------------------|----------|
| Interactive map editing | ✅ 23 tests | — | 75% branch |
| Equipment tile display | ✅ 18 tests | — | 98% |
| Machine/equipment details modal | ✅ 20 tests | — | 100% |
| Authentication (login/signup) | ✅ 21 tests | ✅ 10 tests | 97% |
| Route navigation & guards | ✅ 8 tests | ✅ 10 tests | 100% |
| Theme (dark/light mode) | ✅ 11 tests | ✅ 3 tests | 100% |
| Accessibility settings | ✅ 8 tests | ✅ 2 tests | 100% |
| API service contracts | ✅ 62 tests | — | 98% |
| Search functionality | ✅ 13 tests | — | 100% |
| Floor navigation | ✅ 10 tests | — | 91% |

---

## 5. Evidence of Testing & Debugging

### 5.1 Test File Listing

```
src/
├── __tests__/integration/
│   ├── auth-flow.integration.test.tsx          (10 tests)
│   ├── context-propagation.integration.test.tsx (7 tests)
│   └── route-navigation.integration.test.tsx   (10 tests)
├── components/__tests__/
│   ├── DragAndDropMenu.test.tsx                 (6 tests)
│   ├── DropDownMenu.test.tsx                    (5 tests)
│   ├── Header.test.tsx                         (18 tests)
│   ├── InteractiveMap.test.tsx                 (23 tests)
│   ├── LogOutButton.test.tsx                    (7 tests)
│   ├── MachineModal.test.tsx                   (20 tests)
│   ├── ProfileButton.test.tsx                   (6 tests)
│   ├── SearchBar.test.tsx                      (13 tests)
│   ├── ShinyText.test.tsx                       (7 tests)
│   ├── ThemeToggle.test.tsx                    (11 tests)
│   ├── Tile.test.tsx                           (18 tests)
│   ├── TileInfoCard.test.tsx                   (11 tests)
│   ├── ToggleSwitch.test.tsx                   (10 tests)
│   └── ZoomControls.test.tsx                    (6 tests)
├── constants/__tests__/
│   └── colors.test.ts                           (6 tests)
├── context/__tests__/
│   ├── AuthContext.test.tsx                     (13 tests)
│   ├── SettingsContext.test.tsx                  (8 tests)
│   └── ThemeContext.test.tsx                    (11 tests)
├── hooks/__tests__/
│   └── useAppSound.test.ts                      (6 tests)
├── pages/__tests__/
│   ├── App.test.tsx                             (8 tests)
│   ├── EditMapPage.test.tsx                    (13 tests)
│   ├── HomePage.test.tsx                        (8 tests)
│   ├── LoadingPage.test.tsx                         
│   ├── LoginPage.test.tsx                      (10 tests)
│   ├── MapPage.test.tsx                        (10 tests)
│   ├── NotFoundPage.test.tsx                    (4 tests)
│   ├── ProfilePage.test.tsx                     (4 tests)
│   ├── SearchMapPage.test.tsx                       
│   ├── SettingsPage.test.tsx                        
│   └── SignUpPage.test.tsx                          
└── services/__tests__/
    ├── apiClient.test.ts                        (8 tests)
    ├── authService.test.ts                     (11 tests)
    ├── componentService.test.ts                 (3 tests)
    ├── floorService.test.ts                     (3 tests)
    ├── isAdmin.test.ts                          (1 test)
    ├── layoutService.test.ts                    (5 tests)
    ├── relationalServices.test.ts               (5 tests)
    ├── tempAuth.test.ts                         (7 tests)
    └── tileService.test.ts                     (29 tests)
```

### 5.2 Key Bugs Found Through Testing

| Bug | How Found | Resolution |
|-----|-----------|------------|
| Event propagation in InteractiveMap — parent `onClick` overrode tile selection | Unit test: clicking a tile then deleting via FloatingEditTray failed because parent's click handler reset `editingTileId` to null | Added `e.stopPropagation()` to tile click handler |
| `vi.mock()` hoisting — DragAndDropMenu mock referenced an uninitialised variable | Tests passed in isolation but failed in suite; `vi.mock` factories are hoisted above `const` declarations | Inlined mock data directly inside factory function |
| Import/export mismatches | Multiple component tests silently passed with wrong mocks due to named vs. default import mismatch | Systematic audit of all test files; aligned imports with `export default` patterns |
| Component API drift | Tile tests still used `onClick` prop after component migrated to `onSelect`; MachineModal tests checked for `<video>` after component switched to `<img>` | Updated all assertions and mocks to match current component interfaces |
| Missing jsdom APIs | Integration tests crashed: `window.matchMedia is not a function`, `ResizeObserver` not supported | Added polyfill mocks in test setup; mocked 3D background component (Silk) |

### 5.3 Debugging Process

<!-- [FILL IN: Describe your debugging workflow — e.g., how you used console.log, React DevTools, VS Code debugger, or Vitest's --reporter=verbose mode to diagnose test failures. Include any screenshots of test output, coverage reports, or CI logs if available for the appendix.] -->

### 5.4 Iterative Testing Timeline

<!-- [FILL IN: A brief timeline of when major testing efforts happened relative to your sprints/iterations. For example:
- Sprint 1: Set up Vitest, wrote initial component tests (Tile, ZoomControls, ToggleSwitch)
- Sprint 2: Added page tests (LoginPage, MapPage), service contract tests
- Sprint 3: Expanded InteractiveMap tests, fixed 111 test failures from API changes
- Sprint 4: Added integration tests (auth flows, routing, context propagation), achieved 417 passing tests
] -->

---

## 6. Reflection

### What Worked Well

- **Risk-based test specification** (TEST_SPEC.md) focused effort on the highest-impact areas — InteractiveMap and auth — rather than chasing 100% coverage everywhere.
- **Integration tests** caught real issues that unit tests missed, such as context providers not propagating theme changes and auth guards not redirecting correctly when combined with the real router.
- **Mocking strategy** — isolating components from their children in unit tests, but using real providers in integration tests, gave us both speed and confidence.

### What We Would Improve

- **Earlier integration tests** — writing these at the end meant some cross-component issues were caught late. Next time, we'd write a basic integration smoke test after each page is implemented.
- **Branch coverage gaps** — Pages average 74% branch coverage, meaning some error/edge-case paths remain untested. We would prioritise error state testing in future iterations.
- **No end-to-end tests** — While out of scope for this phase, browser automation (e.g., Playwright) would catch CSS layout issues and real network timing that jsdom cannot simulate.

<!-- [FILL IN: Add any team-specific reflections — what you learned, what surprised you, what you'd do differently.] -->
