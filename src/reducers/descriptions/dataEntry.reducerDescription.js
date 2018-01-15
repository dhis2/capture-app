// @flow
import { createReducerDescription } from 'capture-core/tracker-redux/trackerReducer';
import { actionTypes } from 'capture-core/actions/form.actions';

export const dataEntryDesc = createReducerDescription({
    [actionTypes.OPEN_FORM]: (state, action) => {
        const newState = { ...state };
        newState.eventId = action.meta.formId;
        return newState;
    },
}, 'dataEntry');
