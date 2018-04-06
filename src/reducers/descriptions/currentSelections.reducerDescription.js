// @flow
import { createReducerDescription } from 'capture-core/trackerRedux/trackerReducer';
import { actionTypes as selectionsActionTypes } from 'capture-core/actions/currentSelections.actions';
import { actionTypes as entryActionTypes } from '../../init/entry.actions';

export const currentSelectionsReducerDesc = createReducerDescription({
    [entryActionTypes.STARTUP_DATA_LOADED]: (state, action) => {
        const newState = {
            ...state,
            orgUnit: {
                code: 'OU_222702',
                id: 'ueuQlqb8ccl',
                path: '/ImspTQPwCqd/kJq2mPyFEHo/KIUCimTXf8Q/ueuQlqb8ccl',
                displayName: 'Panderu MCHP',
            },
        };
        return newState;
    },
    [selectionsActionTypes.UPDATE_SELECTIONS]: (state, action) => {
        const newState = { ...state, ...action.payload };
        return newState;
    },
}, 'currentSelections');
