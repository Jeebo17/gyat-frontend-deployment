# Backend Integration Guide

This document outlines the changes required in the **backend** so that its API responses align with the existing **frontend types** (`TileData`, `EquipmentProps`).

---

## Frontend Types (source of truth)

### `TileData` ([src/types/tile.ts](../src/types/tile.ts))

| Field | Type | Required |
|-------|------|----------|
| `id` | `number` | ✅ |
| `equipment` | `EquipmentProps` | ✅ |
| `x` | `number` | ✅ |
| `y` | `number` | ✅ |
| `width` | `number` | ✅ |
| `height` | `number` | ✅ |
| `rotation` | `number` | ✅ |
| `colour` | `string` | ✅ |

### `EquipmentProps` ([src/types/equipment.ts](../src/types/equipment.ts))

| Field | Type | Required |
|-------|------|----------|
| `title` | `string` | ✅ |
| `icon` | `React.ComponentType` | ❌ (frontend-only, not from API) |
| `description` | `string` | ❌ |
| `videoUrl` | `string` | ❌ |
| `musclesTargeted` | `string[]` | ❌ |
| `benefits` | `string[]` | ❌ |

---

## Mismatches & Required Backend Changes

### 1. Rename `xCoord`/`yCoord` → `x`/`y`

**Current backend:** `GymComponentDTO`, `CreateComponentRequest`, and `UpdateComponentRequest` use `xCoord` and `yCoord`.

**Frontend expects:** `x` and `y`.

**Fix — add `@JsonProperty` annotations** (no Java field rename needed):

```java
// GymComponentDTO.java, CreateComponentRequest.java, UpdateComponentRequest.java
@JsonProperty("x")
private Double xCoord;

@JsonProperty("y")
private Double yCoord;
```

**Files to update:**
- `dto/response/GymComponentDTO.java`
- `dto/request/CreateComponentRequest.java`
- `dto/request/UpdateComponentRequest.java`

---

### 2. Add `colour` field

**Current backend:** No colour field anywhere.

**Frontend expects:** `colour: string` on every tile.

**Fix — add the field end-to-end:**

```java
// GymComponent.java (entity)
@Column(nullable = false)
private String colour;

// GymComponentDTO.java (response)
private String colour;

// CreateComponentRequest.java
private String colour;

// UpdateComponentRequest.java
private String colour;
```

**Service layer** (`GymLayoutService.java`):
- `createComponent()` — add `component.setColour(request.getColour());`
- `updateComponent()` — add `component.setColour(request.getColour());`
- `mapToComponentDTO()` — add `.colour(component.getColour())` to the builder

---

### 3. Nest equipment fields into an `equipment` object

**Current backend:** Equipment data is flattened directly into `GymComponentDTO` (`name`, `brand`, `imageUrl`, `description`, `safetyInfo`).

**Frontend expects:** A nested `equipment` object.

**Fix — create a new response DTO and restructure:**

```java
// NEW FILE: dto/response/EquipmentDTO.java
@Getter @Setter @Builder
public class EquipmentDTO {
    private String title;              // mapped from EquipmentType.name
    private String description;
    private String videoUrl;
    private List<String> musclesTargeted;
    private List<String> benefits;
}
```

Then in `GymComponentDTO.java`, **replace** the flat fields:

```java
// REMOVE these:
private Long equipmentTypeId;
private String name;
private String brand;
private String imageUrl;
private String description;
private String safetyInfo;

// REPLACE with:
private EquipmentDTO equipment;
```

> `equipmentTypeId` can be kept alongside `equipment` if the frontend needs it for API calls. It just won't be consumed by `TileData` directly.

Update `GymLayoutService.mapToComponentDTO()` to build the nested object:

```java
EquipmentDTO equipmentDTO = EquipmentDTO.builder()
        .title(effectiveName)
        .description(effectiveDesc)
        // .videoUrl(...)        — see #5
        // .musclesTargeted(...) — see #6
        // .benefits(...)        — see #7
        .build();

return GymComponentDTO.builder()
        .id(component.getId())
        .layoutId(component.getLayout().getId())
        .floorId(component.getFloor().getId())
        .x(component.getXCoord())      // renamed
        .y(component.getYCoord())      // renamed
        .width(component.getWidth())
        .height(component.getHeight())
        .rotation(component.getRotation())
        .colour(component.getColour()) // new
        .equipmentTypeId(base.getId())
        .equipment(equipmentDTO)       // nested
        .additionalInfo(component.getAdditionalInfo())
        .build();
```

---

### 4. Rename equipment `name` → `title`

**Current backend:** `EquipmentType.name` and `GymComponentDTO.name`.

**Frontend expects:** `title`.

