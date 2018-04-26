// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import type { Updaters } from '../../trackerRedux/trackerReducer';
import { actionTypes as selectionsActionTypes } from '../../components/Pages/MainPage/mainSelections.actions';

export const getCurrentSelectionsReducerDesc = (appUpdaters: Updaters) => createReducerDescription({
    ...appUpdaters,
    [selectionsActionTypes.UPDATE_MAIN_SELECTIONS]: (state, action) => {
        const newState = { ...state, ...action.payload };
        return newState;
    },
    [selectionsActionTypes.ORG_UNIT_DATA_RETRIVED]: (state, action) => {
        const newState = { ...state, orgUnit: action.payload };
        return newState;
    },
}, 'currentSelections');
