// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import type { Updaters } from '../../trackerRedux/trackerReducer';
import { actionTypes as mainSelectionsActionTypes } from '../../components/Pages/MainPage/mainSelections.actions';
import {
    actionTypes as quickSelectorActionTypes,
} from '../../components/QuickSelector/actions/QuickSelector.actions';
import {
    actionTypes as newEventSelectionActionTypes,
} from '../../components/Pages/NewEvent/newEventSelections.actions';
import {
    actionTypes as editEventActionTypes,
} from '../../components/Pages/EditEvent/editEvent.actions';
import {
    actionTypes as mainPageSelectorActionTypes,
} from '../../components/Pages/MainPage/MainPageSelector/MainPageSelector.actions';
import {
    actionTypes as editEventPageSelectorActionTypes,
} from '../../components/Pages/EditEvent/EditEventSelector/EditEventSelector.actions';
import {
    actionTypes as newEventPageSelectorActionTypes,
} from '../../components/Pages/NewEvent/NewEventSelector/NewEventSelector.actions';
import {
    actionTypes as crossPageActionTypes,
} from '../../components/Pages/actions/crossPage.actions';

const setOrgUnit = (state, action) => {
    const orgUnitId = action.payload.id;
    const newState = {
        ...state,
        orgUnitId,
        complete: false,
    };
    return newState;
};

