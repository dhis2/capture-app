// @flow
import { createReducerDescription } from '../../trackerRedux';
import {
    urlActionTypes,
    openDataEntryActionTypes,
} from '../../components/Pages/NewEnrollment';

export const newEnrollmentPageDesc = createReducerDescription({
    [urlActionTypes.UPDATE_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state };
        newState.isLoading = true;
        return newState;
    },
    [urlActionTypes.ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL]: (state, action) => {
        const newState = { ...state };
        newState.isLoading = false;
        newState.selectionsError = action.payload.error;
        return newState;
    },
    [urlActionTypes.VALID_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state };
        newState.isLoading = false;
        newState.selectionsError = null;
        newState.dataEntryIsLoading = true;
        return newState;
    },
    [urlActionTypes.INVALID_SELECTIONS_FROM_URL]: (state, action) => {
        const newState = { ...state };
        newState.isLoading = false;
        newState.selectionsError = action.payload.error;
        return newState;
    },
    [openDataEntryActionTypes.OPEN_DATA_ENTRY_FOR_NEW_ENROLLMENT]: state => ({
        ...state,
        dataEntryIsLoading: false,
    }),
}, 'newEnrollmentPage');
