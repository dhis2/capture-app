// @flow

import { actionCreator } from '../actions.utils';
import type { NavigateToEnrollmentOverviewProps } from './navigateToEnrollmentOverview.types';

export const actionTypes = Object.freeze({
    NAVIGATE_TO_ENROLLMENT_OVERVIEW: 'enrollmentNavigation.navigateToEnrollmentOverview',
});

export const navigateToEnrollmentOverview = ({
    teiId,
    programId,
    orgUnitId,
    enrollmentId,
}: NavigateToEnrollmentOverviewProps) =>
    actionCreator(actionTypes.NAVIGATE_TO_ENROLLMENT_OVERVIEW)({ teiId, programId, orgUnitId, enrollmentId });
