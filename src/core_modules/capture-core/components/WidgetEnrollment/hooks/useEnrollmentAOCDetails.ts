import { useMemo } from 'react';
import { FEATURES, useFeature } from 'capture-core-utils/featuresSupport';
import { useApiMetadataQuery } from '../../../utils/reactQueryHelpers';
import { useCategoryOptionsFromIndexedDB } from '../../../utils/cachedDataHooks/useCategoryOptionsFromIndexedDB';
import type { EnrollmentCategoryOptionCombo, EnrollmentCategoryCombo } from '../enrollment.types';

type Props = {
    attributeOptionCombo?: string;
    enrollmentCategoryCombo?: EnrollmentCategoryCombo;
};

const categoryOptionComboQuery = (attributeOptionCombo: string) => ({
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

    const { categoryIds, queryKey } = useMemo(() => {
        if (!enrollmentAOCSupported || !enrollmentCategoryCombo) return { categoryIds: null, queryKey: [] };
        const ids = enrollmentCategoryCombo.categories.map(({ id }) => id);
        return { categoryIds: new Set(ids), queryKey: ids };
    }, [enrollmentAOCSupported, enrollmentCategoryCombo]);

    const { categoryOptions, isLoading, isError } = useCategoryOptionsFromIndexedDB(queryKey, categoryIds);

    const isAocMissingFromCombo = enrollmentAOCSupported
        && !!attributeOptionCombo
        && !!enrollmentCategoryCombo
        && !matchingCategoryOptionCombo;

    const { data: fetchedCategoryOptionCombo } = useApiMetadataQuery<EnrollmentCategoryOptionCombo | undefined>(
        ['enrollmentAttributeOptionCombo', attributeOptionCombo ?? ''],
        isAocMissingFromCombo && attributeOptionCombo ? categoryOptionComboQuery(attributeOptionCombo) : undefined,
        { enabled: isAocMissingFromCombo },
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
        if (fetchedCategoryOptionCombo?.id === attributeOptionCombo) return fetchedCategoryOptionCombo;
        return undefined;
    }, [matchingCategoryOptionCombo, categoryOptions, fetchedCategoryOptionCombo, attributeOptionCombo]);

    return { error: isError, loading: isLoading, enrollmentAOCDetails };
};
