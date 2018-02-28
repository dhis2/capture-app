// @flow
import { createReducerDescription } from 'capture-core/trackerRedux/trackerReducer';
import { actionTypes as entryActionTypes } from '../../init/entry.actions';

export const currentSelectionsReducerDesc = createReducerDescription({
    [entryActionTypes.STARTUP_DATA_LOADED]: (state, action) => {
        const newState = {
            orgUnit: {
                code: 'OU_222702',
                id: 'ueuQlqb8ccl',
                path: '/ImspTQPwCqd/kJq2mPyFEHo/KIUCimTXf8Q/ueuQlqb8ccl',
                displayName: 'Panderu MCHP',
            },
        };
        return newState;
    },
}, 'currentSelections');
