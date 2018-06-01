// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as editEventActionTypes } from '../../components/Pages/EditEvent/editEvent.actions';
import { actionTypes as mainPageSelectionsActionTypes } from '../../components/Pages/MainPage/mainSelections.actions';
import { actionTypes as setOrgUnitActionTypes } from '../../components/QuickSelector/actions/QuickSelector.actions';
import {
    actionTypes as newEventSelectionActionTypes,
} from '../../components/Pages/NewEvent/newEventSelections.actions';

export const organisationUnitDesc = createReducerDescription({
    [editEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE]: (state, action) => {
        const newState = { ...state };
        const orgUnit = action.payload.orgUnit;
        newState[orgUnit.id] = orgUnit;
        return newState;
    },
    [mainPageSelectionsActionTypes.ORG_UNIT_DATA_RETRIVED]: (state, action) => {
        const newState = {
            ...state,
            [action.payload.id]: action.payload,
        };
        return newState;
    },
    [mainPageSelectionsActionTypes.SET_ORG_UNIT_BASED_ON_URL]: (state, action) => {
        const newState = {
            ...state,
            [action.payload.id]: action.payload,
        };
        return newState;
    },
    [newEventSelectionActionTypes.SET_ORG_UNIT_BASED_ON_URL]: (state, action) => {
        const newState = {
            ...state,
            [action.payload.id]: action.payload,
        };
        return newState;
    },
    [setOrgUnitActionTypes.STORE_ORG_UNIT_OBJECT]: (state, action) => {
        const newState = { ...state };
        const orgUnit = action.payload;
        newState[orgUnit.id] = orgUnit;
        return newState;
    },
}, 'organisationUnits');
