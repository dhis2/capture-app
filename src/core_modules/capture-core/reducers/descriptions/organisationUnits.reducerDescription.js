// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as initActionTypes } from '../../init/init.actions';
import { actionTypes as coreOrgunitActionTypes } from '../../metadataRetrieval/coreOrgUnit/coreOrgUnit.actions';
import type { CoreOrgUnit } from '../../metadataRetrieval/coreOrgUnit';

export const organisationUnitDesc = createReducerDescription({
    [coreOrgunitActionTypes.ORG_UNIT_FETCHED]: (state: ReduxState, action: { payload: CoreOrgUnit }) => ({
        ...state,
        [action.payload.id]: action.payload,
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

