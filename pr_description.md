# Refactor PossibleDuplicatesDialog from Flow to TypeScript

This PR converts the PossibleDuplicatesDialog component and related files from Flow to TypeScript as part of the ongoing TypeScript migration.

## Changes
- Converted all files in the PossibleDuplicatesDialog folder to TypeScript
- Followed the guidelines in ts-migration.md
- Used QuickActionButton and OrgUnitFetcher as reference examples
- Ensured code passes TypeScript checking and linting

## Testing
- Verified with `yarn tsc:check`
- Verified with `yarn linter:check`

Link to Devin run: https://app.devin.ai/sessions/39b025262e554f00b8f9372e95c80bc9
Requested by: henrik.vadet@dhis2.org
