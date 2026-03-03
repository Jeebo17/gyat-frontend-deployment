# Test Specification

## 1. Purpose

Define a practical, risk-based test strategy for the frontend codebase (`React + TypeScript + Vite`) so changes to map interactions, auth, and API integration can ship safely.

## 2. Scope

In scope:
- Unit tests for pure logic and utility behavior.
- Component tests for reusable UI components.
- Integration tests for page-level flows and provider interactions.
- Service tests for API request/response and error handling.
- Basic accessibility checks for key controls and dialogs.

Out of scope (for now):
- Visual regression snapshots.
- Cross-browser testing beyond the default local browser + CI runtime.
- Full end-to-end (E2E) browser automation in this phase.

## 3. Current Baseline (March 3, 2026)

Existing test stack:
- `vitest` with `jsdom`
- `@testing-library/react`
- `@testing-library/jest-dom`

Current test location:
- `src/components/__tests__/`

Current gap summary:
- Strongest coverage is basic component rendering/click behavior.
- Limited page-level and service-level coverage.
- No explicit contract tests for API service modules.
- No dedicated specification document before this file.

Note:
- `vitest.config.ts` points `setupFiles` to `./src/test/setupTests.js` while repository file is `src/test/setupTests.ts`. This should be aligned before expanding test volume.

## 4. Quality Risks and Priorities

P0 (highest):
- `InteractiveMap` editing behavior (drag/drop placement, collision prevention, tile updates/deletes).
- Data load/error states in `MapPage` and `EditMapPage`.
- Auth gating and redirects (`useAuth`, admin checks, login state handling).
- API error handling in `apiClient` and `authService`.

P1:
- `MachineModal` edit/preview/save flows.
- Tile mapping/parsing behavior in `tileService` (`mapComponentToTile`, additionalInfo parsing).
- Theme and settings persistence (`ThemeContext`, `SettingsContext`, `AuthContext` localStorage state).

P2:
- Cosmetic/animation behaviors and non-critical effects components.
- Exhaustive styling assertions that do not protect behavior.

## 5. Test Levels and Design

### 5.1 Unit Tests

Target:
- Pure utility and mapping logic.

Primary candidates:
- `src/services/tileService.ts`
- `src/services/apiClient.ts` (request behavior, HTTP error text handling)
- `src/services/authService.ts` (error parsing branches)

Examples:
- `mapComponentToTile` uses modal override values when present.
- Legacy/non-JSON `additionalInfo` is handled safely.
- `request<T>` returns `undefined` on `204`.
- `request<T>` throws formatted errors on non-OK responses.

### 5.2 Component Tests

Target:
- Reusable components with controlled props and user events.

Primary candidates:
- `Tile`
- `ZoomControls`
- `ToggleSwitch`
- `ThemeToggle`
- `MachineModal`
- `SearchBar`
- `Header`

Examples:
- Accessible labels/roles exist for actionable controls.
- `MachineModal` toggles between edit and preview in edit mode.
- Save button disable state reflects `saving`.

### 5.3 Integration Tests (Page + Providers + Router)

Target:
- User journeys across pages with mocked service calls.

Primary candidates:
- `MapPage`
- `EditMapPage`
- `App` routing behavior

Examples:
- Map page displays loading, error, and loaded states correctly.
- Search selection updates highlighted tile and floor.
- Edit page redirects to `/login` when unauthenticated.
- Non-admin user navigating to edit page is redirected to `/map`.

### 5.4 Service Contract Tests

Target:
- Ensure frontend sends expected endpoint, method, credentials, and payload shape.

Primary candidates:
- `layoutService`, `componentService`, `floorService`, `authService`

Examples:
- `updateComponent(id, data)` issues `PUT /api/components/:id`.
- Auth calls include `credentials: "include"`.
- Parse error body precedence (`message`, then `error`, then raw text).

## 6. Functional Test Matrix

| Area | Critical Scenarios | Priority | Suggested Type |
|---|---|---|---|
| Routing (`App.tsx`) | Correct page element for each route, wildcard route fallback | P1 | Integration |
| Auth Context | Initial refresh success/failure, login persistence, logout clears storage | P0 | Unit + Integration |
| Map Viewing (`MapPage`) | Layout fetch success/error, floor navigation, highlight from search | P0 | Integration |
| Map Editing (`EditMapPage`) | Auth redirect, admin gate redirect, floor/snap toggle behavior | P0 | Integration |
| Interactive Map | Add tile, collision rejection, update tile, delete tile, modal open/close | P0 | Component/Integration |
| Machine Modal | Editable fields, preview toggle, save callback and error/success messaging | P1 | Component |
| Tile Mapping (`tileService`) | Definitions fallback, modal override precedence, malformed JSON handling | P1 | Unit |
| API Client | 2xx/204 parsing, non-OK error formatting | P0 | Unit |
| Theme/Settings | localStorage persistence, DOM class toggles, reduced motion branch | P1 | Unit + Integration |

## 7. Non-Functional Checks

Accessibility:
- Core controls must remain keyboard reachable.
- Modal close behavior and button labels must be test-covered.
- Use role/name-based queries before test IDs where possible.

Performance sanity:
- Keep heavy map tests focused on behavior, not frame-rate assertions.
- Use deterministic mocks and avoid large DOM fixture generation.

Reliability:
- Avoid timing-dependent assertions when possible.
- Prefer `findBy*`/`waitFor` only for async UI changes.

## 8. Test Data and Mocking Strategy

Principles:
- Use builders/factories for DTO fixtures (`createMockTile` style) and extend for layout/auth fixtures.
- Mock network at the boundary (`fetch`) for service tests.
- For page tests, mock service modules (`layoutService`, `isAdmin`, `authService`) to isolate behavior.

Recommended additions:
- `src/test/factories/` for `GymLayoutDTO`, `GymComponentDTO`, and auth fixtures.
- Shared helper to render with providers + router.

## 9. Coverage Targets

Initial targets (phase 1):
- Statements: 65%
- Branches: 55%
- Functions: 65%
- Lines: 65%

Phase 2 target:
- Statements/Functions/Lines: 75%+
- Branches: 65%+

Gate policy:
- No PR should reduce overall coverage in modified modules.
- P0 modules must include tests for new behavior before merge.

## 10. Execution Plan

Phase 1 (high impact):
1. Fix test setup path mismatch in `vitest.config.ts`.
2. Add service tests for `apiClient` and `authService`.
3. Add integration tests for `MapPage` and `EditMapPage` auth/data-state behavior.
4. Add targeted tests for `MachineModal`.

Phase 2:
1. Add `tileService` parsing/mapping tests.
2. Expand `InteractiveMap` behavior tests (add/update/delete/collision).
3. Add context tests for theme/settings/auth persistence.

Phase 3:
1. Harden routing tests in `App`.
2. Add smoke tests for key pages under provider shell.
3. Revisit thresholds and raise if stable.

## 11. Definition of Done (Testing)

A feature change is test-complete when:
- Critical path behavior has automated coverage at the appropriate layer.
- Error and empty states are covered where applicable.
- Accessibility labels/roles for new interactive elements are asserted.
- Tests are deterministic and pass locally via `npm test`.

## 12. Suggested File Conventions

- Unit tests: `src/**/__tests__/*.test.ts`
- Component tests: `src/components/__tests__/*.test.tsx`
- Page/integration tests: `src/pages/__tests__/*.test.tsx`
- Shared test utilities: `src/test/`

This file is the baseline specification and should be updated when architecture or priorities change.