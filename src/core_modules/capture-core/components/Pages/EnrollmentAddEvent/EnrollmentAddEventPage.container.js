// @flow
import React from 'react';
import type { ComponentType } from 'react';
import { EnrollmentAddEventPageDefault } from './EnrollmentAddEventPageDefault/EnrollmentAddEventPageDefault.container';
import { useLocationQuery } from '../../../utils/routing';
import { useValidatedIDsFromCache } from '../../../utils/cachedDataHooks/useValidatedIDsFromCache';
import { useCommonEnrollmentDomainData } from '../common/EnrollmentOverviewDomain';

export const EnrollmentAddEventPage: ComponentType<{||}> = () => {
    const { teiId, programId, enrollmentId } = useLocationQuery();
    const { valid: validIds, loading, error } = useValidatedIDsFromCache({ programId });
    const {
        enrollment,
        attributeValues,
        error: commonDataError,
    } = useCommonEnrollmentDomainData(teiId, enrollmentId, programId);

    const ready = (programId && enrollmentId && teiId);
    const pageIsInvalid = !loading && !error && !validIds?.every(({ valid }) => valid);

    if (pageIsInvalid || !enrollment) {
        return 'Page is not valid';
    }

    return (
        ready && !loading && !pageIsInvalid ? <EnrollmentAddEventPageDefault
            enrollment={enrollment}
            attributeValues={attributeValues}
            commonDataError={commonDataError}
        /> : null
    );
};
