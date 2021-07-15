// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { enrollmentActionTypes } from '../../components/Pages/actions/enrollment.actions';

const initialReducerValue = {};
const { SET_ENROLLMENT } = enrollmentActionTypes;

export const enrollmentDesc = createReducerDescription(
    {
        [SET_ENROLLMENT]: (state, { payload: { enrollmentSite } }) => ({
            ...state,
            ...enrollmentSite,
        }),
    },
    'enrollmentSite',
    initialReducerValue,
);
