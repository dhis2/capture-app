# WidgetEnrollment TypeScript Migration Plan

This document outlines the plan for converting the remaining JavaScript/Flow files in the WidgetEnrollment folder to TypeScript.

## Completed Conversions
- ✅ `WidgetEnrollment.component.js` → `WidgetEnrollment.component.tsx`
- ✅ `WidgetEnrollment.container.js` → `WidgetEnrollment.container.tsx`
- ✅ `enrollment.types.js` → `enrollment.types.ts`
- ✅ `index.js` → `index.ts`

## Remaining Files to Convert

### 1. Hooks
- [ ] `hooks/useEnrollment.js` → `hooks/useEnrollment.ts`
- [ ] `hooks/useTrackedEntityInstances.js` → `hooks/useTrackedEntityInstances.ts`
- [ ] `hooks/useGeometry.js` → `hooks/useGeometry.ts`
- [ ] `hooks/useProgram.js` → `hooks/useProgram.ts`
- [ ] `hooks/useUpdateEnrollment.js` → `hooks/useUpdateEnrollment.ts`

### 2. Status Component
- [ ] `Status/Status.component.js` → `Status/Status.component.tsx`
- [ ] `Status/status.types.js` → `Status/status.types.ts`
- [ ] `Status/index.js` → `Status/index.ts`

### 3. Date Component
- [ ] `Date/Date.component.js` → `Date/Date.component.tsx`
- [ ] `Date/index.js` → `Date/index.ts`

### 4. Actions Components
- [ ] `Actions/Actions.component.js` → `Actions/Actions.component.tsx`
- [ ] `Actions/Actions.container.js` → `Actions/Actions.container.tsx`
- [ ] `Actions/actions.types.js` → `Actions/actions.types.ts`
- [ ] `Actions/index.js` → `Actions/index.ts`

#### 4.1 Actions Subcomponents
- [ ] `Actions/Cancel/*` (3 files)
- [ ] `Actions/Delete/*` (3 files)
- [ ] `Actions/Followup/*` (3 files)
- [ ] `Actions/AddNew/*` (3 files)
- [ ] `Actions/Transfer/*` (4 files)
- [ ] `Actions/AddLocation/*` (3 files)
- [ ] `Actions/Complete/*` (7 files)

### 5. MiniMap Components
- [ ] `MiniMap/MiniMap.component.js` → `MiniMap/MiniMap.component.tsx`
- [ ] `MiniMap/MiniMap.types.js` → `MiniMap/MiniMap.types.ts`
- [ ] `MiniMap/converters.js` → `MiniMap/converters.ts`
- [ ] `MiniMap/index.js` → `MiniMap/index.ts`

### 6. MapModal Components
- [ ] `MapModal/MapModal.component.js` → `MapModal/MapModal.component.tsx`
- [ ] `MapModal/MapModal.container.js` → `MapModal/MapModal.container.tsx`
- [ ] `MapModal/MapModal.types.js` → `MapModal/MapModal.types.ts`
- [ ] `MapModal/index.js` → `MapModal/index.ts`

#### 6.1 MapModal Subcomponents
- [ ] `MapModal/Polygon/*` (6 files)
- [ ] `MapModal/Coordinates/*` (4 files)
- [ ] `MapModal/hooks/*` (2 files)

### 7. TransferModal Components
- [ ] `TransferModal/TransferModal.component.js` → `TransferModal/TransferModal.component.tsx`
- [ ] `TransferModal/TransferModal.types.js` → `TransferModal/TransferModal.types.ts`
- [ ] `TransferModal/index.js` → `TransferModal/index.ts`

#### 7.1 TransferModal Subcomponents
- [ ] `TransferModal/InfoBoxes/*` (2 files)
- [ ] `TransferModal/OrgUnitField/*` (4 files)
- [ ] `TransferModal/hooks/*` (2 files)

### 8. Constants and Utilities
- [ ] `constants/status.const.js` → `constants/status.const.ts`
- [ ] `dataMutation/dataMutation.js` → `dataMutation/dataMutation.ts`
- [ ] `processErrorReports.js` → `processErrorReports.ts`

## Conversion Approach

For each file:

1. **Type Definitions**:
   - Convert Flow types to TypeScript interfaces
   - Use `type` instead of `interface` for type definitions
   - For optional properties, use the question mark notation (e.g., `property?: string`)

2. **Component Files**:
   - Convert to `.tsx` extension for React components
   - Add proper type annotations for props, state, and functions
   - For Material-UI components, use `withStyles` with proper typing
   - Import types with the `type` keyword: `import { type WithStyles } from '@material-ui/core'`

3. **Hook Files**:
   - Convert to `.ts` extension
   - Add proper return type annotations
   - Rely on TypeScript's type inference for hook return values

4. **Utility and Constant Files**:
   - Convert to `.ts` extension
   - Add minimal type annotations without restructuring the code

5. **Testing**:
   - After each conversion, run `yarn tsc:check` to verify TypeScript compilation
   - Run `yarn linter:check` to verify linting rules

## Implementation Order

To minimize disruption and ensure a smooth transition, the conversion should follow this order:

1. Type definition files (*.types.js)
2. Constants and utilities
3. Hooks
4. Base components
5. Container components
6. Index files

This approach ensures that dependencies are converted before the components that use them.
