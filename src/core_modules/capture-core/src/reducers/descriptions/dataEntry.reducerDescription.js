// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes } from '../../components/DataEntry/actions/dataEntry.actions';

export const dataEntryDesc = createReducerDescription({
    [actionTypes.LOAD_DATA_ENTRY_EVENT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.id] = { ...newState[payload.id] };
        newState[payload.id].eventId = payload.eventId;
        return newState;
    },
    [actionTypes.COMPLETE_VALIDATION_FAILED]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.id] = { ...newState[payload.id] };
        newState[payload.id].completionAttempted = true;
        return newState;
    },
    [actionTypes.SAVE_VALIDATION_FALED]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.id] = { ...newState[payload.id] };
        newState[payload.id].saveAttempted = true;
        return newState;
    },
}, 'dataEntry');
