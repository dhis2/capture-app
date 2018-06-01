// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as setOrgUnitActionTypes } from '../../components/QuickSelector/actions/QuickSelector.actions';


export const organisationUnitDesc = createReducerDescription({
    [setOrgUnitActionTypes.STORE_ORG_UNIT_OBJECT]: (state, action) => {
        const newState = { ...state };
        const orgUnit = action.payload;
        newState[orgUnit.id] = orgUnit;
        return newState;
    },
}, 'organisationUnits');
