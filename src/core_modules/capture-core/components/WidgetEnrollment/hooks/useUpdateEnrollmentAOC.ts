import { useCallback, useMemo } from 'react';
import { useDataEngine, useDataMutation, useTimeZoneConversion } from '@dhis2/app-runtime';
import type { Mutation, QueryRefetchFunction } from 'capture-core-utils/types/app-runtime';
import { makeQuerySingleResource } from '../../../utils/api';
import { makeResolveAttributeOptionCombo } from '../../../utils/AOC';
import { processErrorReports } from '../processErrorReports';

const enrollmentUpdate: Mutation = {
    resource: 'tracker?async=false&importStrategy=UPDATE',
    type: 'create',
    data: (enrollment: any) => ({
        enrollments: [enrollment],
    }),
};

type UseUpdateEnrollmentAOCProps = {
    enrollment: any;
    refetchEnrollment: QueryRefetchFunction;
    onError?: (error: any) => void;
    onSuccess?: () => void;
};

export const useUpdateEnrollmentAOC = ({
    enrollment,
    refetchEnrollment,
    onError,
    onSuccess,
}: UseUpdateEnrollmentAOCProps) => {
    const dataEngine = useDataEngine();
    const { fromClientDate } = useTimeZoneConversion();

    const resolveAttributeOptionCombo = useMemo(
        () => makeResolveAttributeOptionCombo(makeQuerySingleResource(dataEngine.query.bind(dataEngine))),
        [dataEngine],
    );

    const [updateEnrollmentMutation, { loading: saving }] = useDataMutation(enrollmentUpdate, {
        onComplete: () => {
            refetchEnrollment();
            onSuccess?.();
        },
        onError: (e) => {
            onError?.(processErrorReports(e));
        },
    });

    const update = useCallback(async (categoryOptionUids: ReadonlyArray<string>): Promise<boolean> => {
        if (!enrollment || saving) return false;
        const attributeOptionCombo = await resolveAttributeOptionCombo(categoryOptionUids);
        if (!attributeOptionCombo) {
            onError?.('Could not resolve the selected category options to an attribute option combo.');
            return false;
        }
        try {
            await updateEnrollmentMutation({
                ...enrollment,
                attributeOptionCombo,
                updatedAt: fromClientDate(new Date()).getServerZonedISOString(),
            });
            return true;
        } catch {
            return false;
        }
    }, [enrollment, saving, resolveAttributeOptionCombo, updateEnrollmentMutation, onError, fromClientDate]);

    return { update, saving };
};
