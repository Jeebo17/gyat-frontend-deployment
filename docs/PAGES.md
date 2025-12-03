# Pages Documentation

This document explains the structure and functionality of all pages in the Gyat application.

## Table of Contents

1. [What are Pages?](#what-are-pages)
2. [Page Structure](#page-structure)
3. [Home Page](#home-page)
4. [Map Page](#map-page)
5. [Loading Page](#loading-page)
6. [404 Not Found Page](#404-not-found-page)
7. [Routing System](#routing-system)
8. [Creating New Pages](#creating-new-pages)

---

## What are Pages?

Pages are special components that represent different views in your application. Each page typically has its own URL (route).

For example:
- Home page: `http://localhost:5173/`
- Map page: `http://localhost:5173/map`
- Settings page: `http://localhost:5173/settings`

### Pages vs Components

**Components** are reusable pieces (like buttons, modals, cards).
**Pages** are complete views that use multiple components together.

```
Page (Home)
├── Dock Component
├── ElectricBorder Component
│   └── SplitText Component
└── Background Component
```

---

## Page Structure

All pages are located in `src/pages/` directory:

```
src/pages/
├── Home.tsx          # Landing page
├── Map.tsx           # Interactive gym map
├── Loading.tsx       # Loading screen
└── NotFoundPage.tsx  # 404 error page
```

### Basic Page Template

```tsx
// src/pages/ExamplePage.tsx
import '../styles/App.scss';

function ExamplePage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Your page content here */}
      <h1>Example Page</h1>
      <p>This is my page content</p>
    </div>
  );
}

export default ExamplePage;
```

**Key Points:**
1. Import styles at the top
2. Use a wrapper `div` with full height and theme colors
3. Return JSX (the HTML-like code)
4. Export the component as default

---

## Home Page

**Location**: `src/pages/Home.tsx`
**Route**: `/`
**URL**: `http://localhost:5173/`

### What It Does

The home page is the landing page with:
- Animated welcome text
- Multiple animated background options
- Toggle for splash cursor effect
- Navigation dock
- Background switcher

### Key Features

#### 1. Multiple Backgrounds

The page supports 5 different animated backgrounds:

```tsx
const backgrounds = [
  () => <div></div>,              // Empty (none)
  () => <Silk ... />,             // Silk texture
  () => <FloatingLines ... />,    // Floating wave lines
  () => <ColorBends ... />,       // Colorful flowing patterns
  () => <Iridescence ... />       // Iridescent effect
];
```

#### 2. Background Switching

Click "Change backgrounds" at bottom-left to cycle through backgrounds:

```tsx
const [backgroundIndex, setBackgroundIndex] = useState(0);

// Click handler
onClick={() => {
  const nextIndex = (backgroundIndex + 1) % backgrounds.length;
  setBackgroundIndex(nextIndex);
}}
```

**How it works:**
- `backgroundIndex` keeps track of current background (0-4)
- Clicking increments the index
- `% backgrounds.length` wraps back to 0 after reaching end

#### 3. Splash Cursor Toggle

Click "Enable Splash Cursor" at bottom-right to add fluid effect:

```tsx
const [enableSplashCursor, setEnableSplashCursor] = useState(false);

{enableSplashCursor && <SplashCursor />}
```

**How conditional rendering works:**
- `&&` means "and" - if left side is true, show right side
- If `enableSplashCursor` is `true`, component appears
- If `false`, component is hidden

#### 4. Animated Welcome Text

The main heading uses multiple effect components:

```tsx
<ElectricBorder
  color="#7df9ff"
  speed={1}
  chaos={0.5}
  thickness={2}
  style={{ borderRadius: 16 }}
>
  <div className="p-10">
    <SplitText
      text="Welcome to the Gyat (The Gym App & Tracker!)"
      className="text-4xl font-bold text-center"
      delay={70}
      duration={0.6}
      ease="elastic.out(1, 0.3)"
      splitType="chars"
      from={{ opacity: 0, y: 40 }}
      to={{ opacity: 1, y: 0 }}
    />
  </div>
</ElectricBorder>
```

**What happens:**
1. Electric border animates around content
2. Text splits into individual characters
3. Each character animates from bottom (y: 40) to normal position (y: 0)
4. Each character fades in (opacity: 0 to 1)
5. Elastic easing makes it bounce slightly

### Page Layout

```tsx
<div className="min-h-screen bg-bg-primary text-text-primary">
  {/* Background (behind everything) */}
  <div className="absolute w-full h-full top-0 left-0 overflow-hidden">
    {background}
  </div>

  {/* Optional splash cursor effect */}
  {enableSplashCursor && <SplashCursor />}

  {/* Navigation dock */}
  <Dock ... />

  {/* Main content (centered) */}
  <div className="flex items-center justify-center px-4">
    <ElectricBorder>
      <SplitText ... />
    </ElectricBorder>
  </div>

  {/* Bottom-left control */}
  <div className="absolute bottom-4 left-4">
    Change backgrounds
  </div>

  {/* Bottom-right control */}
  <div className="absolute bottom-4 right-4">
    Enable/Disable Splash Cursor
  </div>
</div>
```

### State Management

```tsx
// Track which background is showing (0-4)
const [backgroundIndex, setBackgroundIndex] = useState(0);

// Track if splash cursor is enabled
const [enableSplashCursor, setEnableSplashCursor] = useState(false);
```

**State** is data that can change over time. When state changes, the page re-renders (updates).

### useMemo Hook

```tsx
const background = useMemo(() => {
  const BackgroundComponent = backgrounds[backgroundIndex];
  return <BackgroundComponent />;
}, [backgroundIndex]);
```

**What useMemo does:**
- Remembers the calculated value
- Only recalculates when `backgroundIndex` changes
- Improves performance by avoiding unnecessary work

---

## Map Page

**Location**: `src/pages/Map.tsx`
**Route**: `/map`
**URL**: `http://localhost:5173/map`

### What It Does

The map page displays an interactive gym floor plan with:
- Equipment tiles (treadmills, weights, etc.)
- Edit mode for moving/resizing equipment
- Equipment detail modals
- Grid-based layout
- Auto-scaling to fit screen

### Key Features

#### 1. Loading State

Shows loading screen briefly while page initializes:

```tsx
const [loading, setLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setLoading(false);
  }, 300);
  return () => clearTimeout(timer);
}, []);

if (loading) {
  return <Loading />;
}
```

**How it works:**
1. Page starts with `loading = true`
2. After 300ms, sets `loading = false`
3. While loading, shows Loading component
4. After loading, shows main content
5. Cleanup function clears timer if component unmounts

#### 2. InteractiveMap Component

The main feature of this page:

```tsx
<InteractiveMap />
```

This component contains:
- All equipment tiles
- Edit mode toggle
- Drag and resize functionality
- Grid snapping
- Equipment modals

### Page Layout

```tsx
<div className="min-h-screen bg-bg-primary text-text-primary p-8 pr-20">
  {/* Navigation dock */}
  <Dock
    panelHeight={68}
    baseItemSize={50}
    magnification={70}
  />

  {/* Page header */}
  <div className="flex flex-row items-center gap-10 mb-8">
    <h1 className="text-3xl font-medium select-none">
      Interactive Gym Map
    </h1>
  </div>

  {/* Main map */}
  <InteractiveMap />
</div>
```

### Understanding useEffect

```tsx
useEffect(() => {
  // This code runs after component mounts
  const timer = setTimeout(() => {
    setLoading(false);
  }, 300);

  // Cleanup function (runs when component unmounts)
  return () => clearTimeout(timer);
}, []); // Empty array = run once on mount
```

**useEffect Dependency Array:**
- `[]` (empty) - Run once when component mounts
- `[value]` - Run when `value` changes
- No array - Run after every render (usually avoid this)

---

## Loading Page

**Location**: `src/pages/Loading.tsx`
**Route**: Used as a component, not a route
**Purpose**: Display while content is loading

### What It Does

Shows an animated "Loading..." text using the ShinyText effect:

```tsx
function Loading() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
      <ShinyText
        text="Loading..."
        disabled={false}
        speed={2}
        className='text-4xl font-light select-none'
      />
    </div>
  );
}
```

### Usage

Used by other pages during data loading:

```tsx
const [loading, setLoading] = useState(true);

if (loading) {
  return <Loading />;
}

return <ActualPageContent />;
```

---

## 404 Not Found Page

**Location**: `src/pages/NotFoundPage.tsx`
**Route**: `*` (catch-all for undefined routes)
**URL**: Any URL that doesn't match a defined route

### What It Does

Shows when user navigates to a non-existent page:

```tsx
function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <FuzzyText
        baseIntensity={0.2}
        hoverIntensity={0.5}
        enableHover={true}
      >
        404
      </FuzzyText>

      <p className="text-2xl m-8">oops page not found</p>

      <Link to="/">
        Go to Home
      </Link>
    </div>
  );
}
```

### Key Features

1. **Large Animated 404**: Uses FuzzyText effect
2. **Error Message**: Simple explanation
3. **Home Link**: Button to return to home page

### Link Component

```tsx
import { Link } from "react-router-dom";

<Link to="/">Go to Home</Link>
```

**How Link works:**
- Changes URL without page reload
- Faster than `<a>` tag
- Maintains React state
- `to` prop specifies destination route

---

## Routing System

**Location**: `src/App.tsx`

The routing system controls which page shows for each URL.

### How Routing Works

```tsx
import { Routes, Route } from "react-router-dom";
import Map from "./pages/Map";
import Home from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/map" element={<Map />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
```

### Route Components Explained

```tsx
<Route path="/" element={<Home />} />
```

- `path` - The URL pattern
- `element` - Component to show for this path
- `/` - Root path (homepage)
- `/map` - Map page
- `*` - Wildcard (catches all unmatched routes)

### Navigation Between Pages

#### Method 1: Link Component

```tsx
import { Link } from "react-router-dom";

<Link to="/map">Go to Map</Link>
```

#### Method 2: useNavigate Hook

```tsx
import { useNavigate } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();

  const goToMap = () => {
    navigate("/map");
  };

  return <button onClick={goToMap}>Go to Map</button>;
}
```

#### Method 3: Programmatic with Conditions

```tsx
const navigate = useNavigate();

if (userLoggedIn) {
  navigate("/dashboard");
} else {
  navigate("/login");
}
```

### Router Setup

In `src/main.tsx`, the entire app is wrapped in `BrowserRouter`:

```tsx
import { BrowserRouter } from 'react-router-dom';

<BrowserRouter>
  <App />
</BrowserRouter>
```

This enables routing throughout the app.

---

## Creating New Pages

### Step 1: Create the Page File

Create a new file in `src/pages/`:

```tsx
// src/pages/AboutPage.tsx
import '../styles/App.scss';

function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-lg">Welcome to our gym tracking app!</p>
    </div>
  );
}

export default AboutPage;
```

### Step 2: Add Route to App.tsx

```tsx
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/map" element={<Map />} />
      <Route path="/about" element={<AboutPage />} />  {/* New route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
```

### Step 3: Add Navigation Link

Update the Dock component or add a link:

```tsx
<Link to="/about">About</Link>
```

### Step 4: Test the Page

1. Save all files
2. Navigate to `http://localhost:5173/about`
3. Check that your page displays correctly

---

## Page Patterns

### Pattern 1: Page with Loading State

```tsx
import { useState, useEffect } from 'react';
import Loading from './Loading';

function MyPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) return <Loading />;

  return <div>Page content</div>;
}
```

### Pattern 2: Page with Data Fetching

```tsx
import { useState, useEffect } from 'react';

function DataPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data when page loads
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Pattern 3: Page with Modal

```tsx
import { useState } from 'react';

function PageWithModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        Open Modal
      </button>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          Modal content
        </Modal>
      )}
    </div>
  );
}
```

### Pattern 4: Protected Page

```tsx
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function ProtectedPage() {
  const navigate = useNavigate();
  const isLoggedIn = false; // Check user auth status

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return <div>Protected content</div>;
}
```

---

## Common Layout Classes

### Full Height Page

```tsx
className="min-h-screen"
```
Makes page at least as tall as the viewport.

### Centered Content

```tsx
className="flex items-center justify-center min-h-screen"
```
Centers content vertically and horizontally.

### Page with Padding

```tsx
className="min-h-screen p-8"
```
Full height with padding on all sides.

### Theme-Aware Colors

```tsx
className="bg-bg-primary text-text-primary"
```
Uses CSS variables that adapt to light/dark mode.

---

## Page Lifecycle

Understanding when code runs in a page:

```tsx
function MyPage() {
  console.log('1. Component renders');

  const [count, setCount] = useState(0);
  console.log('2. State initialized (only once)');

  useEffect(() => {
    console.log('3. Effect runs after render');

    return () => {
      console.log('4. Cleanup when component unmounts');
    };
  }, []);

  console.log('5. Before return JSX');

  return <div>My Page</div>;
}
```

**Order of execution:**
1. Component function runs
2. State initializes
3. JSX is returned and rendered
4. useEffect runs after DOM updates
5. Cleanup runs when leaving page

---

## Styling Pages

### Using Tailwind Classes

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Styled content
</div>
```

Common classes:
- `p-4` - Padding (4 units)
- `m-4` - Margin
- `bg-blue-500` - Background color
- `text-white` - Text color
- `rounded-lg` - Rounded corners
- `flex` - Flexbox layout
- `grid` - Grid layout

### Using Custom Styles

Import and use SCSS files:

```tsx
import '../styles/App.scss';

<div className="shadow-l">Content</div>
```

### Inline Styles

```tsx
<div style={{ backgroundColor: 'red', padding: '20px' }}>
  Inline styled content
</div>
```

**Note:** Use camelCase for CSS properties in inline styles (`backgroundColor` not `background-color`).

---

## Tips for Page Development

### 1. Start Simple

Begin with basic structure, then add features:

```tsx
// Start here
function MyPage() {
  return <div>My Page</div>;
}

// Then add styling
function MyPage() {
  return <div className="min-h-screen p-8">My Page</div>;
}

// Then add components
function MyPage() {
  return (
    <div className="min-h-screen p-8">
      <h1>My Page</h1>
      <MyComponent />
    </div>
  );
}
```

### 2. Test Frequently

After each change:
1. Save the file
2. Check the browser
3. Look for errors in console
4. Test interactions

### 3. Use React DevTools

Install React DevTools to:
- Inspect component hierarchy
- View props and state
- Track re-renders

### 4. Break Down Complex Pages

If a page gets too big, extract components:

```tsx
// Before (everything in one page)
function BigPage() {
  return (
    <div>
      {/* 200 lines of code */}
    </div>
  );
}

// After (split into components)
function BigPage() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}
```

### 5. Handle Loading and Error States

Always account for:
- Loading state (data fetching)
- Error state (something went wrong)
- Empty state (no data to show)
- Success state (normal view)

```tsx
if (loading) return <Loading />;
if (error) return <div>Error: {error.message}</div>;
if (!data) return <div>No data available</div>;
return <div>Show data</div>;
```

---

## Common Issues

### Issue: Page Not Showing

**Check:**
1. Route added to App.tsx?
2. Path matches URL?
3. Component exported correctly?
4. Import statement correct?

### Issue: Styles Not Applied

**Check:**
1. Tailwind classes spelled correctly?
2. Custom CSS imported?
3. Class names have `className`, not `class`?
4. Check browser DevTools for applied styles

### Issue: State Not Updating

**Check:**
1. Using `setState` function, not direct assignment?
2. State updates are asynchronous
3. Check React DevTools to see current state

### Issue: useEffect Running Too Often

**Check:**
1. Dependency array present?
2. Dependencies listed correctly?
3. Objects/arrays in dependencies (they create new references)

---

## Next Steps

1. Explore existing pages to understand their structure
2. Try modifying text and styles on a page
3. Add a new page following the steps above
4. Implement a feature on an existing page
5. Learn about state management and data fetching

## Resources

- [React Router Documentation](https://reactrouter.com/)
- [React Hooks](https://react.dev/reference/react)
- [Page Layout Patterns](https://www.patterns.dev/posts/layout-patterns)
