// @flow
import programs from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import type { Updaters } from '../../trackerRedux/trackerReducer';
import { actionTypes as mainSelectionsActionTypes } from '../../components/Pages/MainPage/mainSelections.actions';
import {
    actionTypes as setCurrentSelectionsActionTypes,
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

type CurrentSelectionsState = {
    programId?: ?string,
    orgUnitId?: ?string,
    categories?: ?Object,
};

const calculateCompleteStatus = (state: CurrentSelectionsState) => {
    if (!state.orgUnitId || !state.programId) {
        return false;
    }

    const selectedProgram = state.programId && programs.get(state.programId);

    if (selectedProgram && selectedProgram.categories) {
        const categoryies = selectedProgram.categories;

        for (let i = 0; i < categoryies.length; i++) {
            if (!state.categories || !state.categories[categoryies[i].id]) {
                return false;
            }
        }
    }
    return true;
};

export const getCurrentSelectionsReducerDesc = (appUpdaters: Updaters) => createReducerDescription({
    ...appUpdaters,
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS]: (state, action) => {
        const newState = { ...state, ...action.payload, complete: calculateCompleteStatus(state) };
        return newState;
    },
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL]: (state, action) => {
        const { nextProps: selections } = action.payload;
        const newState = { ...state, ...selections, complete: false };
        return newState;
    },
    [mainSelectionsActionTypes.VALID_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state };
        newState.complete = calculateCompleteStatus(newState);
        return newState;
    },
    [mainSelectionsActionTypes.ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL]: (state) => {
        const newState = {
            ...state,
            orgUnitId: null,
        };
        return newState;
    },
    [mainSelectionsActionTypes.INVALID_ORG_UNIT_FROM_URL]: (state) => {
        const newState = {
            ...state,
            orgUnitId: null,
        };
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
        const newState = { ...state, ...selections, complete: false };
        return newState;
    },
    [newEventSelectionActionTypes.VALID_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state };
        newState.complete = calculateCompleteStatus(newState);
        return newState;
    },
    [newEventSelectionActionTypes.ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL]: (state) => {
        const newState = {
            ...state,
            orgUnitId: null,
        };
        return newState;
    },
    [newEventSelectionActionTypes.INVALID_ORG_UNIT_FROM_URL]: (state) => {
        const newState = {
            ...state,
            orgUnitId: null,
        };
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
            programId: payload.event.programId,
            orgUnitId: payload.event.orgUnitId,
            complete: true,
        };

        return newState;
    },
    [setCurrentSelectionsActionTypes.SET_ORG_UNIT_ID]: (state, action) => {
        const newState = { ...state };
        newState.orgUnitId = action.payload;
        newState.complete = calculateCompleteStatus(newState);
        return newState;
    },
    [setCurrentSelectionsActionTypes.SET_PROGRAM_ID]: (state, action) => {
        const newState = { ...state };
        newState.programId = action.payload;
        newState.complete = calculateCompleteStatus(newState);
        return newState;
    },
    [setCurrentSelectionsActionTypes.SET_CATEGORY_ID]: (state, action) => {
        let categories = {};
        if (state.categories) {
            // Necessary step to prevent mutation.
            categories = Object.assign({}, state.categories);
            categories[action.payload.categoryId] = action.payload.selectedCategoryOptionId;
        } else {
            categories[action.payload.categoryId] = action.payload.selectedCategoryOptionId;
        }
        const newState = { ...state, categories };
        newState.complete = calculateCompleteStatus(newState);
        return newState;
    },
    [setCurrentSelectionsActionTypes.RESET_CATEGORY_SELECTIONS]: (state) => {
        const categories = null;
        const newState = { ...state, categories };
        return newState;
    },
    [mainPageSelectorActionTypes.RESET_ORG_UNIT_ID]: (state) => {
        const orgUnitId = null;
        const newState = { ...state, orgUnitId };
        newState.complete = calculateCompleteStatus(newState);
        return newState;
    },
    [mainPageSelectorActionTypes.SET_ORG_UNIT]: (state, action) => {
        const orgUnitId = action.payload.id;
        const newState = { ...state, orgUnitId };
        newState.complete = calculateCompleteStatus(newState);
        return newState;
    },
    [mainPageSelectorActionTypes.SET_PROGRAM_ID]: (state, action) => {
        const programId = action.payload;
        const newState = { ...state, programId };
        newState.complete = calculateCompleteStatus(newState);
        return newState;
    },
    [mainPageSelectorActionTypes.RESET_PROGRAM_ID]: (state) => {
        const programId = null;
        const newState = { ...state, programId };
        newState.complete = calculateCompleteStatus(newState);
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
        newState.complete = calculateCompleteStatus(newState);
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
        newState.complete = calculateCompleteStatus(newState);
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
        newState.complete = calculateCompleteStatus(newState);
        return newState;
    },
    [editEventPageSelectorActionTypes.SET_ORG_UNIT]: (state, action) => {
        const orgUnitId = action.payload.id;
        const newState = { ...state, orgUnitId };
        newState.complete = calculateCompleteStatus(newState);
        return newState;
    },
    [editEventPageSelectorActionTypes.SET_PROGRAM_ID]: (state, action) => {
        const programId = action.payload;
        const newState = { ...state, programId };
        newState.complete = calculateCompleteStatus(newState);
        return newState;
    },
    [editEventPageSelectorActionTypes.RESET_PROGRAM_ID]: (state) => {
        const programId = null;
        const newState = { ...state, programId };
        newState.complete = calculateCompleteStatus(newState);
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
        newState.complete = calculateCompleteStatus(newState);
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
        newState.complete = calculateCompleteStatus(newState);
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
        newState.complete = calculateCompleteStatus(newState);
        return newState;
    },
    [newEventPageSelectorActionTypes.SET_ORG_UNIT]: (state, action) => {
        const orgUnitId = action.payload.id;
        const newState = { ...state, orgUnitId };
        newState.complete = calculateCompleteStatus(newState);
        return newState;
    },
    [newEventPageSelectorActionTypes.SET_PROGRAM_ID]: (state, action) => {
        const programId = action.payload;
        const newState = { ...state, programId };
        newState.complete = calculateCompleteStatus(newState);
        return newState;
    },
    [newEventPageSelectorActionTypes.RESET_PROGRAM_ID]: (state) => {
        const programId = null;
        const newState = { ...state, programId };
        newState.complete = calculateCompleteStatus(newState);
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
        newState.complete = calculateCompleteStatus(newState);
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
        newState.complete = calculateCompleteStatus(newState);
        return newState;
    },
    [newEventPageSelectorActionTypes.RESET_ALL_CATEGORY_OPTIONS]: (state) => {
        const categories = null;
        const newState = { ...state, categories };
        return newState;
    },
}, 'currentSelections');
