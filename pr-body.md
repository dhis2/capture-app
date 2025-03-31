# TypeScript Refactoring for App, AppLoader, and AppStart Folders

This PR refactors the JavaScript/Flow files in the App, AppLoader, and AppStart folders to TypeScript.

## Changes

- Converted all JS files in App, AppLoader, and AppStart folders to TypeScript
- Created a global.types.ts file with TypeScript definitions for Redux, events, and UI components
- Added proper type annotations to components and functions
- Deleted the original JS files after creating TypeScript versions

## Testing

- Verified that TypeScript type checking passes for the refactored code
- Ensured that the application functionality remains the same

Link to Devin run: https://app.devin.ai/sessions/926371ef0fab46e784c6a31ab0561013
Requested by: Eirik Haugstulen
