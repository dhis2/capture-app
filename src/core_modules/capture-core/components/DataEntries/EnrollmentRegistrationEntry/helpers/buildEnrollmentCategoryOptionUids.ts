import { enrollmentAttributeOptionsKey } from '../../../DataEntryDhis2Helpers';


export const buildEnrollmentCategoryOptionUids = (
    mainSectionServerValues: Record<string, unknown>,
): Array<string> =>
    Object.entries(mainSectionServerValues).flatMap(([key, value]) => (
        key.startsWith(enrollmentAttributeOptionsKey) && typeof value === 'string' && value ? [value] : []
    ));