export const getCurrentSelectionsReducerDesc = (appUpdaters: Updaters) => createReducerDescription({
    ...appUpdaters,
    [crossPageActionTypes.SELECTIONS_COMPLETENESS_CALCULATED]: (state, action) => {
        const newState = {
            ...state,
            complete: action.payload.isComplete,
        };
        return newState;
    },
    [quickSelectorActionTypes.RESET_PROGRAM_ID_BASE]: (state) => {
        const newState = {
            ...state,
            programId: null,
            complete: false,
        };
        return newState;
    },
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS]: (state, action) => {
        const newState = { ...state, ...action.payload, complete: false };
        return newState;
    },
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL]: (state, action) => {
        const { nextProps: selections } = action.payload;
        const newState = { ...state, ...selections, categories: null, complete: false };
        return newState;
    },
    [mainSelectionsActionTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL]: (state) => {
        const newState = {
            ...state,
            orgUnitId: null,
        };
        return newState;
    },
    [newEventSelectionActionTypes.UPDATE_SELECTIONS_FROM_URL]: (state, action) => {
        const { nextProps: selections } = action.payload;
        const newState = { ...state, ...selections, categories: null, complete: false };
        return newState;
    },
    [newEventSelectionActionTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL]: (state) => {
        const newState = {
            ...state,
            orgUnitId: null,
        };
        return newState;
    },
    [editEventActionTypes.EVENT_FROM_URL_RETRIEVED]: (state, action) => {
        const payload = action.payload;
        const newState = {
            ...state,
            programId: payload.eventContainer.event.programId,
            orgUnitId: payload.eventContainer.event.orgUnitId,
            complete: true,
        };

        return newState;
    },
    [mainPageSelectorActionTypes.RESET_ORG_UNIT_ID]: (state) => {
        const orgUnitId = null;
        const newState = { ...state, orgUnitId };
        newState.complete = false;
        return newState;
    },
    [mainPageSelectorActionTypes.SET_ORG_UNIT]: (state, action) => {
        const orgUnitId = action.payload.id;
        return {
            ...state,
            orgUnitId,
            complete: false,
        };
    },
    [mainPageSelectorActionTypes.SET_PROGRAM_ID]: (state, action) => {
        const programId = action.payload;
        const newState = { ...state, programId };
        newState.complete = false;
        return newState;
    },
    [mainPageSelectorActionTypes.SET_CATEGORY_OPTION]: (state, action) => {
        let categories = {};
        if (state.categories) {
            // Necessary step to prevent mutation.
            categories = Object.assign({}, state.categories);
            categories[action.payload.categoryId] = action.payload.categoryOptionId;
        } else {
            categories[action.payload.categoryId] = action.payload.categoryOptionId;
        }
        const newState = { ...state, categories };
        newState.complete = false;
        return newState;
    },
    [mainPageSelectorActionTypes.RESET_CATEGORY_OPTION]: (state, action) => {
        let categories = {};
        if (state.categories) {
            // Necessary step to prevent mutation.
            categories = Object.assign({}, state.categories);
            categories[action.payload] = null;
        } else {
            categories[action.payload] = null;
        }
        const newState = { ...state, categories };
        newState.complete = false;
        return newState;
    },
    [mainPageSelectorActionTypes.RESET_ALL_CATEGORY_OPTIONS]: (state) => {
        const categories = null;
        const newState = { ...state, categories };
        return newState;
    },
    [editEventPageSelectorActionTypes.RESET_ORG_UNIT_ID]: (state) => {
        const orgUnitId = null;
        const newState = { ...state, orgUnitId };
        newState.complete = false;
        return newState;
    },
    [editEventPageSelectorActionTypes.SET_ORG_UNIT]: setOrgUnit,
    [editEventPageSelectorActionTypes.SET_PROGRAM_ID]: (state, action) => {
        const programId = action.payload;
        const newState = { ...state, programId };
        newState.complete = false;
        return newState;
    },
    [editEventPageSelectorActionTypes.SET_CATEGORY_OPTION]: (state, action) => {
        let categories = {};
        if (state.categories) {
            // Necessary step to prevent mutation.
            categories = Object.assign({}, state.categories);
            categories[action.payload.categoryId] = action.payload.categoryOptionId;
        } else {
            categories[action.payload.categoryId] = action.payload.categoryOptionId;
        }
        const newState = { ...state, categories };
        newState.complete = false;
        return newState;
    },
    [editEventPageSelectorActionTypes.RESET_CATEGORY_OPTION]: (state, action) => {
        let categories = {};
        if (state.categories) {
            // Necessary step to prevent mutation.
            categories = Object.assign({}, state.categories);
            categories[action.payload] = null;
        } else {
            categories[action.payload] = null;
        }
        const newState = { ...state, categories };
        newState.complete = false;
        return newState;
    },
    [editEventPageSelectorActionTypes.RESET_ALL_CATEGORY_OPTIONS]: (state) => {
        const categories = null;
        const newState = { ...state, categories };
        return newState;
    },
    [newEventPageSelectorActionTypes.RESET_ORG_UNIT_ID]: (state) => {
        const orgUnitId = null;
        const newState = { ...state, orgUnitId };
        newState.complete = false;
        return newState;
    },
    [newEventPageSelectorActionTypes.SET_ORG_UNIT]: setOrgUnit,
    [newEventPageSelectorActionTypes.SET_PROGRAM_ID]: (state, action) => {
        const programId = action.payload;
        const newState = { ...state, programId };
        newState.complete = false;
        return newState;
    },
    [newEventPageSelectorActionTypes.SET_CATEGORY_OPTION]: (state, action) => {
        let categories = {};
        if (state.categories) {
            // Necessary step to prevent mutation.
            categories = Object.assign({}, state.categories);
            categories[action.payload.categoryId] = action.payload.categoryOptionId;
        } else {
            categories[action.payload.categoryId] = action.payload.categoryOptionId;
        }
        const newState = { ...state, categories };
        newState.complete = false;
        return newState;
    },
    [newEventPageSelectorActionTypes.RESET_CATEGORY_OPTION]: (state, action) => {
        let categories = {};
        if (state.categories) {
            // Necessary step to prevent mutation.
            categories = Object.assign({}, state.categories);
            categories[action.payload] = null;
        } else {
            categories[action.payload] = null;
        }
        const newState = { ...state, categories };
        newState.complete = false;
        return newState;
    },
    [newEventPageSelectorActionTypes.RESET_ALL_CATEGORY_OPTIONS]: (state) => {
        const categories = null;
        const newState = { ...state, categories };
        return newState;
    },
}, 'currentSelections');
