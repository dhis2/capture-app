import { useMemo, useEffect, useRef } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
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

    const lastFetchedRef = useRef<string | undefined>();
    useEffect(() => {
        if (!effectiveAttributeOptionCombo) {
            lastFetchedRef.current = undefined;
            return;
        }
        if (effectiveAttributeOptionCombo !== lastFetchedRef.current) {
            lastFetchedRef.current = effectiveAttributeOptionCombo;
            refetch({ variables: { attributeOptionCombo: effectiveAttributeOptionCombo } });
        }
    }, [refetch, effectiveAttributeOptionCombo]);

    useEffect(() => {
        if (error) {
            log.error(
                errorCreator('Could not load attribute option combo details')({
                    error,
                    attributeOptionCombo: effectiveAttributeOptionCombo,
                }),
            );
        }
    }, [error, effectiveAttributeOptionCombo]);

    const attributeOptionComboDetails = useMemo(() => {
        if (!effectiveAttributeOptionCombo) return undefined;
        const value = (data as any)?.attributeOptionCombo as AttributeOptionComboDetails | undefined;
        return value?.id === effectiveAttributeOptionCombo ? value : undefined;
    }, [effectiveAttributeOptionCombo, data]);

    return { error, loading, attributeOptionComboDetails };
};
