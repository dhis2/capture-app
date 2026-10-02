import { useMemo, useEffect } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { useDataQuery } from '@dhis2/app-runtime';
import { FEATURES, useFeature } from 'capture-core-utils/featuresSupport';
import type { EnrollmentCategoryOptionCombo } from '../enrollment.types';

const query = {
    attributeOptionCombo: {
        resource: 'categoryOptionCombos',
        id: ({ variables }: any) => variables.attributeOptionCombo,
        params: {
            fields: 'id,displayName,categoryOptions[id,displayName,categories[id,displayName]]',
        },
    },
};

export const useEnrollmentAOCDetails = (attributeOptionCombo?: string) => {
    const enrollmentAOCSupported = useFeature(FEATURES.enrollmentAOC);
    const effectiveAttributeOptionCombo = enrollmentAOCSupported ? attributeOptionCombo : undefined;

    const { error, loading, data, refetch } = useDataQuery(query, { lazy: true });

    useEffect(() => {
        if (effectiveAttributeOptionCombo) {
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

    const enrollmentAOCDetails = useMemo(() => {
        if (!effectiveAttributeOptionCombo) return undefined;
        const value = (data as any)?.attributeOptionCombo as EnrollmentCategoryOptionCombo | undefined;
        return value?.id === effectiveAttributeOptionCombo ? value : undefined;
    }, [effectiveAttributeOptionCombo, data]);

    return { error, loading, enrollmentAOCDetails };
};
