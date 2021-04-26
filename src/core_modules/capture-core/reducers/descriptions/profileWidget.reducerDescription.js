// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { profileWidgetActionTypes } from '../../components/ProfileWidget/ProfileWidget.actions';

const initialReducerValue = {
    attributes: [],
};
const {
    INFORMATION_SUCCESS_FETCH,
} = profileWidgetActionTypes;

export const profileWidgetDesc = createReducerDescription({
    [INFORMATION_SUCCESS_FETCH]: (state, { payload:
        {
            attributes,
        },
    }) => ({
        ...state,
        attributes,
    }),
}, 'profileWidget', initialReducerValue);
