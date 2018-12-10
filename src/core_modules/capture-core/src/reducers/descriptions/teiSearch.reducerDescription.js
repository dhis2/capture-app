// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import {
    actionTypes as teiSearchActionTypes,
} from '../../components/TeiSearch/actions/teiSearch.actions';

export const teiSearchDesc = createReducerDescription({
    [teiSearchActionTypes.INITIALIZE_TEI_SEARCH]: (state, action) => ({
        ...state,
        [action.payload.searchId]: {},
    }),

    [teiSearchActionTypes.REQUEST_SEARCH_TEI]: (state, action) => ({
        ...state,
        [action.payload.searchId]: {
            showResults: true,
            resultsLoading: true,
        },
    }),
    [teiSearchActionTypes.SEARCH_TEI_RESULT_RETRIEVED]: (state, action) => {
        const data = action.payload.data;
        const searchId = action.payload.searchId;
        const results = {
            teis: data.trackedEntityInstanceContainers ? data.trackedEntityInstanceContainers.map(t => ({ id: t.id, values: t.values })) : [],
            paging: data.pagingData,
        };
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                resultsLoading: false,
                results,
            },
        };
    },
    [teiSearchActionTypes.SEARCH_TEI_FAILED]: (state, action) => {
        const searchId = action.payload.searchId;
        return {
            ...state,
            [searchId]: {
                ...state[searchId],
                resultsLoading: false,
                results: [],
            },
        };
    },
}, 'teiSearch', {});
