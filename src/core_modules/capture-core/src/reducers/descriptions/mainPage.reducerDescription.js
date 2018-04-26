// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as selectionsActionTypes } from '../../components/Pages/MainPage/mainSelections.actions';

export const mainPageDesc = createReducerDescription({
    [selectionsActionTypes.UPDATE_MAIN_SELECTIONS]: (state) => {
        const newState = { ...state };
        newState.prerequisitesForWorkingListMet = false;
        return newState;
    },
    [selectionsActionTypes.MAIN_SELECTIONS_COMPLETED]: (state) => {
        const newState = { ...state };
        newState.prerequisitesForWorkingListMet = true;
        return newState;
    },
}, 'mainPage');
