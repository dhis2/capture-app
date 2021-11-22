// @flow
import React from 'react';
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

    let pageStatus = EnrollmentAddEventPageStatuses.DEFAULT;
    const pageIsInvalid = (validIds && !validIds?.every(({ valid }) => valid)) || commonDataError || validatedIdsError;
    (!programId || !enrollmentId || !teiId) && (pageStatus = EnrollmentAddEventPageStatuses.MISSING_REQUIRED_VALUES);
    pageIsInvalid && (pageStatus = EnrollmentAddEventPageStatuses.PAGE_INVALID);
    !validIds && (pageStatus = EnrollmentAddEventPageStatuses.LOADING);

    switch (pageStatus) {
    case EnrollmentAddEventPageStatuses.LOADING:
        return <LoadingMaskForPage />;
    case EnrollmentAddEventPageStatuses.MISSING_REQUIRED_VALUES:
        return (
            <p
                style={{ color: 'red' }}
            >
                {i18n.t('Page is missing required values from URL')}
            </p>
        );
    case EnrollmentAddEventPageStatuses.PAGE_INVALID:
        return (
            <p
                style={{ color: 'red' }}
            >
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
        return null;
    }
};
