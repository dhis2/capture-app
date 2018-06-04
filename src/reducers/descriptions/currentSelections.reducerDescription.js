// @flow
import { getCurrentSelectionsReducerDesc } from 'capture-core/reducers/descriptions/currentSelections.reducerDescriptionGetter';
import { actionTypes as entryActionTypes } from '../../init/entry.actions';

export const currentSelectionsReducerDesc = getCurrentSelectionsReducerDesc({
    [entryActionTypes.STARTUP_DATA_LOADED]: (state, action) => {
        // TODO: Remove hard-coding.
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
});
