// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { widgetEnrollmentActionTypes } from '../../components/WidgetEnrollment/WidgetEnrollment.actions';

const initialReducerValue = {
    enrollments: [],
};
const {
    ENROLLMENT_SUCCESS_FETCH,
} = widgetEnrollmentActionTypes;

export const widgetEnrollmentDesc = createReducerDescription({
    [ENROLLMENT_SUCCESS_FETCH]: (state, { payload:
        {
            enrollments,
        },
    }) => ({
        ...state,
        enrollments,
    }),
}, 'widgetEnrollment', initialReducerValue);
