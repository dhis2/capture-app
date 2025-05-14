# Refactor WidgetEnrollment folder from Flow to TypeScript

This PR converts the WidgetEnrollment folder from Flow to TypeScript as part of the ongoing TypeScript migration effort.

## Changes
- Converted `WidgetEnrollment.component.js` to TypeScript
- Converted `WidgetEnrollment.container.js` to TypeScript
- Converted `enrollment.types.js` to TypeScript
- Updated `index.js` to TypeScript
- Removed original .js files after successful conversion

## Testing
- Verified TypeScript compilation with `yarn tsc:check`
- Maintained original code structure and functionality

## Link to Devin run
https://app.devin.ai/sessions/23da64ba502c4885882850927663cd3d

Requested by: henrik.vadet@dhis2.org
