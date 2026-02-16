# Components Documentation

This document explains all reusable components in the Gyat project. Components are like building blocks that you can use throughout your application.

## Table of Contents

1. [What are Components?](#what-are-components)
2. [Navigation Components](#navigation-components)
3. [UI Components](#ui-components)
4. [Effect Components](#effect-components)
5. [Background Components](#background-components)
6. [How to Use Components](#how-to-use-components)

---

## What are Components?

Think of components as LEGO blocks. Each component is a reusable piece of UI that you can use multiple times in your app. For example, a button component can be used on many different pages.

### Basic Component Example:

```tsx
// A simple component
function Greeting() {
  return <h1>Hello, World!</h1>;
}

// Using the component
<Greeting />  // Renders: <h1>Hello, World!</h1>
```

### Component with Props (Parameters):

```tsx
// Component that accepts data
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

// Using with different data
<Greeting name="Alice" />  // Hello, Alice!
<Greeting name="Bob" />    // Hello, Bob!
```

---

## Navigation Components

### Dock Component

**Location**: `src/components/Dock.tsx`

A macOS-style dock navigation bar that appears at the top of the screen.

#### What It Does:
- Shows navigation icons (Home, Map, Settings)
- Icons magnify when you hover over them
- Highlights the current page
- Stays fixed at the top center of the screen

#### Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `distance` | `number` | `200` | Mouse distance for magnification effect |
| `panelHeight` | `number` | `64` | Height of the dock panel in pixels |
| `baseItemSize` | `number` | `50` | Normal size of icons in pixels |
| `dockHeight` | `number` | - | Height of the dock |
| `magnification` | `number` | `70` | Maximum icon size when hovered |
| `spring` | `SpringOptions` | See code | Animation spring settings |

#### Usage Example:

```tsx
import Dock from './components/Dock';

function App() {
  return (
    <div>
      <Dock
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
      />
      {/* Your page content */}
    </div>
  );
}
```

#### How It Works:
1. The dock contains items (Home, Map, Settings)
2. Each item has an icon and label
3. When you hover, icons grow (magnification effect)
4. Clicking an icon navigates to that page
5. Current page icon is highlighted

---

## UI Components

### Tile Component

**Location**: `src/components/Tile.tsx`

Represents a piece of gym equipment on the interactive map.

#### What It Does:
- Displays equipment as a colored rectangle
- Shows equipment name and icon
- Can be dragged and resized in edit mode
- Can be rotated 90 degrees at a time
- Opens a modal with details when clicked

#### Props:

See `TileData` in [TYPES.md](./TYPES.md#tile-types) for full details.

Key props:
- `equipment` - What equipment to display
- `x`, `y` - Position on the map
- `width`, `height` - Size of the tile
- `rotation` - Rotation in degrees (0, 90, 180, 270)
- `colour` - Background color name
- `editMode` - Whether user can edit the tile
- `onClick` - Function called when clicked

#### Usage Example:

```tsx
import Tile from './components/Tile';
import { TbTreadmill } from 'react-icons/tb';

<Tile
  id={1}
  equipment={{
    title: "Treadmill",
    icon: TbTreadmill
  }}
  x={20}
  y={160}
  width={240}
  height={100}
  rotation={0}
  colour="red"
  editMode={false}
  onClick={() => console.log("Clicked!")}
/>
```

### MachineModal Component

**Location**: `src/components/MachineModal.tsx`

A popup modal showing detailed information about gym equipment.

#### What It Does:
- Shows equipment name, icon, and description
- Displays muscles targeted
- Shows instructional video (placeholder)
- Has a close button
- Darkens the background when open

#### Props:

| Prop | Type | Description |
|------|------|-------------|
| `tile` | `TileData` | The equipment tile to show details for |
| `onClose` | `() => void` | Function to call when closing modal |

#### Usage Example:

```tsx
import MachineModal from './components/MachineModal';
import { useState } from 'react';

function Map() {
  const [selectedTile, setSelectedTile] = useState(null);

  return (
    <div>
      {/* Click a tile to open modal */}
      <Tile onClick={() => setSelectedTile(someTile)} {...TileData} />

      {/* Show modal if a tile is selected */}
      {selectedTile && (
        <MachineModal
          tile={selectedTile}
          onClose={() => setSelectedTile(null)}
        />
      )}
    </div>
  );
}
```

### ToggleSwitch Component

**Location**: `src/components/ToggleSwitch.tsx`

A toggle switch for on/off options (like edit mode).

#### What It Does:
- Displays a sliding toggle switch
- Changes color when toggled
- Calls a function when switched

#### Props:

| Prop | Type | Description |
|------|------|-------------|
| `onClick` | `(checked: boolean) => void` | Function called when toggled, receives true/false |

#### Usage Example:

```tsx
import ToggleSwitch from './components/ToggleSwitch';
import { useState } from 'react';

function MyComponent() {
  const [editMode, setEditMode] = useState(false);

  return (
    <div>
      <ToggleSwitch onClick={(checked) => setEditMode(checked)} />
      {editMode ? <p>Edit mode ON</p> : <p>Edit mode OFF</p>}
    </div>
  );
}
```

### ThemeToggle Component

**Location**: `src/components/ThemeToggle.tsx`

A button to switch between light and dark themes.

#### What It Does:
- Shows sun icon in dark mode, moon icon in light mode
- Toggles between light and dark theme
- Fixed to top-right corner
- Saves preference to localStorage

#### Props:

None - it uses the `ThemeContext` automatically.

#### Usage Example:

```tsx
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  return (
    <div>
      <ThemeToggle />
      {/* Theme automatically applies to entire app */}
    </div>
  );
}
```

### InteractiveMap Component

**Location**: `src/components/InteractiveMap.tsx`

The main interactive gym equipment map.

#### What It Does:
- Displays all gym equipment as tiles
- Has edit mode toggle
- Allows dragging/resizing tiles in edit mode
- Scales to fit screen size
- Has a grid background
- Opens equipment details on click

#### Props:

None - it manages its own state.

#### Usage Example:

```tsx
import InteractiveMap from './components/InteractiveMap';

function MapPage() {
  return (
    <div className="p-8">
      <h1>Gym Map</h1>
      <InteractiveMap />
    </div>
  );
}
```

---

## Effect Components

These components add visual effects to enhance the user experience.

### ClickSpark

**Location**: `src/components/effects/ClickSpark.tsx`

Creates animated sparks when you click anywhere on the page.

#### What It Does:
- Wraps your entire app
- Shows animated lines radiating from click point
- Sparks fade out over time

#### Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sparkColor` | `string` | `"#fff"` | Color of the sparks |
| `sparkSize` | `number` | `10` | Length of each spark line |
| `sparkRadius` | `number` | `15` | How far sparks travel |
| `sparkCount` | `number` | `8` | Number of sparks per click |
| `duration` | `number` | `400` | Animation duration in ms |
| `children` | `React.ReactNode` | - | Your app content |

#### Usage Example:

```tsx
import ClickSpark from './components/effects/ClickSpark';

<ClickSpark
  sparkColor="#fff"
  sparkSize={10}
  sparkRadius={15}
  sparkCount={8}
>
  <YourApp />
</ClickSpark>
```

### ElectricBorder

**Location**: `src/components/effects/ElectricBorder.tsx`

Creates an animated, wavy border around content.

#### What It Does:
- Adds animated electric/wavy border effect
- Border appears to flow and distort
- Can be customized with color, speed, and intensity

#### Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `"#5227FF"` | Border color (hex code) |
| `speed` | `number` | `1` | Animation speed multiplier |
| `chaos` | `number` | `1` | How chaotic/wavy the border is |
| `thickness` | `number` | `2` | Border width in pixels |
| `className` | `string` | `""` | Additional CSS classes |
| `style` | `CSSProperties` | - | Additional styles (border radius) |
| `children` | `React.ReactNode` | - | Content inside the border |

#### Usage Example:

```tsx
import ElectricBorder from './components/effects/ElectricBorder';

<ElectricBorder
  color="#7df9ff"
  speed={1}
  chaos={0.5}
  thickness={2}
  style={{ borderRadius: 16 }}
>
  <div className="p-10">
    <h1>Welcome!</h1>
  </div>
</ElectricBorder>
```

### FuzzyText

**Location**: `src/components/effects/FuzzyText.tsx`

Text with a fuzzy/glitchy effect that intensifies on hover.

#### What It Does:
- Makes text appear slightly fuzzy/glitched
- Becomes more intense when you hover over it
- Great for titles and headings

#### Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The text to display |
| `fontSize` | `number \| string` | `"clamp(2rem, 8vw, 8rem)"` | Size of text |
| `fontWeight` | `string \| number` | `900` | Boldness of text |
| `fontFamily` | `string` | `"inherit"` | Font family |
| `color` | `string` | `"#fff"` | Text color |
| `enableHover` | `boolean` | `true` | Increase fuzz on hover? |
| `baseIntensity` | `number` | `0.18` | Base fuzz amount |
| `hoverIntensity` | `number` | `0.5` | Fuzz amount on hover |

#### Usage Example:

```tsx
import FuzzyText from './components/effects/FuzzyText';

<FuzzyText
  baseIntensity={0.2}
  hoverIntensity={0.5}
  enableHover={true}
>
  404
</FuzzyText>
```

### ShinyText

**Location**: `src/components/effects/ShinyText.tsx`

Text with an animated shine/shimmer effect passing over it.

#### What It Does:
- Adds a moving shine effect across text
- Looks like light reflecting off the text
- Can be enabled/disabled

#### Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | - | The text to display |
| `disabled` | `boolean` | `false` | Turn off animation? |
| `speed` | `number` | `5` | Animation speed in seconds |
| `className` | `string` | `""` | Additional CSS classes |

#### Usage Example:

```tsx
import ShinyText from './components/effects/ShinyText';

<ShinyText
  text="Loading..."
  disabled={false}
  speed={2}
  className="text-4xl font-light"
/>
```

### SplashCursor

**Location**: `src/components/effects/SplashCursor.tsx`

Creates a fluid/paint splash effect that follows your cursor.

#### What It Does:
- Adds colorful fluid simulation
- Follows mouse movement
- Creates splashes on click
- Performance-intensive (use carefully)

#### Props:

Many configuration props - see component file for full list. Most have sensible defaults.

Key props:
- `TRANSPARENT` - Make background transparent
- `SPLAT_FORCE` - How strong splashes are
- `COLOR_UPDATE_SPEED` - How fast colors change

#### Usage Example:

```tsx
import SplashCursor from './components/effects/SplashCursor';

{enableSplash && <SplashCursor />}
```

### SplitText

**Location**: `src/components/effects/SplitText.tsx`

Animates text by splitting it into characters/words and animating each piece.

#### What It Does:
- Splits text into individual characters or words
- Animates each piece separately
- Triggered by scrolling into view
- Great for hero text and headings

#### Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | - | Text to animate |
| `className` | `string` | `""` | Additional CSS classes |
| `delay` | `number` | `100` | Delay between each letter (ms) |
| `duration` | `number` | `0.6` | Animation duration per letter |
| `ease` | `string` | `"power3.out"` | Animation easing |
| `splitType` | `string` | `"chars"` | Split by "chars", "words", or "lines" |
| `from` | `object` | `{ opacity: 0, y: 40 }` | Starting state |
| `to` | `object` | `{ opacity: 1, y: 0 }` | Ending state |
| `tag` | `string` | `"p"` | HTML tag to use |

#### Usage Example:

```tsx
import SplitText from './components/effects/SplitText';

<SplitText
  text="Welcome to the Gym!"
  className="text-4xl font-bold"
  delay={70}
  duration={0.6}
  ease="elastic.out(1, 0.3)"
  splitType="chars"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
/>
```

---

## Background Components

These components create animated backgrounds for pages.

### Silk

**Location**: `src/backgrounds/Silk.tsx`

Creates a silk-like fabric texture background.

#### Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `speed` | `number` | `5` | Animation speed |
| `scale` | `number` | `1` | Pattern scale |
| `color` | `string` | `"#7B7481"` | Silk color (hex) |
| `noiseIntensity` | `number` | `1.5` | Texture intensity |
| `rotation` | `number` | `0` | Pattern rotation |

#### Usage Example:

```tsx
import Silk from './backgrounds/Silk';

<Silk
  speed={5}
  scale={1}
  color="#7B7481"
  noiseIntensity={1.5}
  rotation={0}
/>
```

### FloatingLines

**Location**: `src/backgrounds/FloatingLines.tsx`

Creates animated floating wave lines.

#### Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `linesGradient` | `string[]` | - | Array of hex colors for gradient |
| `enabledWaves` | `Array` | `['top', 'middle', 'bottom']` | Which wave layers to show |
| `lineCount` | `number \| number[]` | `[6]` | Number of lines per wave |
| `lineDistance` | `number \| number[]` | `[5]` | Spacing between lines |
| `animationSpeed` | `number` | `1` | Animation speed |
| `interactive` | `boolean` | `true` | React to mouse? |
| `bendRadius` | `number` | `5.0` | Mouse interaction radius |
| `parallax` | `boolean` | `true` | Move with scroll? |

#### Usage Example:

```tsx
import FloatingLines from './backgrounds/FloatingLines';

<FloatingLines
  enabledWaves={['top', 'middle', 'bottom']}
  lineCount={[5, 7, 5]}
  lineDistance={[8, 6, 4]}
  interactive={true}
  parallax={true}
/>
```

### ColorBends

**Location**: `src/backgrounds/ColorBends.tsx`

Creates colorful, flowing, organic patterns.

#### Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colors` | `string[]` | `[]` | Array of hex colors |
| `rotation` | `number` | `45` | Pattern rotation |
| `speed` | `number` | `0.2` | Animation speed |
| `scale` | `number` | `1` | Pattern scale |
| `frequency` | `number` | `1` | Pattern frequency |
| `warpStrength` | `number` | `1` | Distortion amount |
| `mouseInfluence` | `number` | `1` | Mouse interaction strength |
| `transparent` | `boolean` | `true` | Transparent background? |

#### Usage Example:

```tsx
import ColorBends from './backgrounds/ColorBends';

<ColorBends
  colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
  speed={0.2}
  warpStrength={1}
  transparent={true}
/>
```

### Iridescence

**Location**: `src/backgrounds/Iridescence.tsx`

Creates an iridescent, color-shifting effect.

#### Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `[number, number, number]` | `[0.5, 0.5, 0.5]` | RGB color (0-1 range) |
| `speed` | `number` | `1.0` | Animation speed |
| `amplitude` | `number` | `0.1` | Effect intensity |
| `mouseReact` | `boolean` | `false` | React to mouse? |

#### Usage Example:

```tsx
import Iridescence from './backgrounds/Iridescence';

<Iridescence
  color={[0.5, 0.5, 0.5]}
  mouseReact={false}
  amplitude={0.1}
  speed={1.0}
/>
```

---

## How to Use Components

### Step 1: Import the Component

```tsx
import ComponentName from './path/to/Component';
```

### Step 2: Use It in Your JSX

```tsx
function MyPage() {
  return (
    <div>
      <ComponentName prop1="value1" prop2={123} />
    </div>
  );
}
```

### Step 3: Pass Props

Props are like function parameters:

```tsx
// String props use quotes
<Component name="Alice" />

// Number, boolean, and expressions use curly braces
<Component age={25} active={true} count={10 + 5} />

// Functions use curly braces
<Component onClick={() => console.log("Clicked!")} />

// Objects use double curly braces (outer for JSX, inner for object)
<Component style={{ color: "red", fontSize: 16 }} />
```

### Step 4: Nested Components

Components can contain other components:

```tsx
<OuterComponent>
  <InnerComponent />
  <AnotherComponent />
</OuterComponent>
```

---

## Component Patterns

### Pattern 1: Container Component

Wraps your content:

```tsx
<ElectricBorder color="#7df9ff">
  <div className="p-10">
    Your content here
  </div>
</ElectricBorder>
```

### Pattern 2: Self-Contained Component

Works independently:

```tsx
<InteractiveMap />
```

### Pattern 3: Component with State

Uses `useState` to remember values:

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Pattern 4: Conditional Rendering

Show component only if condition is true:

```tsx
{showModal && <MachineModal tile={selectedTile} onClose={closeModal} />}
```

This is like writing:
```tsx
if (showModal) {
  return <MachineModal ... />;
}
```

---

## Tips for Beginners

### 1. Start with Existing Components

Don't create new components yet. Learn by using existing ones:
- Copy examples from this documentation
- Modify props to see what changes
- Read the component's code to understand it

### 2. Use VS Code Autocomplete

Type `<ComponentName` and press `Ctrl+Space` to see available props.

### 3. Check Props in Files

Look at the component file to see what props it accepts:

```tsx
interface MyComponentProps {
  name: string;    // Required prop
  age?: number;    // Optional prop (note the ?)
}
```

### 4. Use React DevTools

Install React DevTools browser extension to:
- See component hierarchy
- Inspect props and state
- Debug rendering issues

### 5. One Component Per File

Keep components in separate files:
```
components/
  Button.tsx
  Card.tsx
  Modal.tsx
```

### 6. Name Components with PascalCase

```tsx
// Good
function MyComponent() { }
function UserProfile() { }

// Bad
function mycomponent() { }
function user_profile() { }
```

---

## Common Issues

### Issue: Component Not Showing

**Check:**
1. Did you import it? `import Component from './Component'`
2. Did you use `<Component />` (with angle brackets)?
3. Is it wrapped in a parent element?
4. Check browser console for errors

### Issue: Props Not Working

**Check:**
1. Spelling - props are case-sensitive
2. Type - string vs number vs boolean
3. Curly braces for non-string props
4. Check if prop is optional (has `?`)

### Issue: Styling Not Applied

**Check:**
1. Is `className` spelled correctly? (not `class`)
2. Are Tailwind classes correct?
3. Did you import the CSS file?
4. Check browser DevTools to see applied styles

---

## Next Steps

1. Try modifying props of existing components
2. Create a simple component of your own
3. Combine multiple components to build a page
4. Read component source code to understand how they work
5. Experiment with effect components on a test page

## Resources

- [React Documentation](https://react.dev/learn)
- [TypeScript + React Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Component Patterns](https://www.patterns.dev/posts/react-component-patterns)
