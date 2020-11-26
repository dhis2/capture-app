// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import type { Updaters } from '../../trackerRedux/trackerReducer';
import {
    actionTypes as quickSelectorActionTypes,
} from '../../components/LockedSelector/QuickSelector/actions/QuickSelector.actions';
import {
    actionTypes as editEventActionTypes,
} from '../../components/Pages/EditEvent/editEvent.actions';
import {
    actionTypes as viewEventActionTypes,
} from '../../components/Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import {
    actionTypes as crossPageActionTypes,
} from '../../components/Pages/actions/crossPage.actions';
import {
    urlActionTypes as newEnrollmentUrlActionTypes,
} from '../../components/Pages/NewEnrollment';
import {
    lockedSelectorActionTypes,
} from '../../components/LockedSelector';
import { searchPageActionTypes } from '../../components/Pages/Search/SearchPage.actions';
import { trackedEntityTypeSelectorActionTypes } from '../../components/TrackedEntityTypeSelector/TrackedEntityTypeSelector.actions';

const setCategoryOption = (
    state: Object,
    categoryId: string,
    categoryOption: { id: string, name: string, writeAccess: boolean }) => {
    const categories = {
        ...state.categories,
        [categoryId]: categoryOption.id,
    };

    const categoriesMeta = {
        ...state.categoriesMeta,
        [categoryId]: {
            name: categoryOption.name,
            writeAccess: categoryOption.writeAccess,
        },
    };

    return {
        ...state,
        categories,
        categoriesMeta,
        complete: false,
    };
};

const resetCategoryOption = (state: Object, categoryId: string) => {
    const categories = {
        ...state.categories,
        [categoryId]: undefined,
    };

    const categoriesMeta = {
        ...state.categoriesMeta,
        [categoryId]: undefined,
    };

    return {
        ...state,
        categories,
        categoriesMeta,
        complete: false,
    };
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
            programId: undefined,
            categories: undefined,
            categoriesMeta: undefined,
            trackedEntityTypeId: undefined,
            complete: false,
        };
        return newState;
    },
    [newEnrollmentUrlActionTypes.UPDATE_SELECTIONS_FROM_URL]: (state, action) => {
        const { nextProps: selections } = action.payload;
        const newState = { ...state, ...selections, categories: undefined, categoriesMeta: undefined, complete: false };
        return newState;
    },
    [newEnrollmentUrlActionTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL]: (state) => {
        const newState = {
            ...state,
            orgUnitId: null,
        };
        return newState;
    },
    [editEventActionTypes.EVENT_FROM_URL_RETRIEVED]: (state, action) => {
        const { eventContainer, categoriesData } = action.payload;
        const event = eventContainer.event;

        const categories = categoriesData ? categoriesData.reduce((acc, data) => {
            acc[data.categoryId] = data.categoryOption.id;
            return acc;
        }, {}) : undefined;

        const categoriesMeta = categoriesData ? categoriesData.reduce((acc, data) => {
            acc[data.categoryId] = {
                name: data.categoryOption.name,
                writeAccess: data.categoryOption.writeAccess,
            };
            return acc;
        }, {}) : undefined;


        const newState = {
            ...state,
            programId: event.programId,
            orgUnitId: event.orgUnitId,
            categories,
            categoriesMeta,
            complete: true,
        };

        return newState;
    },
    [viewEventActionTypes.EVENT_FROM_URL_RETRIEVED]: (state, action) => {
        const { eventContainer, categoriesData } = action.payload;
        const event = eventContainer.event;

        const categories = categoriesData ? categoriesData.reduce((acc, data) => {
            acc[data.categoryId] = data.categoryOption.id;
            return acc;
        }, {}) : undefined;

        const categoriesMeta = categoriesData ? categoriesData.reduce((acc, data) => {
            acc[data.categoryId] = {
                name: data.categoryOption.name,
                writeAccess: data.categoryOption.writeAccess,
            };
            return acc;
        }, {}) : undefined;

        const newState = {
            ...state,
            programId: event.programId,
            orgUnitId: event.orgUnitId,
            categories,
            categoriesMeta,
            complete: true,
        };

        return newState;
    },
    [crossPageActionTypes.AFTER_SETTING_ORG_UNIT_DO_CATEGORIES_RESET]: (state, action) => {
        const { resetCategories } = action.payload;
        const { categories, categoriesMeta } = state;
        const container = resetCategories.reduce((acc, categoryId) => {
            acc.categories[categoryId] = undefined;
            acc.categoriesMeta[categoryId] = undefined;
            return acc;
        }, { categories: { ...categories }, categoriesMeta: { ...categoriesMeta } });

        return {
            ...state,
            categories: container.categories,
            categoriesMeta: container.categoriesMeta,
            categoryCheckInProgress: false,
        };
    },
    [crossPageActionTypes.AFTER_SETTING_ORG_UNIT_SKIP_CATEGORIES_RESET]: state => ({
        ...state,
        categoryCheckInProgress: false,
    }),

    [lockedSelectorActionTypes.ORG_UNIT_ID_SET]: (state, action) => ({
        ...state,
        orgUnitId: action.payload.id,
    }),
    [lockedSelectorActionTypes.ORG_UNIT_ID_RESET]: state => ({
        ...state,
        orgUnitId: null,
        complete: false,
    }),
    [lockedSelectorActionTypes.SELECTIONS_FROM_URL_UPDATE]: (state, action) => {
        const { nextProps: selections } = action.payload;
        return {
            ...state,
            ...selections,
            categories: undefined,
            categoriesMeta: undefined,
            complete: false,
        };
    },
    [lockedSelectorActionTypes.PROGRAM_ID_SET]: (state, action) => {
        const programId = action.payload;
        return {
            ...state,
            programId,
            trackedEntityTypeId: undefined,
            complete: false,
        };
    },
    [lockedSelectorActionTypes.CATEGORY_OPTION_SET]: (state, action) => {
        const { categoryId, categoryOption } = action.payload;
        return setCategoryOption(state, categoryId, categoryOption);
    },
    [lockedSelectorActionTypes.CATEGORY_OPTION_RESET]: (state, action) => {
        const { categoryId } = action.payload;
        return resetCategoryOption(state, categoryId);
    },
    [lockedSelectorActionTypes.ALL_CATEGORY_OPTIONS_RESET]: state => ({
        ...state,
        categories: undefined,
        categoriesMeta: undefined,
    }),
    [searchPageActionTypes.FALLBACK_SEARCH_COMPLETED]:
      (state, { payload: { trackedEntityTypeId } }) => ({
          ...state,
          programId: undefined,
          categories: undefined,
          categoriesMeta: undefined,
          trackedEntityTypeId,
      }),
    [trackedEntityTypeSelectorActionTypes.TRACKED_ENTITY_TYPE_ID_ON_URL_SET]: (
        state, { payload: { trackedEntityTypeId } }) => ({
        ...state,
        programId: undefined,
        categories: undefined,
        categoriesMeta: undefined,
        trackedEntityTypeId,
    }),
}, 'currentSelections');
