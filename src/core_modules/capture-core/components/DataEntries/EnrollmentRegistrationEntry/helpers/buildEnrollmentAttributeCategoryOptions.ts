import { enrollmentAttributeOptionsKey } from '../../../DataEntryDhis2Helpers';

// Isolated so the Path A / Path B swap (backend accepts option UIDs vs
// enrollment already resolved to AOC UID) is a one-line change.
export const buildEnrollmentAttributeCategoryOptions = (
    serverValuesForMainValues: Record<string, unknown>,
): string | undefined => {
    const optionValues = Object.keys(serverValuesForMainValues)
        .filter(key => key.startsWith(`${enrollmentAttributeOptionsKey}-`))
        .map(key => serverValuesForMainValues[key])
        .filter((value): value is string => typeof value === 'string' && value.length > 0);

    return optionValues.length > 0 ? optionValues.join(',') : undefined;
};
