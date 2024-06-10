// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { enrollmentSiteActionTypes } from '../../components/Pages/common/EnrollmentOverviewDomain';

export const widgetEnrollmentDesc = createReducerDescription(
    {
        [enrollmentSiteActionTypes.SET_EXTERNAL_ENROLLMENT_STATUS]: (state, action) => ({
            status: { value: action.payload.status },
        }),
    },
    'widgetEnrollment',
    {
        status: { value: null },
    },
);
