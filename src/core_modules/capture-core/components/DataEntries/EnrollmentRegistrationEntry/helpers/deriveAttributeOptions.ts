import type { EnrollmentCategoryCombination } from '../../../../metaData';
import { attributeOptionsKey, enrollmentAttributeOptionsKey } from '../../../DataEntryDhis2Helpers';

export const deriveAttributeOptions = (
    serverValuesForMainValues: Record<string, any>,
    enrollmentCategoryCombination: EnrollmentCategoryCombination | null | undefined,
) => {
    const attributeCategoryOptions = Object.keys(serverValuesForMainValues)
        .filter(key => key.startsWith(attributeOptionsKey))
        .reduce((acc, key) => {
            const categoryId = key.split('-')[1];
            acc[categoryId] = serverValuesForMainValues[key];
            return acc;
        }, {});

    const enrollmentCategoryOptionUids = Object.keys(serverValuesForMainValues)
        .filter(key => key.startsWith(enrollmentAttributeOptionsKey))
        .map(key => serverValuesForMainValues[key])
        .filter((value): value is string => typeof value === 'string' && value !== '');

    const attributeOptionCombo = enrollmentCategoryCombination
        ?.resolveAttributeOptionCombo(enrollmentCategoryOptionUids);
    const aocResolveFailed = enrollmentCategoryOptionUids.length > 0 && !attributeOptionCombo;

    return { attributeCategoryOptions, attributeOptionCombo, aocResolveFailed, enrollmentCategoryOptionUids };
};
