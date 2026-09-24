import { useMemo, useEffect, useRef } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { FEATURES, useFeature } from 'capture-core-utils/featuresSupport';

export type AttributeOptionComboCategoryOption = {
    id: string;
    displayName: string;
    categories: Array<{ id: string; displayName: string }>;
};

export type AttributeOptionComboDetails = {
    id: string;
    displayName: string;
    categoryCombo: { id: string; isDefault: boolean };
    categoryOptions: Array<AttributeOptionComboCategoryOption>;
};

export const useAttributeOptionComboDetails = (attributeOptionCombo?: string) => {
    const enrollmentAOCSupported = useFeature(FEATURES.enrollmentAOC);
    const effectiveAttributeOptionCombo = enrollmentAOCSupported ? attributeOptionCombo : undefined;

    const { error, loading, data, refetch } = useDataQuery(
        useMemo(
            () => ({
                attributeOptionCombo: {
                    resource: 'categoryOptionCombos',
                    id: ({ variables }: any) => variables.attributeOptionCombo,
                    params: {
                        fields: 'id,displayName,categoryCombo[id,isDefault],' +
                            'categoryOptions[id,displayName,categories[id,displayName]]',
                    },
                },
            }),
            [],
        ),
        { lazy: true },
    );

    // The parent's enrollment refetches cheaply and often; skip when the AOC
    // UID hasn't actually changed to avoid a wasted metadata round-trip.
    const lastFetchedRef = useRef<string | undefined>();
    useEffect(() => {
        if (effectiveAttributeOptionCombo && effectiveAttributeOptionCombo !== lastFetchedRef.current) {
            lastFetchedRef.current = effectiveAttributeOptionCombo;
            refetch({ variables: { attributeOptionCombo: effectiveAttributeOptionCombo } });
        }
    }, [refetch, effectiveAttributeOptionCombo]);

    // Memoize so consumers using [attributeOptionComboDetails] deps aren't
    // invalidated on unrelated parent re-renders that leave data unchanged.
    const attributeOptionComboDetails = useMemo(
        () => (effectiveAttributeOptionCombo
            ? ((data as any)?.attributeOptionCombo as AttributeOptionComboDetails | undefined)
            : undefined),
        [effectiveAttributeOptionCombo, data],
    );

    return { error, loading, attributeOptionComboDetails };
};
