// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import type { Updaters } from '../../trackerRedux/trackerReducer';
import { actionTypes as mainSelectionsActionTypes } from '../../components/Pages/MainPage/mainSelections.actions';
import {
    actionTypes as newEventSelectionActionTypes,
} from '../../components/Pages/NewEvent/newEventSelections.actions';
import {
    actionTypes as editEventActionTypes,
} from '../../components/Pages/EditEvent/editEvent.actions';

type CurrentSelectionsState = {
    programId?: ?string,
    orgUnitId?: ?string,
};

const calculateCompleteStatus = (state: CurrentSelectionsState) => {
    return !!(state.programId && state.orgUnitId);
};

export const getCurrentSelectionsReducerDesc = (appUpdaters: Updaters) => createReducerDescription({
    ...appUpdaters,
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS]: (state, action) => {
        const newState = { ...state, ...action.payload, complete: calculateCompleteStatus(state) };
        return newState;
    },
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL]: (state, action) => {
        const { page, ...selections } = action.payload;
        const newState = { ...state, ...selections, complete: false };
        return newState;
    },
    [mainSelectionsActionTypes.ORG_UNIT_DATA_RETRIVED]: (state, action) => {
        const newState = { ...state, orgUnit: action.payload };
        return newState;
    },
    [mainSelectionsActionTypes.SET_ORG_UNIT_BASED_ON_URL]: (state, action) => {
        const newState = { ...state, orgUnit: action.payload };
        return newState;
    },
    [mainSelectionsActionTypes.ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL]: (state) => {
        const newState = { ...state, orgUnit: null };
        return newState;
    },
    [mainSelectionsActionTypes.INVALID_ORG_UNIT_FROM_URL]: (state) => {
        const newState = { ...state, orgUnit: null };
        return newState;
    },
    [mainSelectionsActionTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL]: (state) => {
        const newState = { ...state, orgUnit: null };
        return newState;
    },
    [mainSelectionsActionTypes.VALID_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state };
        newState.complete = calculateCompleteStatus(newState);
        return newState;
    },
    [newEventSelectionActionTypes.UPDATE_SELECTIONS_FROM_URL]: (state, action) => {
        const { page, ...selections } = action.payload;
        const newState = { ...state, ...selections, complete: false };
        return newState;
    },
    [newEventSelectionActionTypes.SET_ORG_UNIT_BASED_ON_URL]: (state, action) => {
        const newState = { ...state, orgUnit: action.payload };
        return newState;
    },
    [newEventSelectionActionTypes.ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL]: (state) => {
        const newState = { ...state, orgUnit: null };
        return newState;
    },
    [newEventSelectionActionTypes.INVALID_ORG_UNIT_FROM_URL]: (state) => {
        const newState = { ...state, orgUnit: null };
        return newState;
    },
    [newEventSelectionActionTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL]: (state) => {
        const newState = { ...state, orgUnit: null };
        return newState;
    },
    [newEventSelectionActionTypes.VALID_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state };
        newState.complete = calculateCompleteStatus(newState);
        return newState;
    },
    [editEventActionTypes.EVENT_FROM_URL_RETRIEVED]: (state, action) => {
        const payload = action.payload;
        const newState = {
            ...state,
            programId: payload.event.programId,
            orgUnitId: payload.event.orgUnitId,
        };

        return newState;
    },
}, 'currentSelections');
