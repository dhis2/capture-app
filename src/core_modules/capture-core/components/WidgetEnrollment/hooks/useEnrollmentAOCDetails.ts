import { useMemo } from 'react';
import { FEATURES, useFeature } from 'capture-core-utils/featuresSupport';
import { useCategoryOptionsFromIndexedDB } from '../../../utils/cachedDataHooks/useCategoryOptionsFromIndexedDB';
import type { EnrollmentCategoryOptionCombo, EnrollmentCategoryCombo } from '../enrollment.types';

type Props = {
    attributeOptionCombo?: string;
    enrollmentCategoryCombo?: EnrollmentCategoryCombo;
};

export const useEnrollmentAOCDetails = ({ attributeOptionCombo, enrollmentCategoryCombo }: Props) => {
    const enrollmentAOCSupported = useFeature(FEATURES.enrollmentAOC);

    const matchingCategoryOptionCombo = useMemo(() => {
        if (!enrollmentAOCSupported || !attributeOptionCombo || !enrollmentCategoryCombo) return undefined;
        return enrollmentCategoryCombo.categoryOptionCombos
            ?.find(coc => coc.id === attributeOptionCombo);
    }, [enrollmentAOCSupported, attributeOptionCombo, enrollmentCategoryCombo]);

    const categoryOptionIds = useMemo(() => (matchingCategoryOptionCombo
        ? new Set(matchingCategoryOptionCombo.categoryOptions.map(({ id }) => id))
        : null),
    [matchingCategoryOptionCombo]);

    const { categoryOptions, isLoading, isError } = useCategoryOptionsFromIndexedDB(
        [attributeOptionCombo ?? ''],
        categoryOptionIds,
    );

    const enrollmentAOCDetails = useMemo<EnrollmentCategoryOptionCombo | undefined>(() => {
        if (!matchingCategoryOptionCombo || !categoryOptions) return undefined;
        return {
            id: matchingCategoryOptionCombo.id,
            displayName: '',
            categoryOptions: categoryOptions.map(option => ({
                id: option.id,
                displayName: option.displayName,
                access: option.access,
                categories: option.categories.map(categoryId => ({ id: categoryId })),
            })),
        };
    }, [matchingCategoryOptionCombo, categoryOptions]);

    return { error: isError, loading: isLoading, enrollmentAOCDetails };
};
