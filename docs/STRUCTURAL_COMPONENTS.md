# Structural Components

Structural components are non-equipment map elements with `equipmentTypeId < 50`. They are **not interactable** (no equipment modal opens on click) and have fixed visual properties.

## Threshold

Any tile with `equipmentTypeId < 50` is treated as a structural component.

---

## Component Registry

| ID | Name | Default Width | Default Height | Fixed Width | Colour | Resizable | Notes |
|----|------|---------------|----------------|-------------|--------|-----------|-------|
| 1 | Wall | 200 | 10 | 10 (thickness) | 6B7280 (grey) | Length only | Rendered as a line with endpoint handles. Can be horizontal or vertical. |
| 2 | Staircase | 120 | 120 | — | 8B5CF6 (purple) | Both axes | Represents a staircase or stairwell. |
| 3 | Door | 60 | 10 | 10 (thickness) | F59E0B (amber) | Length only | Doorway opening, similar to wall but shorter. |
| 4 | Pillar | 40 | 40 | Both | 9CA3AF (light grey) | No | Fixed-size structural column. |
| 5 | Window | 100 | 10 | 10 (thickness) | 38BDF8 (sky blue) | Length only | Window section along a wall. |

---

## Behaviour

- **No equipment modal**: Clicking a structural component in view mode does nothing. In edit mode, only drag/resize/delete are available.
- **Fixed colour**: The colour is determined by the component type and cannot be changed by the user.
- **Constrained dimensions**: Some components (e.g. Wall) have a fixed thickness — only the length can be adjusted.
- **Drag-and-drop**: When dragged from the sidebar, structural components use their type-specific default dimensions, not the generic equipment default.

## Wall Component (ID 1)

The wall is rendered as a thin line (`WallTile`) with circular drag handles on each end. Users can:

- **Drag** the wall to reposition it.
- **Resize** by dragging an endpoint handle, extending or shortening the wall.
- **Swap orientation**: The rotate button swaps width ↔ height, toggling between horizontal and vertical.
- Walls have a fixed thickness of 10px; only the length dimension is user-adjustable.