**Fix:** This is handled automatically by change #3 — when building `EquipmentDTO`, map `effectiveName` → `title`.

---

### 5. Add `videoUrl` to equipment

**Current backend:** `videoUrl` exists only on the `Exercise` entity, not on `EquipmentType`.

**Frontend expects:** `videoUrl` on the equipment object.

**Option A — Add column to `EquipmentType` (recommended, simplest):**

```java
// EquipmentType.java
@Column
private String videoUrl;
```

Then set it in `EquipmentDTO.builder().videoUrl(base.getVideoUrl())`.

**Option B — Query from Exercise:**

In `mapToComponentDTO()`, look up the first Exercise for the equipment type and grab `videoUrl`. This is more complex and adds a DB query per component. Not recommended unless you want to maintain the Exercise-as-source-of-truth model.

---

### 6. Add `musclesTargeted` to equipment

**Current backend:** Muscles are linked to `Exercise` via a many-to-many join (`exercise_muscle` table), not directly to `EquipmentType`.

**Frontend expects:** `musclesTargeted: string[]` on the equipment object.

**Option A — Direct relationship on `EquipmentType` (recommended):**

```java
// EquipmentType.java
@ManyToMany
@JoinTable(
    name = "equipment_type_muscle",
    joinColumns = @JoinColumn(name = "equipment_type_id"),
    inverseJoinColumns = @JoinColumn(name = "muscle_id")
)
private Set<Muscle> targetedMuscles = new HashSet<>();
```

Then in the service:

```java
List<String> muscles = base.getTargetedMuscles().stream()
        .map(Muscle::getName)
        .toList();
// → EquipmentDTO.builder().musclesTargeted(muscles)
```

**Option B — Aggregate from exercises:**

Query all exercises for the equipment type, collect their muscles, deduplicate. More complex, higher query cost.

---

### 7. Add `benefits` field

**Current backend:** No `benefits` data exists anywhere.

**Frontend expects:** `benefits: string[]` on the equipment object.

**Option A — JSON column (simplest):**

```java
// EquipmentType.java
@Column(columnDefinition = "JSON")
private String benefits;  // stored as: ["benefit1", "benefit2"]
```

Parse in service with Jackson:

```java
ObjectMapper mapper = new ObjectMapper();
List<String> benefitsList = mapper.readValue(
    base.getBenefits(), new TypeReference<List<String>>() {}
);
```

**Option B — Separate join table:**

```java
// EquipmentType.java
@ElementCollection
@CollectionTable(name = "equipment_benefit", joinColumns = @JoinColumn(name = "equipment_type_id"))
@Column(name = "benefit")
private List<String> benefits = new ArrayList<>();
```

---

### 8. Backend fields with no frontend counterpart

These fields exist in the backend but **not** in the frontend types. They do **not** need to be removed — the frontend simply ignores them — but be aware:

| Backend Field | Notes |
|---------------|-------|
| `brand` | Not in `EquipmentProps`. Consider adding to frontend later, or omit from response. |
| `imageUrl` | Not in `EquipmentProps`. Same as above. |
| `safetyInfo` | Not in `EquipmentProps`. Same as above. |
| `additionalInfo` | Not in `TileData`. Same as above. |
| `layoutId` | Metadata for API calls. Keep in response. |
| `floorId` | Metadata for API calls. Keep in response. |
| `equipmentTypeId` | Needed for create/update requests. Keep in response. |
| `managerId` | On `GymLayoutDTO`. Frontend doesn't use it directly. |

---

## Checklist

| # | Change | Difficulty | Files Affected |
|---|--------|------------|----------------|
| 1 | `xCoord`/`yCoord` → `x`/`y` (JSON alias) | Easy | 3 DTOs |
| 2 | Add `colour` field | Easy | Entity + 3 DTOs + Service |
| 3 | Nest equipment into `EquipmentDTO` | Medium | New DTO + `GymComponentDTO` + Service |
| 4 | `name` → `title` | Easy | Handled by #3 |
| 5 | Add `videoUrl` to `EquipmentType` | Easy | Entity + Service |
| 6 | Add `musclesTargeted` to `EquipmentType` | Medium | Entity + new join table + Service |
| 7 | Add `benefits` to `EquipmentType` | Medium | Entity + new column/table + Service |

### Suggested implementation order

1. **#1** (rename coords) — zero-risk, pure JSON alias
2. **#2** (add colour) — new column, straightforward
3. **#3 + #4** (nest equipment + rename) — restructure DTO
4. **#5** (videoUrl) — new column on EquipmentType
5. **#6** (musclesTargeted) — new join table
6. **#7** (benefits) — new column or table

Changes #1–#4 are purely structural and don't require new data in the database.
Changes #5–#7 require new DB columns/tables **and** data to be populated.
