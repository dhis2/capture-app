# TypeScript Refactoring: WidgetEventSchedule Folder

This PR converts the WidgetEventSchedule folder from Flow/JavaScript to TypeScript as part of the ongoing TypeScript migration effort (DHIS2-19350).

## Changes

- Converted all JavaScript/Flow files in the WidgetEventSchedule folder to TypeScript
- Created proper TypeScript interfaces and types for all components
- Ensured TypeScript type checking passes with `yarn tsc:check`
- Removed original JS files after conversion

## Implementation Notes

- Used the OrgUnitFetcher and QuickActionButton folders as reference for TypeScript patterns
- Followed the guidelines in the ts-migration.md file
- Used `type` instead of `interface` for type definitions
- Maintained existing code structure while adding TypeScript types
- Fixed type issues in the useScheduleConfigFromProgramStage hook

## Testing

- Verified TypeScript type checking passes with `yarn tsc:check`

Link to Devin run: https://app.devin.ai/sessions/ee0b486e858042898f131de90a613978
Requested by: henrik.vadet@dhis2.org
