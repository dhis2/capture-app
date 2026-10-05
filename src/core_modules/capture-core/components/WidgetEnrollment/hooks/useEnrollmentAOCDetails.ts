import { useMemo } from 'react';
import { FEATURES, useFeature } from 'capture-core-utils/featuresSupport';
import { useApiMetadataQuery } from '../../../utils/reactQueryHelpers';
import { useCategoryOptionsFromIndexedDB } from '../../../utils/cachedDataHooks/useCategoryOptionsFromIndexedDB';
import type { EnrollmentCategoryOptionCombo, EnrollmentCategoryCombo } from '../enrollment.types';

type Props = {
    attributeOptionCombo?: string;
    enrollmentCategoryCombo?: EnrollmentCategoryCombo;
};

const directFetchQuery = (attributeOptionCombo: string) => ({
    resource: 'categoryOptionCombos',
    id: attributeOptionCombo,
    params: {
        fields: 'id,displayName,categoryOptions[id,displayName,access[data[write]],categories[id,displayName]]',
    },
});

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
        () => (categoryIds ? Array.from(categoryIds) : []),
        [categoryIds],
    );

    const { categoryOptions, isLoading, isError } = useCategoryOptionsFromIndexedDB(queryKey, categoryIds);

    const needsDirectFetch = enrollmentAOCSupported
        && !!attributeOptionCombo
        && !!enrollmentCategoryCombo
        && !matchingCategoryOptionCombo;

    const { data: directFetchResult } = useApiMetadataQuery<EnrollmentCategoryOptionCombo | undefined>(
        ['enrollmentAttributeOptionCombo', attributeOptionCombo ?? ''],
        needsDirectFetch && attributeOptionCombo ? directFetchQuery(attributeOptionCombo) : undefined,
        { enabled: needsDirectFetch },
    );

    const enrollmentAOCDetails = useMemo<EnrollmentCategoryOptionCombo | undefined>(() => {
        if (matchingCategoryOptionCombo && categoryOptions) {
            const includedIds = new Set(matchingCategoryOptionCombo.categoryOptions.map(({ id }) => id));
            return {
                id: matchingCategoryOptionCombo.id,
                categoryOptions: categoryOptions
                    .filter(option => includedIds.has(option.id))
                    .map(option => ({
                        id: option.id,
                        displayName: option.displayName,
                        access: option.access,
                        categories: option.categories.map(id => ({ id })),
                    })),
            };
        }
        if (directFetchResult?.id === attributeOptionCombo) return directFetchResult;
        return undefined;
    }, [matchingCategoryOptionCombo, categoryOptions, directFetchResult, attributeOptionCombo]);

    return { error: isError, loading: isLoading, enrollmentAOCDetails };
};
