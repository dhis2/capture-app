# TypeScript Migration Prompt

## Task: Convert [FileName.js] to TypeScript

1.  **Rename Component:** Rename the file `[FileName.js]` to `[FileName.tsx]`.
2.  **Convert Component Code:** Update the code within `[FileName.tsx]`:
    *   Remove Flow directives (`// @flow`) and related comments (`// $FlowFixMe`).
    *   Convert Flow types (`type`, `?Type`, `Array<Type>`) to TypeScript equivalents (e.g., `type`, `Type | undefined` or `Type | null`, `Type[]`). **Note:** Pay close attention to nullability; check if the consuming code/library expects `undefined` or `null`.
    *   Prefer using `type` aliases over `interface` for defining object shapes and types, unless extending interfaces.
    *   Add explicit types for component props (e.g., using `props: Props`), state (`useState<Type>`), refs (`useRef<Type>`), event handlers, and function parameters/return values.
    *   Handle refs passed through props, often requiring `React.forwardRef<ElementType, PropsType>(...)`.
    *   Update React-specific types (e.g., `React.Node` to `React.ReactNode`). Ensure event types match expected types (e.g., `React.MouseEvent<HTMLButtonElement>`).
    *   Import types from libraries where necessary (e.g., `Props` types or utility types like `WithStyles` from UI libraries when dealing with HOCs).
3.  **Update Index File (if applicable):**
    *   Rename the corresponding `index.js` (if one exists in the same directory) to `index.ts`.
    *   Update the export statement(s) in `index.ts` to point to the renamed component file.
4.  **Refine Imports/Exports:**
    *   Ensure all import/export paths **omit** file extensions (`.ts`, `.tsx`). TypeScript resolves these automatically (e.g., use `'./MyComponent'` instead of `'./MyComponent.tsx'`).
5.  **Address Errors:** Fix any resulting TypeScript errors, often related to nullability mismatches, specific event types, prop mismatches, or incorrect HOC/ref handling.
    *   *Optional:* If `React.forwardRef` was added, a `displayName` property might have been included. This can often be removed if not specifically needed for debugging. 