// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import type { ComponentType } from 'react';
import { EnrollmentAddEventPageDefault } from './EnrollmentAddEventPageDefault/EnrollmentAddEventPageDefault.container';
import { useLocationQuery } from '../../../utils/routing';
import {
    useValidatedIDsFromCache,
} from '../../../utils/cachedDataHooks/useValidatedIDsFromCache';
import { useCommonEnrollmentDomainData } from '../common/EnrollmentOverviewDomain';
import { EnrollmentAddEventPageStatuses } from './EnrollmentAddEventPage.constants';
import { LoadingMaskForPage } from '../../LoadingMasks';

export const EnrollmentAddEventPage: ComponentType<{||}> = () => {
    const { teiId, programId, orgUnitId, enrollmentId } = useLocationQuery();
    const { valid: validIds, error: validatedIdsError } = useValidatedIDsFromCache({ programId, orgUnitId });
    const {
        enrollment,
        attributeValues,
        error: commonDataError,
    } = useCommonEnrollmentDomainData(teiId, enrollmentId, programId);
    const pageIsInvalid = (validIds && !validIds?.every(({ valid }) => valid)) || commonDataError || validatedIdsError;
    const pageStatus = useMemo(() => {
        if (!programId || !enrollmentId || !teiId) return EnrollmentAddEventPageStatuses.MISSING_REQUIRED_VALUES;
        if (pageIsInvalid && validIds[0]?.valid && !validIds[1]?.valid) return EnrollmentAddEventPageStatuses.ORG_UNIT_INVALID;
        if (pageIsInvalid && !validIds[0]?.valid) return EnrollmentAddEventPageStatuses.PROGRAM_INVALID;
        if (pageIsInvalid) return EnrollmentAddEventPageStatuses.PAGE_INVALID;
        if (!validIds?.length) return EnrollmentAddEventPageStatuses.LOADING;
        return EnrollmentAddEventPageStatuses.DEFAULT;
    }, [enrollmentId, pageIsInvalid, programId, teiId, validIds]);

    switch (pageStatus) {
    case EnrollmentAddEventPageStatuses.LOADING:
        return <LoadingMaskForPage />;
    case EnrollmentAddEventPageStatuses.MISSING_REQUIRED_VALUES:
        return (
            <p style={{ color: 'red' }}>
                {i18n.t('Page is missing required values from URL')}
            </p>
        );
    case EnrollmentAddEventPageStatuses.PROGRAM_INVALID:
        return (
            <p style={{ color: 'red' }}>
                {i18n.t('Program is not valid')}
            </p>
        );
    case EnrollmentAddEventPageStatuses.ORG_UNIT_INVALID:
        return (
            <p style={{ color: 'red' }}>
                {i18n.t('Org unit is not valid with current program')}
            </p>
        );
    case EnrollmentAddEventPageStatuses.PAGE_INVALID:
        return (
            <p style={{ color: 'red' }}>
                {i18n.t('There was an error opening the Page')}
            </p>
        );
    case EnrollmentAddEventPageStatuses.DEFAULT:
        return (
            <EnrollmentAddEventPageDefault
                enrollment={enrollment}
                attributeValues={attributeValues}
                commonDataError={Boolean(commonDataError)}
            />
        );
    default:
        return (
            <p style={{ color: 'red' }}>
                {i18n.t('There was an error opening the Page')}
            </p>
        );
    }
};
