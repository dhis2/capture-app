// @flow

import { actionCreator } from '../actions.utils';

export const actionTypes = Object.freeze({
    NAVIGATE_TO_ENROLLMENT_OVERVIEW: 'enrollmentNavigation.navigateToEnrollmentOverview',
});

type NavigateToEnrollmentOverviewProps = {|
    teiId?: string,
    programId?: string,
    orgUnitId?: string,
    enrollmentId?: string,
|}

export const navigateToEnrollmentOverview = ({ teiId, programId, orgUnitId, enrollmentId }: NavigateToEnrollmentOverviewProps) =>
    actionCreator(actionTypes.NAVIGATE_TO_ENROLLMENT_OVERVIEW)({ teiId, programId, orgUnitId, enrollmentId });
