// @flow
import { createReducerDescription } from '../../../../trackerRedux';
import { lockedSelectorActionTypes } from './actions';

export const searchPageDesc = createReducerDescription({
    [lockedSelectorActionTypes.SET_ORG_UNIT]: state => ({
        ...state,
        dataEntryIsLoading: true,
    }),
    [lockedSelectorActionTypes.UPDATE_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state, isLoading: true };
        return newState;
    },
    [lockedSelectorActionTypes.VALID_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state, isLoading: false };
        return newState;
    },
    // todo still need those 4
    // [newEventdataEntryUrlActionTypes.ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL]: (state, action) => {
    //     const newState = { ...state };
    //     newState.isLoading = false;
    //     newState.selectionsError = action.payload;
    //     return newState;
    // },
    // [newEventdataEntryUrlActionTypes.INVALID_ORG_UNIT_FROM_URL]: (state, action) => {
    //     const newState = { ...state };
    //     newState.isLoading = false;
    //     newState.selectionsError = action.payload;
    //     return newState;
    // },
    // [newEventdataEntryUrlActionTypes.INVALID_SELECTIONS_FROM_URL]: (state, action) => {
    //     const newState = { ...state };
    //     newState.isLoading = false;
    //     newState.selectionsError = action.payload;
    //     return newState;
    // },

    // this is done
    // [newEventdataEntryUrlActionTypes.UPDATE_SELECTIONS_FROM_URL]: () => ({
    //     isLoading: true,
    // }),
    // [newEventdataEntryUrlActionTypes.VALID_SELECTIONS_FROM_URL]: (state) => {
    //     const newState = { ...state };
    //     newState.isLoading = false;
    //     newState.selectionsError = null;
    //     newState.dataEntryIsLoading = true;
    //     return newState;
    // },
}, 'activePage');
