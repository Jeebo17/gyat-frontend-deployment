# Testing Documentation

## Overview

This project uses a comprehensive front-end test suite to verify the correctness of React components, pages, context providers, hooks, services, and constants. All **371 tests** across **37 test files** pass successfully.

| Category   | Test Files | Test Cases |
|------------|-----------|------------|
| Components | 14        | 173        |
| Pages      | 10        | 81         |
| Services   | 8         | 44         |
| Context    | 3         | 30         |
| Constants  | 1         | 6          |
| Hooks      | 1         | 6          |
| **Total**  | **37**    | **371**    |

---

## Test Infrastructure

### Tools & Libraries

| Tool | Purpose |
|------|---------|
| [Vitest](https://vitest.dev/) v4.0.15 | Test runner, assertions (`describe`, `it`, `expect`), mocking (`vi.mock`, `vi.fn`) |
| [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) | `render`, `screen`, `fireEvent`, `waitFor`, `act`, `renderHook` |
| [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) | Custom DOM matchers (`toBeInTheDocument`, `toHaveClass`, `toHaveAttribute`, etc.) |
| [jsdom](https://github.com/jsdom/jsdom) | Simulated browser environment |
| v8 | Code coverage provider |

### Configuration

**Test runner** — `vitest.config.ts`
- Environment: `jsdom` with global APIs enabled
- Setup file: `src/test/setupTests.ts` (imports `@testing-library/jest-dom`)
- Coverage provider: **v8**, reporters: `text`, `html`, `lcov`
- Includes: `src/**/*.{ts,tsx}`
- Excludes: test files, type definitions, `main.tsx`, backgrounds, effects, barrel index files

**Test utilities** — `src/test/mockData.ts`
- Exports pre-built fixtures: `mockEquipment`, `mockTile`, `mockTiles`
- Factory functions: `createMockTile(overrides?)`, `createMockEquipment(overrides?)` for flexible test data creation

---

## Code Coverage Summary

Overall coverage: **90.33% statements, 81.12% branches, 91.37% functions, 93.20% lines**

| Directory           | % Stmts | % Branch | % Funcs | % Lines |
|---------------------|---------|----------|---------|---------|
| **src (root)**      | 100     | 100      | 100     | 100     |
| **src/components**  | 86.52   | 82.50    | 88.23   | 89.97   |
| **src/components/effects** | 100 | 100   | 100     | 100     |
| **src/constants**   | 100     | 100      | 100     | 100     |
| **src/context**     | 100     | 88.88    | 100     | 100     |
| **src/hooks**       | 100     | 100      | 100     | 100     |
| **src/pages**       | 90.38   | 74.37    | 90      | 94.06   |
| **src/services**    | 97.95   | 88.13    | 97.22   | 98.87   |

### Per-File Coverage

| File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines |
|------|---------|----------|---------|---------|-----------------|
| App.tsx | 100 | 100 | 100 | 100 | — |
| DragAndDropMenu.tsx | 100 | 100 | 100 | 100 | — |
| DropDownMenu.tsx | 90.9 | 91.66 | 87.5 | 90 | 47 |
| Header.tsx | 95.83 | 90.32 | 91.66 | 95.65 | 35 |
| InteractiveMap.tsx | 75.11 | 64.76 | 86 | 78.8 | 157, 276–279, 334 |
| LogOutButton.tsx | 93.75 | 84.61 | 66.66 | 100 | 26, 44 |
| MachineModal.tsx | 100 | 100 | 100 | 100 | — |
| ProfileButton.tsx | 88.23 | 81.81 | 60 | 93.75 | 38 |
| SearchBar.tsx | 100 | 100 | 100 | 100 | — |
| ShinyText.tsx | 100 | 100 | 100 | 100 | — |
| ThemeToggle.tsx | 85.71 | 100 | 60 | 100 | — |
| Tile.tsx | 98.24 | 90 | 100 | 100 | 132, 243, 251, 270 |
| TileInfoCard.tsx | 100 | 100 | 100 | 100 | — |
| ToggleSwitch.tsx | 100 | 100 | 100 | 100 | — |
| ZoomControls.tsx | 100 | 50 | 100 | 100 | 16 |
| colors.ts | 100 | 100 | 100 | 100 | — |
| AuthContext.tsx | 100 | 81.81 | 100 | 100 | 48–51 |
| SettingsContext.tsx | 100 | 100 | 100 | 100 | — |
| ThemeContext.tsx | 100 | 100 | 100 | 100 | — |
| useAppSound.ts | 100 | 100 | 100 | 100 | — |
| EditMapPage.tsx | 80.76 | 71.15 | 73.91 | 86.56 | 99, 107, 172–184 |
| HomePage.tsx | 87.5 | 50 | 66.66 | 100 | 51–79 |
| LoadingPage.tsx | 100 | 100 | 100 | 100 | — |
| LoginPage.tsx | 97.22 | 94.44 | 100 | 100 | 25, 52 |
| MapPage.tsx | 90.9 | 58.18 | 100 | 92.53 | 52, 82–84, 99 |
| NotFoundPage.tsx | 100 | 100 | 100 | 100 | — |
| ProfilePage.tsx | 100 | 100 | 100 | 100 | — |
| SettingsPage.tsx | 100 | 50 | 100 | 100 | 22–24 |
| SignUpPage.tsx | 97.5 | 96.66 | 100 | 100 | 26 |
| apiClient.ts | 100 | 72.72 | 100 | 100 | 1 |
| authService.ts | 92.3 | 86.66 | 87.5 | 96 | 57 |
| componentService.ts | 100 | 100 | 100 | 100 | — |
| floorService.ts | 100 | 100 | 100 | 100 | — |
| isAdmin.ts | 100 | 100 | 100 | 100 | — |
| layoutService.ts | 100 | 100 | 100 | 100 | — |
| tempAuth.ts | 100 | 100 | 100 | 100 | — |
| tileService.ts | 100 | 91.3 | 100 | 100 | 33, 82 |

---

## Test File Details

### Component Tests — `src/components/__tests__/`

#### DragAndDropMenu.test.tsx (6 tests)

**Mocking:** `react-icons` modules (`tb`, `md`, `gi`, `io5`, `gr`)

| Test | Description |
|------|-------------|
| renders heading | Checks "Drag and drop" text renders |
| renders all equipment components | Verifies all 6 equipment names render |
| each template item is draggable | All items have `draggable="true"` |
| sets dataTransfer on drag start | Validates drag data payload for Treadmill |
| sets correct data for each template | Validates name/colour/width/height for all 6 templates |
| renders icons for each template | All 6 icons render with test IDs |

---

#### DropDownMenu.test.tsx (5 tests)

**Mocking:** `framer-motion`, `ThemeToggle`, `ProfileButton`, `react-icons/io5`

| Test | Description |
|------|-------------|
| renders chevron icon | Chevron icon present |
| renders ProfileButton and ThemeToggle as menu items | Both sub-components render |
| toggles menu on click | Clicking chevron toggles menu without crash |
| opens menu on mouse enter and closes on mouse leave | Hover interaction works |
| has fixed position wrapper | CSS classes `fixed`, `top-4`, `right-4` applied |

---

#### Header.test.tsx (18 tests)

**Mocking:** `react-router` (`useNavigate`), `framer-motion`, `ThemeToggle`, `ProfileButton`, `useAppSound`, `AuthContext`, `SettingsContext`, `react-icons/io5`

| Test | Description |
|------|-------------|
| renders the app name | "GYAT" text present |
| renders navigation items | Home, Map, Settings present |
| renders with banner role | `<header>` has banner role |
| renders navigation with correct aria label | Nav has "main navigation" aria label |
| renders ThemeToggle and ProfileButton | Both sub-components present |
| navigates to home when app name is clicked | Click GYAT → `navigate('/')` |
| navigates when nav items are clicked | Click Home → `navigate('/')` |
| applies custom className | Custom class applied to header |
| shows mobile menu button | "Open menu" aria-label present |
| toggles mobile menu on click | Opens/closes mobile menu |
| displays username when logged in | Shows "Hi, TestUser" |
| does not display username when not logged in | No greeting rendered |
| highlights the current page nav item | Active icon for current route |
| navigates and closes mobile menu when mobile item is clicked | Mobile nav works |
| plays sound on nav click when soundEnabled is true | Navigation with sound |
| does not crash when soundEnabled is false | Navigation without sound |
| renders selected page icon for /map | Map icon active on /map |
| renders selected page icon for /settings | Settings icon active on /settings |

---

#### InteractiveMap.test.tsx (27 tests)

**Mocking:** `Tile`, `MachineModal`, `ZoomControls`, `ThemeContext`, `ShinyText`

| Test | Description |
|------|-------------|
| renders without crashing | Empty tiles render |
| renders tiles from floorTiles prop | Tiles 1 & 2 present |
| shows loading state when floorLoading is true | "Loading Floor..." text |
| shows error message when floorLoadError is set | Error message displayed |
| shows empty message when no tiles and not loading | "This floor has no equipment yet" |
| renders zoom controls when not in preview mode | ZoomControls present |
| does not render zoom controls in preview mode | ZoomControls hidden |
| opens machine modal when tile is clicked in view mode | Modal opens on click |
| closes machine modal when close button is clicked | Modal closes |
| does not open modal in edit mode | No modal in edit mode |
| handles zoom in button | Zoom in doesn't crash |
| handles zoom out button | Zoom out doesn't crash |
| handles reset zoom button | Reset doesn't crash |
| handles drag and drop in edit mode | Edit mode with tiles renders |
| uses preview dimensions in preview mode | Preview mode renders |
| respects highlightedTileId prop | Highlighted tile renders |
| disables gridSnap when snapToGrid is false | Snap disabled |
| handles Control+Z keydown without crashing | Undo shortcut doesn't crash |
| handles zoom in/out/reset in sequence | Sequential zoom operations |
| renders internal map container structure | Map container present |
| has dragover behavior in edit mode | Dragover container exists |
| does not open modal in preview mode | No modal in preview |
| handles onTilesChange callback notification | Callback present |
| calls updateTile when tile onUpdate fires in edit mode | `onTilesChange` called on update |
| calls deleteTile when tile onDelete fires in edit mode | Tile deleted, `onTilesChange` called |
| calls updateTile for preview mode tiles | Preview update doesn't crash |
| handles drop event in edit mode | Drop event with data transfer |

---

#### LogOutButton.test.tsx (8 tests)

**Mocking:** `react-router`, `framer-motion`, `useAppSound`, `AuthContext`, `SettingsContext`, `react-icons/io5`

| Test | Description |
|------|-------------|
| renders logout button when logged in | Button with "log out" present |
| renders logout icon | Logout icon present |
| calls logout and navigates to /login on click | `logout()` + `navigate` called |
| returns null when loading | Empty render during loading |
| returns null when not logged in | Empty render when logged out |
| renders header variant when header prop is true | Header styling applied |
| renders default variant when header prop is false | Default styling applied |
| has correct aria-label | aria-label "Log out" |

---

#### MachineModal.test.tsx (13 tests)

**Mocking:** `react-icons/rx`

| Test | Description |
|------|-------------|
| renders the equipment name | Equipment name displayed |
| renders the description | Description displayed |
| renders the muscles targeted | Muscles listed |
| renders the benefits/exercises | Benefits listed |
| calls onClose when backdrop is clicked | Backdrop click closes |
| does not call onClose when modal content is clicked | Click propagation stopped |
| calls onClose when close button is clicked | Close button works |
| uses fixed position by default | `fixed` class applied |
| uses absolute position in container mode | `absolute` class in container mode |
| renders video preview placeholder when no videoUrl | "Video preview" text |
| renders iframe when videoUrl is provided | Iframe with correct src |
| renders section headings | Description, Muscles, Exercises, Video headings |
| renders an icon if the tile has one | Equipment icon renders |

---

#### ProfileButton.test.tsx (7 tests)

**Mocking:** `react-router`, `framer-motion`, `useAppSound`, `AuthContext`, `SettingsContext`, `react-icons/io5`

| Test | Description |
|------|-------------|
| renders the profile button | Button with "profile" present |
| renders the profile icon | Profile icon present |
| navigates to /login when not logged in | Navigate to login |
| navigates to /profile when logged in | Navigate to profile |
| renders header variant when header prop is true | Header styling |
| renders default variant when header prop is false | Default styling |
| has correct aria-label | aria-label "Profile" |

---

#### SearchBar.test.tsx (12 tests)

**Mocking:** None (pure component)

| Test | Description |
|------|-------------|
| renders the search input | Input with placeholder present |
| filters results based on name query | Name filtering works |
| filters results based on description query | Description filtering works |
| shows "No results found" when there are no matches | No results message |
| shows no dropdown when query is empty | Empty query = no dropdown |
| calls onSelect when a result is clicked | `onSelect` callback fired |
| updates input value when a result is selected | Input value updated on select |
| closes dropdown when clicking outside | Click outside closes dropdown |
| opens dropdown on input focus | Focus reopens dropdown |
| displays floor name for each result | "Floor: ..." shown |
| displays item id for each result | "#1" shown |
| is case insensitive | Case-insensitive search |

---

#### ShinyText.test.tsx (7 tests)

**Mocking:** None

| Test | Description |
|------|-------------|
| renders the text | Text content renders |
| applies animate-shine class when not disabled | Animation class present |
| does not apply animate-shine class when disabled | Animation class absent when disabled |
| applies custom className | Custom class applied |
| applies correct animation speed | Custom speed (3s) |
| uses default speed of 5s | Default speed |
| has background-clip text styling | `bg-clip-text` class |

---

#### ThemeToggle.test.tsx (10 tests)

**Mocking:** `use-sound`, `SettingsContext`, `ThemeContext` (with `vi.fn()` for `useTheme`)

| Test | Description |
|------|-------------|
| renders a button | Button present |
| shows moon icon when theme is light | Moon icon for light theme |
| shows sun icon when theme is dark | Sun icon for dark theme |
| calls toggleTheme when button is clicked | Toggle function called |
| has correct aria-label for accessibility | "toggle theme" label |
| has z-50 position styles | z-50 class present |
| renders header variant with header=true | Header variant renders |
| calls toggleTheme in header variant when clicked | Header variant toggle works |
| shows moon icon in header variant for light theme | Moon in header + light |
| shows sun icon in header variant for dark theme | Sun in header + dark |

---

#### Tile.test.tsx (38 tests)

**Mocking:** `ThemeContext`; `beforeAll` stubs `window.matchMedia`

| Test | Description |
|------|-------------|
| renders equipment title | Title text renders |
| renders and displays title | Duplicate title check |
| applies colour style | Color renders |
| calls onClick when tile is clicked and in non-edit mode | Click handler in view mode |
| does not call onClick when tile is clicked and in edit mode | No click in edit mode |
| renders hover effect when canHover is true and not in edit mode | Hover brightness class |
| does not render hover effect when canHover is false | No hover class |
| renders move cursor in edit mode | Cursor style in edit mode |
| renders without onClick provider if not provided | Renders without handler |
| has correct aria-label for accessibility | aria-label matches equipment name |
| applies highlighted ring class when highlighted is true | `ring-4` class |
| does not apply highlighted ring class when highlighted is false | No ring class |
| renders preview mode text with text-2xl class | Preview text size |
| renders non-preview mode text with truncate class | Truncation in normal mode |
| applies fallback color for unknown colour | gray-600 fallback |
| shows delete and rotate buttons in edit mode with onUpdate | Edit UI shows |
| shows resize handles in edit mode with onUpdate | 8 resize handles |
| does not show delete/rotate/resize handles without onUpdate | No handles without callback |
| calls onDelete when delete button is clicked | Delete callback fires |
| calls onUpdate with swapped dimensions when rotate button is mousedown | Rotation swaps w/h |
| handles drag (mousedown + mousemove + mouseup) in edit mode | Drag works |
| handles drag in preview mode with onUpdate | Preview drag works |
| does not start drag in non-edit non-preview mode | No drag in view mode |
| handles resize via east handle | East resize |
| handles resize via south handle | South resize |
| handles resize via north handle | North resize |
| handles resize via west handle | West resize |
| handles resize via se corner handle | SE corner resize |
| handles resize via sw corner handle | SW corner resize |
| handles resize via ne corner handle | NE corner resize |
| handles resize via nw corner handle | NW corner resize |
| applies known colour classes for each colour | All 8 colour variants |
| does not start drag without onUpdate | No drag without callback |
| positions at xCoord/yCoord and rendered width/height | Correct CSS positioning |
| applies rotation transform | CSS rotate transform |
| does not resize below minimum size | Min size enforcement |
| rejects drag moves that fail canPlace check | `canPlace=false` prevents move |
| rejects resize that fails canPlace check | `canPlace=false` prevents resize |

---

#### TileInfoCard.test.tsx (10 tests)

**Mocking:** None (uses `createMockTile` fixture)

| Test | Description |
|------|-------------|
| renders the equipment name | Name displayed |
| renders the description | Description displayed |
| renders up to 3 benefits | Benefits truncated at 3 |
| calls onClose when close button is clicked | Close callback |
| stops propagation on click | Click doesn't bubble |
| positions the card to the right of the tile | CSS `left = xCoord + width + 16` |
| clamps position to not exceed map bounds | Position clamped |
| does not render description when not provided | Graceful handling |
| does not render benefits when not provided | Graceful handling |
| renders the close button with aria-label | Close button accessible |

---

#### ToggleSwitch.test.tsx (11 tests)

**Mocking:** `use-sound`, `SettingsContext`

| Test | Description |
|------|-------------|
| renders a button | Checkbox present |
| calls onChange with true when toggled from unchecked | Toggle on |
| calls onChange with false when toggled from unchecked | Toggle off |
| has correct checked state | Checked/unchecked state |
| applies highlight class when highlight is true and checked | `bg-accent-primary` |
| applies non-highlight class when highlight is false | `bg-bg-tertiary` |
| does not apply highlight class when checked is false | No highlight when off |
| has default highlight as true | Default highlight behavior |
| slider has correct position when checked | `translate-x-full` |
| slider has correct position when unchecked | No translate |
| has correct aria-label for accessibility | "toggle switch" label |

---

#### ZoomControls.test.tsx (6 tests)

**Mocking:** `ThemeContext`; `beforeAll` stubs `window.matchMedia`

| Test | Description |
|------|-------------|
| renders zoom in, zoom out, and reset buttons | All 3 buttons present |
| calls onZoomIn when zoom in button is clicked | Callback fired |
| calls onZoomOut when zoom out button is clicked | Callback fired |
| calls onReset when reset button is clicked | Callback fired |
| applies dark theme classes | `text-black` class |
| has correct aria-label for accessibility | All 3 buttons have correct aria-labels |

---

### Constants Tests — `src/constants/__tests__/`

#### colors.test.ts (6 tests)

**Mocking:** None

| Test | Description |
|------|-------------|
| exports light theme colors | Light theme values correct |
| exports dark theme colors | Dark theme values correct |
| exports high contrast light theme | HC light values correct |
| exports high contrast dark theme | HC dark values correct |
| has consistent structure across theme variants | All categories present in both themes |
| Theme type allows light and dark | Type check |

---

### Context Tests — `src/context/__tests__/`

#### AuthContext.test.tsx (13 tests)

**Mocking:** `authService` (`getManagerProfile`, `logoutManager`)  
**Setup:** `beforeEach` clears mocks, `localStorage`, `sessionStorage`; default `getManagerProfile` rejects  
**Custom helper:** `TestConsumer` component exposing all auth values and actions

| Test | Description |
|------|-------------|
| starts with isLoading true | Initial loading state |
| sets logged out state after failed refresh | Failed refresh → logged out |
| sets logged in state after successful refresh | Successful refresh → logged in with user data |
| login updates state and persists to localStorage | Login sets state + localStorage |
| logout clears state and sessionStorage | Logout clears everything |
| restores state from localStorage on mount | Persisted state restored |
| handles corrupted localStorage gracefully | Invalid JSON handled |
| throws when useAuth is used outside provider | Context error thrown |
| **RequireAuth:** renders children when logged in | Protected content visible |
| **RequireAuth:** renders nothing when not logged in | Protected content hidden |
| **RequireAuth:** renders nothing while loading | Null during loading |
| **RequireAdmin:** renders children when logged in | Admin content visible |
| **RequireAdmin:** renders nothing when not logged in | Admin content hidden |

---

#### SettingsContext.test.tsx (8 tests)

**Mocking:** None (tests real provider)  
**Setup:** `beforeEach` resets DOM classes and styles  
**Custom helper:** `TestConsumer` exposing all settings values and setters

| Test | Description |
|------|-------------|
| provides default values | fontScale=1, reducedMotion=false, etc. |
| updates fontScale | `setFontScale(1.5)` updates state |
| applies fontScale to root element fontSize | document fontSize = "150%" |
| updates reducedMotion | `setReducedMotion(true)` works |
| updates highContrast and adds class | "high-contrast" class added |
| removes high-contrast class when disabled | Class removed |
| updates soundEnabled | `setSoundEnabled(false)` works |
| throws when useSettings is used outside provider | Context error thrown |

---

#### ThemeContext.test.tsx (9 tests)

**Mocking:** None (tests real provider)  
**Setup:** `beforeEach` clears localStorage, removes dark class, stubs `matchMedia`  
**Custom helper:** `TestConsumer` exposing `theme` + `toggleTheme`

| Test | Description |
|------|-------------|
| provides light theme by default | Default is light |
| toggles from light to dark | Toggle works |
| toggles from dark back to light | Double toggle works |
| persists theme to localStorage | localStorage set to "dark" |
| restores theme from localStorage | Reads persisted theme |
| adds dark class to document element for dark theme | `dark` class added |
| removes dark class when switching to light | `dark` class removed |
| respects prefers-color-scheme dark media query | System preference detected |
| throws when useTheme is used outside provider | Context error thrown |

---

### Hook Tests — `src/hooks/__tests__/`

#### useAppSound.test.ts (6 tests)

**Mocking:** `use-sound`, `SettingsContext` (`useSettings` as `vi.fn()`)

| Test | Description |
|------|-------------|
| returns play function and exposed data | Returns `[fn, data]` tuple |
| passes sound source and options to useSound | Correct args forwarded |
| uses default volume of 0.3 when not specified | Default volume |
| returns no-op play when sound is disabled | Disabled → no-op |
| sets volume to 0 when sound is disabled | Volume overridden to 0 |
| allows play when sound is enabled | Enabled → real play called |

---

### Page Tests — `src/pages/__tests__/`

#### App.test.tsx (8 tests)

**Mocking:** `useAppSound`, `SettingsContext`, `AuthContext`, `ThemeContext`, all page components  
**Setup:** Uses `MemoryRouter` with `initialEntries`

| Test | Description |
|------|-------------|
| renders HomePage at / | Route `/` → HomePage |
| renders MapPage at /map | Route `/map` → MapPage |
| renders EditMapPage at /map/edit | Route `/map/edit` → EditMapPage |
| renders SettingsPage at /settings | Route `/settings` → SettingsPage |
| renders LoginPage at /login | Route `/login` → LoginPage |
| renders SignUpPage at /signup | Route `/signup` → SignUpPage |
| renders ProfilePage at /profile | Route `/profile` → ProfilePage |
| renders NotFoundPage for unknown routes | Route `/unknown` → NotFoundPage |

---

#### EditMapPage.test.tsx (13 tests)

**Mocking:** `framer-motion`, `react-router-dom`, `AuthContext`, `ThemeContext`, `SettingsContext`, `use-sound`, `Header`, `InteractiveMap`, `DragAndDropMenu`, `ToggleSwitch`, `isAdmin`, `layoutService`, `tileService`, `LoadingPage`

| Test | Description |
|------|-------------|
| renders header after loading | Header present |
| renders the interactive map in edit mode | Map has `edit-mode=true` |
| shows Edit Mode label | "Edit Mode" text |
| has back to view link | "Back to View" present |
| navigates to /map when back to view is clicked | Navigate to `/map` |
| renders snap to grid toggle | "Snap to grid" text |
| has floor navigation buttons | Previous/Next floor buttons |
| renders the drag and drop menu | DragDrop menu present |
| has sidebar toggle button on mobile | Equipment panel button |
| toggles sidebar open when equipment panel button is clicked | Sidebar opens |
| closes sidebar when overlay is clicked | Sidebar closes via overlay |
| toggles snap to grid | Snap toggle works |
| displays floor name from layout | "Ground" displayed |

---

#### HomePage.test.tsx (8 tests)

**Mocking:** `framer-motion`, `react-router`, `ThemeContext`, `SettingsContext`, `AuthContext`, `use-sound`, `Header`, `Silk`, `InteractiveMap`, `tileService`

| Test | Description |
|------|-------------|
| renders the GYAT title | "GYAT" text present |
| renders the subtitle | "The Gym App & Tracker" |
| renders the description text | "Navigate your gym smarter" |
| renders the Open Gym Map button | Button present |
| navigates to /map when button is clicked | Navigate to `/map` |
| renders the header component | Header present |
| renders the interactive map preview | Map preview present |
| renders the Silk background | Silk background present |

---

#### LoadingPage.test.tsx (3 tests)

**Mocking:** `ShinyText`, `Header`, `framer-motion`, `react-router`, `useAppSound`, `AuthContext`, `SettingsContext`, `ThemeContext`

| Test | Description |
|------|-------------|
| renders the loading text | "Loading..." text |
| renders the header | Header present |
| uses ShinyText component | ShinyText component present |

---

#### LoginPage.test.tsx (11 tests)

**Mocking:** `react-router-dom`, `framer-motion`, `Header`, `AuthContext`, `authService` (`loginManager`)

| Test | Description |
|------|-------------|
| renders the login form | "Welcome Back", inputs, button |
| renders the header | Header present |
| renders sign up link | "Sign up" link |
| shows error for empty fields on submit | "Invalid credentials" error |
| shows error for too-long password | "Invalid credentials" for 129+ char password |
| calls loginManager and navigates on success | Successful login flow |
| shows error on login failure | Error message from rejection |
| shows generic error for non-Error rejection | "An error occurred" fallback |
| redirects if already logged in | `navigate('/', { replace: true })` |
| disables submit button while loading | Button disabled |
| shows error when server returns invalid response shape | Message from response shown |

---

#### MapPage.test.tsx (12 tests)

**Mocking:** `framer-motion`, `react-router-dom`, `AuthContext`, `ThemeContext`, `SettingsContext`, `use-sound`, `Header`, `InteractiveMap`, `SearchBar`, `isAdmin`, `layoutService`, `tileService`, `LoadingPage`

| Test | Description |
|------|-------------|
| renders header after loading | Header present |
| renders the interactive map | Map present |
| renders the search bar | SearchBar present |
| renders floor navigation buttons | Previous/Next floor buttons |
| shows edit map button for admin users | "Edit Map" button |
| navigates to edit page when edit button is clicked | Navigate to `/map/edit` |
| displays floor name | "Ground" displayed |
| can navigate between floors | Next floor → "First" |
| disables previous floor button on first floor | Previous disabled |
| disables next floor button on last floor | Next disabled on last |
| handles search result selection | Search select fires |
| can navigate back after going to second floor | Back to "Ground" |

---

#### NotFoundPage.test.tsx (4 tests)

**Mocking:** `FuzzyText`; uses `MemoryRouter`

| Test | Description |
|------|-------------|
| renders 404 text | "404" present |
| renders the oops message | "oops page not found" |
| renders a link to home | "Go to Home" link with `href="/"` |
| uses the FuzzyText component for 404 | FuzzyText component renders |

---

#### ProfilePage.test.tsx (4 tests)

**Mocking:** `react-router-dom`, `framer-motion`, `Header`, `LogoutButton`, `react-router`, `useAppSound`, `AuthContext`, `SettingsContext`, `ThemeContext`

| Test | Description |
|------|-------------|
| renders the header | Header present |
| renders the logout button when logged in | Logout button present |
| redirects to /login when not logged in | Navigate to `/login` |
| returns null while loading | Empty render |

---

#### SettingsPage.test.tsx (13 tests)

**Mocking:** `react-router-dom`, `framer-motion`, `Header`, `react-router`, `useAppSound`, `AuthContext`, `SettingsContext` (with mock setters), `ThemeContext`

| Test | Description |
|------|-------------|
| renders the accessibility settings heading | "Accessibility Settings" heading |
| renders the header | Header present |
| renders the font size slider | Slider present |
| calls setFontScale when slider changes | `setFontScale(1.2)` called |
| renders sound effects checkbox | "Enable Sound Effects" |
| calls setSoundEnabled when sound checkbox changes | `setSoundEnabled` called |
| renders reduced motion checkbox | "Reduced Animations" |
| renders high contrast checkbox | "High Contrast Mode" |
| renders a back button | "Back" button |
| navigates back when back button is clicked | `navigate(-1)` |
| displays the current font scale percentage | "Font Size: 100%" |
| calls setReducedMotion when reduced animations checkbox changes | `setReducedMotion` called |
| calls setHighContrast when high contrast checkbox changes | `setHighContrast` called |

---

#### SignUpPage.test.tsx (12 tests)

**Mocking:** `react-router-dom`, `framer-motion`, `Header`, `AuthContext`, `authService` (`registerManager`)

| Test | Description |
|------|-------------|
| renders the sign up form | "Create Account", all 4 inputs, button |
| renders the header | Header present |
| renders sign in link | "Sign in" link |
| navigates to /login when sign in is clicked | Navigate to `/login` |
| shows error when fields are empty | "Please complete all required fields." |
| shows error when passwords do not match | "Passwords do not match." |
| shows error when password is too short | "Password must be at least 6 characters." |
| calls registerManager and navigates to login on success | Successful registration flow |
| shows error on registration failure | Error message from rejection |
| shows generic error for non-Error rejection | "Unable to create account" |
| redirects if already logged in | `navigate('/', { replace: true })` |
| disables submit button while submitting | Button disabled, text "Signing up..." |

---

### Service Tests — `src/services/__tests__/`

#### apiClient.test.ts (7 tests)

**Mocking:** `globalThis.fetch` (manual mock/restore in `beforeEach`/`afterEach`)

| Test | Description |
|------|-------------|
| makes GET request by default | GET with credentials + JSON header |
| makes POST request with body | POST with serialized body |
| returns undefined for 204 No Content | 204 → `undefined` |
| throws error for non-ok response | 404 → throw with message |
| includes method name in error message | DELETE error includes method |
| handles text() rejection gracefully | "Unknown error" fallback |
| merges custom headers | Custom headers preserved |

---

#### authService.test.ts (11 tests)

**Mocking:** `globalThis.fetch` (manual mock/restore)

| Describe Block | Test | Description |
|----------------|------|-------------|
| **loginManager** | sends POST with login credentials | POST to `/api/auth/login` |
| | throws on login failure | 401 → "Bad credentials" |
| | throws raw text when response is not JSON | 500 → raw text |
| **registerManager** | sends POST with register credentials | POST to `/api/auth/register` |
| | throws on registration failure | 409 → "Email already exists" |
| **getManagerProfile** | sends GET to profile endpoint | GET to `/api/profile` |
| | throws when not authenticated | 401 → "Unauthorized" |
| **logoutManager** | sends POST to logout endpoint | POST to `/logout` with credentials |
| | does not throw when fetch fails | Network error swallowed |
| **error parsing** | parses error field from JSON response | `error` field extracted |
| | returns fallback when body is empty | "Request failed (400)" |

---

#### componentService.test.ts (3 tests)

**Mocking:** `globalThis.fetch`

| Test | Description |
|------|-------------|
| createComponent — sends POST to /api/components | POST with component data |
| updateComponent — sends PUT to /api/components/:id | PUT with ID in URL |
| deleteComponent — sends DELETE to /api/components/:id | DELETE with ID in URL |

---

#### floorService.test.ts (3 tests)

**Mocking:** `globalThis.fetch`

| Test | Description |
|------|-------------|
| createFloor — sends POST to /api/layouts/:layoutId/floors | POST with layout ID |
| updateFloor — sends PUT to /api/layouts/floors/:floorId | PUT with floor ID |
| deleteFloor — sends DELETE to /api/layouts/floors/:floorId | DELETE with floor ID |

---

#### isAdmin.test.ts (1 test)

**Mocking:** None

| Test | Description |
|------|-------------|
| returns true regardless of input | Stub always returns true |

---

#### layoutService.test.ts (5 tests)

**Mocking:** `globalThis.fetch`

| Test | Description |
|------|-------------|
| getLayout — sends GET to /api/layouts/:id | GET with layout ID |
| getLayoutPublic — sends GET to /api/public/layouts/:id | GET public endpoint |
| createLayout — sends POST to /api/layouts | POST to create |
| updateLayout — sends PUT to /api/layouts/:id | PUT with layout ID |
| deleteLayout — sends DELETE to /api/layouts/:id | DELETE with layout ID |

---

#### tempAuth.test.ts (7 tests)

**Mocking:** None (tests hardcoded stub authentication)

| Test | Description |
|------|-------------|
| returns ok: true for valid credentials | Valid login returns `ok` + `name` |
| returns ok: false for wrong email | Wrong email fails |
| returns ok: false for wrong password | Wrong password fails |
| returns ok: false for both wrong | Both wrong fails |
| returns ok: false for empty strings | Empty strings fail |
| is case-sensitive for email | Case mismatch fails |
| is case-sensitive for password | Case mismatch fails |

---

#### tileService.test.ts (26 tests)

**Mocking:** `layoutService` (`getLayout`)

| Describe Block | Test | Description |
|----------------|------|-------------|
| **mapComponentToTile** | maps component to tile with correct basic properties | Basic property mapping |
| | uses equipment name from definition | Name from DTO |
| | uses equipment description from definition | Description from DTO |
| | maps exercises to benefits | Exercise names → benefits |
| | deduplicates muscles targeted | Unique muscles |
| | uses video URL from first exercise that has one | Video URL extraction |
| | assigns colour based on equipment type id | Colour assigned |
| | handles missing definition gracefully | Fallback "Equipment #999" |
| | uses equipmentId as fallback when equipmentTypeId is not a number | Fallback ID |
| | falls back to equipmentTypeId 0 when neither id is a number | Default 0 |
| | falls back to component name when no definition exists | Component name fallback |
| | uses component description when definition has none | Component desc + additionalInfo |
| | handles empty exercises array | Empty benefits, no muscles |
| | assigns consistent colour for same equipment type | Deterministic colour |
| | stores equipmentTypeId on the tile | ID preserved |
| **getFloorTiles** | returns floors, selectedFloor and mapped tiles | Full data returned |
| | returns empty when layout has no floors | Empty layout handled |
| | clamps floor index to valid range | Out-of-range index clamped |
| | sorts floors by levelOrder | Sorting verified |
| | only includes tiles for the selected floor | Floor filter works |
| **getPreviewTiles** | returns an array of tiles | Array with items |
| | each tile has required properties | All tile fields present |
| | tiles have unique IDs | No duplicate IDs |
| | contains expected equipment types | Named types present |
| | entrance tile has canHover set to false | Entrance not hoverable |
| | returns exactly 11 tiles | Exactly 11 preview tiles |

---

## Running Tests

```bash
# Run all tests
npx vitest run

# Run tests with coverage
npx vitest run --coverage

# Run tests in watch mode
npx vitest

# Run a specific test file
npx vitest run src/components/__tests__/Tile.test.tsx

# Run tests matching a pattern
npx vitest run --grep "renders"
```

## Test Patterns & Conventions

1. **File location** — Test files live in `__tests__/` directories alongside the source they test.
2. **Naming** — Files follow the pattern `<SourceFile>.test.ts(x)`.
3. **Mocking strategy** — Heavy use of `vi.mock()` at the module level to isolate components from dependencies like `framer-motion`, `react-router-dom`, icon libraries, and context providers.
4. **Rendering** — Components that depend on React Router are wrapped in `MemoryRouter`. Context-dependent components use mocked providers or direct mock returns from `vi.mock`.
5. **Accessibility** — Many tests verify `aria-label` attributes and semantic roles (`banner`, `navigation`).
6. **User interaction** — Tests use `fireEvent` (click, change, mouseDown/mouseMove/mouseUp, dragStart, drop, focus) to simulate user behavior.
7. **Async behavior** — `waitFor` and `act` are used for tests involving state updates, API calls, and effects.
8. **Fixtures** — Shared mock data in `src/test/mockData.ts` with factory functions for flexible test setup.
