import { enrollmentAttributeOptionsKey } from '../../../DataEntryDhis2Helpers';

// Backend accepts only a resolved attributeOptionCombo UID on enrollment
// import (intentional; see memory project_enrollment_aoc_client_resolves_coc).
// Return the picked category option UIDs so the caller can resolve them to a
// COC UID before submitting.
export const buildEnrollmentCategoryOptionUids = (
    serverValuesForMainValues: Record<string, unknown>,
): Array<string> =>
    Object.keys(serverValuesForMainValues)
        .filter(key => key.startsWith(`${enrollmentAttributeOptionsKey}-`))
        .map(key => serverValuesForMainValues[key])
        .filter((value): value is string => typeof value === 'string' && value.length > 0);
