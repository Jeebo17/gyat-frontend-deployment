# TypeScript Types Documentation

This document explains all the TypeScript types and interfaces used in the Gyat project. If you're new to TypeScript, think of types as a way to describe what kind of data something should have.

## Table of Contents

1. [What are Types?](#what-are-types)
2. [Equipment Types](#equipment-types)
3. [Tile Types](#tile-types)
4. [Theme Types](#theme-types)
5. [Common Patterns](#common-patterns)

---

## What are Types?

TypeScript types help ensure you're using the right kind of data. They catch errors before you run your code.

### Example:

```typescript
// Without types (JavaScript)
function greet(name) {
  return "Hello " + name;
}
greet(123); // This works but might not be what you want

// With types (TypeScript)
function greet(name: string) {
  return "Hello " + name;
}
greet(123); // ERROR: TypeScript won't let you do this!
```

### Basic Types You'll See:

- `string` - Text: `"hello"`, `"gym"`
- `number` - Numbers: `42`, `3.14`, `-10`
- `boolean` - True or false: `true`, `false`
- `string[]` - Array of strings: `["red", "blue", "green"]`
- `number[]` - Array of numbers: `[1, 2, 3]`

---

## Equipment Types

**Location**: `src/types/equipment.ts`

This defines what information we store about each piece of gym equipment.

```typescript
export interface EquipmentProps {
    title: string;
    icon?: React.ComponentType<{ className?: string }>;
    description?: string;
    videoUrl?: string;
    musclesTargeted?: string[];
    benefits?: string[];
}
```

### Field Breakdown:

| Field | Type | Required? | Description | Example |
|-------|------|-----------|-------------|---------|
| `title` | `string` | ✅ Yes | Name of the equipment | `"Treadmill"` |
| `icon` | `React.ComponentType` | ❌ No (optional) | Icon component to display | `TbTreadmill` |
| `description` | `string` | ❌ No | Text description | `"Cardio machine for running"` |
| `videoUrl` | `string` | ❌ No | URL to instruction video | `"https://youtube.com/..."` |
| `musclesTargeted` | `string[]` | ❌ No | List of muscles | `["Legs", "Glutes", "Core"]` |
| `benefits` | `string[]` | ❌ No | List of benefits | `["Cardio health", "Weight loss"]` |

### The `?` Symbol Means "Optional"

When you see `?` after a field name, it means that field is optional. You don't have to provide it when creating an equipment object.

### Example Usage:

```typescript
// Minimal equipment (only required fields)
const treadmill: EquipmentProps = {
    title: "Treadmill"
};

// Full equipment (all fields)
const detailedTreadmill: EquipmentProps = {
    title: "Treadmill",
    icon: TbTreadmill,
    description: "Running machine for cardio",
    videoUrl: "https://youtube.com/watch?v=example",
    musclesTargeted: ["Legs", "Glutes", "Cardio"],
    benefits: ["Burns calories", "Improves endurance"]
};
```

---

## Tile Types

**Location**: `src/types/tile.ts`

This defines the properties of each tile (rectangle) on the interactive gym map.

```typescript
export interface TileData {
    id: number;
    equipment: EquipmentProps;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    colour: string;

    onUpdate?: (updates: Partial<TileData>) => void;
    canHover?: boolean;
    onClick?: () => void;
    editMode?: boolean;
    scale?: number;
    gridSize?: number;
    snap?: (value: number) => number;
}
```

### Field Breakdown:

#### Required Fields (Must Always Provide):

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | `number` | Unique identifier | `1`, `2`, `3` |
| `equipment` | `EquipmentProps` | The equipment this tile represents | `{ title: "Treadmill" }` |
| `x` | `number` | Horizontal position in pixels | `100` |
| `y` | `number` | Vertical position in pixels | `200` |
| `width` | `number` | Width in pixels | `240` |
| `height` | `number` | Height in pixels | `100` |
| `rotation` | `number` | Rotation in degrees | `0`, `90`, `180`, `270` |
| `colour` | `string` | Background color | `"red"`, `"blue"`, `"green"` |

#### Optional Fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `onUpdate` | Function | Called when tile is modified | `(updates) => { ... }` |
| `canHover` | `boolean` | Can user hover over tile? | `true` or `false` |
| `onClick` | Function | Called when tile is clicked | `() => { showModal() }` |
| `editMode` | `boolean` | Is tile in edit mode? | `true` or `false` |
| `scale` | `number` | Zoom level | `1.0` (normal), `0.5` (half) |
| `gridSize` | `number` | Grid snap size in pixels | `20` |
| `snap` | Function | Function to snap to grid | `(v) => Math.round(v/20)*20` |

### Special Types Explained:

#### `Partial<TileData>`

This means "some properties of TileData, not necessarily all". It's used when updating only some fields:

```typescript
// Instead of needing all fields:
const fullUpdate: TileData = {
    id: 1,
    equipment: {...},
    x: 100,
    y: 200,
    // ... all other fields
};

// You can update just what changed:
const partialUpdate: Partial<TileData> = {
    x: 150,  // Only update x position
    y: 250   // Only update y position
};
```

#### Function Types

```typescript
// onUpdate expects a function that:
// - Takes one parameter: an object with some TileData
// - Returns nothing (void)
onUpdate?: (updates: Partial<TileData>) => void;

// onClick expects a function that:
// - Takes no parameters
// - Returns nothing
onClick?: () => void;

// snap expects a function that:
// - Takes a number
// - Returns a number
snap?: (value: number) => number;
```

### Example Usage:

```typescript
const myTile: TileData = {
    id: 1,
    equipment: {
        title: "Treadmill",
        icon: TbTreadmill
    },
    x: 20,
    y: 160,
    width: 240,
    height: 100,
    rotation: 0,
    colour: "red",
    canHover: true,
    onClick: () => {
        console.log("Tile clicked!");
    }
};
```

---

## Theme Types

**Location**: `src/constants/colors.ts`

This defines the color scheme for light and dark modes.

```typescript
export type Theme = 'light' | 'dark';
export type ColorCategory = keyof typeof colors.light;
```

### `Theme` Type

This is a **union type** - it means the value can only be one of the listed options:

```typescript
const validTheme: Theme = 'light';  // ✅ OK
const alsoValid: Theme = 'dark';    // ✅ OK
const invalid: Theme = 'blue';      // ❌ ERROR: must be 'light' or 'dark'
```

### Color Structure

The `colors` object contains all color definitions:

```typescript
const colors = {
  light: {
    background: {
      primary: '#ffffff',
      secondary: '#f5f5f5',
      tertiary: '#ebebeb',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
      tertiary: '#999999',
    },
    // ... more categories
  },
  dark: {
    background: {
      primary: '#1a1a1a',
      secondary: '#2d2d2d',
      tertiary: '#3d3d3d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      tertiary: '#808080',
    },
    // ... more categories
  }
};
```

### Using Colors in Components

Colors are accessed through CSS variables in `src/index.css`:

```css
/* Light mode */
:root {
  --color-bg-primary: #ebebeb;
  --color-text-primary: #1a1a1a;
}

/* Dark mode */
:root.dark {
  --color-bg-primary: #121212;
  --color-text-primary: #ffffff;
}
```

In your components, use Tailwind classes:

```tsx
<div className="bg-bg-primary text-text-primary">
  This will automatically adapt to light/dark mode!
</div>
```

---

## Common Patterns

### Pattern 1: Optional Props with Defaults

Many components use optional props with default values:

```typescript
interface MyComponentProps {
    title: string;           // Required
    color?: string;          // Optional
    size?: number;           // Optional
}

function MyComponent({
    title,
    color = "blue",    // Default value
    size = 16          // Default value
}: MyComponentProps) {
    // If color not provided, it will be "blue"
    // If size not provided, it will be 16
    return <div>{title}</div>;
}

// Usage:
<MyComponent title="Hello" />  // Uses defaults for color and size
<MyComponent title="Hello" color="red" />  // Custom color, default size
```

### Pattern 2: Callback Functions

Components often accept functions as props:

```typescript
interface ButtonProps {
    onClick: () => void;     // Function that returns nothing
    label: string;
}

function Button({ onClick, label }: ButtonProps) {
    return <button onClick={onClick}>{label}</button>;
}

// Usage:
<Button
    label="Click Me"
    onClick={() => {
        console.log("Button clicked!");
    }}
/>
```

### Pattern 3: Union Types

Restricting values to specific options:

```typescript
type Size = 'small' | 'medium' | 'large';
type Color = 'red' | 'blue' | 'green' | 'yellow';

interface BoxProps {
    size: Size;
    color: Color;
}

const box: BoxProps = {
    size: 'medium',    // ✅ OK
    color: 'blue'      // ✅ OK
};

const invalidBox: BoxProps = {
    size: 'huge',      // ❌ ERROR: not in Size union
    color: 'purple'    // ❌ ERROR: not in Color union
};
```

### Pattern 4: React Component Types

For components that can receive React elements:

```typescript
interface ContainerProps {
    children: React.ReactNode;  // Can be any React content
}

function Container({ children }: ContainerProps) {
    return <div className="container">{children}</div>;
}

// Usage:
<Container>
    <p>This is children</p>
    <button>Click me</button>
</Container>
```

### Pattern 5: Array Types

Different ways to define arrays:

```typescript
// Method 1: Using []
const numbers: number[] = [1, 2, 3];
const names: string[] = ["Alice", "Bob"];

// Method 2: Using Array<>
const numbers2: Array<number> = [1, 2, 3];
const names2: Array<string> = ["Alice", "Bob"];

// Array of objects
const equipment: EquipmentProps[] = [
    { title: "Treadmill" },
    { title: "Weights" }
];
```

---

## TypeScript Tips for Beginners

### 1. Let TypeScript Help You

Hover over variables in VS Code to see their types:

```typescript
const equipment = { title: "Treadmill" };
// Hover over 'equipment' to see:
// const equipment: { title: string; }
```

### 2. Use Type Inference

TypeScript can often figure out types automatically:

```typescript
// You don't need to write:
const name: string = "Alice";

// TypeScript knows it's a string:
const name = "Alice";
```

### 3. Read Error Messages Carefully

TypeScript errors tell you exactly what's wrong:

```
Type 'number' is not assignable to type 'string'.
```

This means you're trying to use a number where a string is expected.

### 4. Use the `any` Type Sparingly

`any` turns off type checking. Avoid it when possible:

```typescript
// Bad (defeats purpose of TypeScript):
const data: any = getSomeData();

// Good (specific type):
const data: EquipmentProps = getSomeData();
```

### 5. Start Simple

If types feel overwhelming:
1. Start by using existing types
2. Copy and modify examples
3. Let TypeScript infer types when possible
4. Add more complex types as you learn

---

## Quick Reference

### Common Type Keywords

- `interface` - Define object structure
- `type` - Create type alias or union
- `?` - Make field optional
- `readonly` - Field cannot be changed
- `|` - Union type (or)
- `&` - Intersection type (and)
- `[]` - Array
- `void` - Function returns nothing
- `never` - Function never returns
- `unknown` - Safe version of `any`

### Example Interface

```typescript
interface Example {
    required: string;           // Must provide
    optional?: number;          // May omit
    readonly fixed: boolean;    // Cannot change after creation
    callback: () => void;       // Function
    union: 'a' | 'b' | 'c';    // One of these values
    array: string[];            // Array of strings
}
```

---

## Need More Help?

- Check TypeScript errors in VS Code (they have helpful messages)
- Look at existing code for examples
- Use VS Code's autocomplete (Ctrl+Space)
- Ask your team lead for clarification
- Read [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
