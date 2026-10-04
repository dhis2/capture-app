import { useMemo } from 'react';
import { FEATURES, useFeature } from 'capture-core-utils/featuresSupport';
import { useCategoryOptionsFromServer } from '../../../utils/cachedDataHooks/useCategoryOptionsFromServer';
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

    const categoryIds = useMemo(() => (enrollmentCategoryCombo
        ? new Set(enrollmentCategoryCombo.categories.map(({ id }) => id))
        : null),
    [enrollmentCategoryCombo]);

    const queryKey = useMemo(
        () => (categoryIds ? Array.from(categoryIds).sort() : []),
        [categoryIds],
    );

    const { categoryOptions, isLoading, isError } = useCategoryOptionsFromServer(queryKey, categoryIds);

    const enrollmentAOCDetails = useMemo<EnrollmentCategoryOptionCombo | undefined>(() => {
        if (!matchingCategoryOptionCombo || !categoryOptions) return undefined;
        const includedIds = new Set(matchingCategoryOptionCombo.categoryOptions.map(({ id }) => id));
        return {
            id: matchingCategoryOptionCombo.id,
            displayName: '',
            categoryOptions: categoryOptions
                .filter(option => includedIds.has(option.id))
                .map(option => ({
                    id: option.id,
                    displayName: option.displayName,
                    access: option.access,
                    categories: option.categories.map(categoryId => ({ id: categoryId })),
                })),
        };
    }, [matchingCategoryOptionCombo, categoryOptions]);

    return { error: isError, loading: isLoading, enrollmentAOCDetails };
};
