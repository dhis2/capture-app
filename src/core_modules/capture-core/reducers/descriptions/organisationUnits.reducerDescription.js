// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as viewEventActionTypes } from '../../components/Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { actionTypes as setOrgUnitActionTypes } from '../../components/ScopeSelector/QuickSelector/actions/QuickSelector.actions';
import { lockedSelectorActionTypes } from '../../components/LockedSelector/LockedSelector.actions';
import { actionTypes as initActionTypes } from '../../init/init.actions';
import { actionTypes as orgUnitFetcherActionTypes } from '../../components/OrgUnitFetcher/OrgUnitFetcher.actions';

export const organisationUnitDesc = createReducerDescription({
    [viewEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE]: (state, action) => {
        const newState = { ...state };
        const orgUnit = action.payload.orgUnit;
        newState[orgUnit.id] = orgUnit;
        return newState;
    },
    [setOrgUnitActionTypes.STORE_ORG_UNIT_OBJECT]: (state, action) => {
        const newState = { ...state };
        const orgUnit = action.payload;
        newState[orgUnit.id] = orgUnit;
        return newState;
    },

    [lockedSelectorActionTypes.FETCH_ORG_UNIT_SUCCESS]: (state, action) => ({
        ...state,
        [action.payload.id]: action.payload,
    }),
    [orgUnitFetcherActionTypes.FETCH_ORG_UNIT_SUCCESS]: (state, action) => ({
        ...state, [action.payload.id]: action.payload,
    }),
}, 'organisationUnits');

export const organisationUnitRootsDesc = createReducerDescription({
    [initActionTypes.ORG_UNIT_SEARCH_ROOTS_LOAD_SUCCESS]: (state, action) => ({
        ...state,
        searchRoots: {
            roots: action.payload.roots,
        },
    }),
    [initActionTypes.ORG_UNIT_CAPTURE_ROOTS_LOAD_SUCCESS]: (state, action) => ({
        ...state,
        captureRoots: {
            roots: action.payload.roots,
        },
    }),
}, 'organisationUnitRoots2222');

