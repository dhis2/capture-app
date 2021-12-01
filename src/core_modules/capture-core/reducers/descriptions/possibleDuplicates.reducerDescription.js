import { searchGroupDuplicateActionTypes } from '../../components/Pages/NewRelationship/RegisterTei';
import { createReducerDescription } from '../../trackerRedux';

export const possibleDuplicatesDesc = createReducerDescription({
    [searchGroupDuplicateActionTypes.DUPLICATES_REVIEW]: state => ({
        ...state,
        isLoading: true,
    }),
    [searchGroupDuplicateActionTypes.DUPLICATES_REVIEW_RETRIEVAL_SUCCESS]: (state, action) => ({
        ...state,
        isLoading: false,
        isUpdating: false,
        teis: action.payload.teis,
        loadError: false,
        currentPage: action.payload.currentPage,
    }),
    [searchGroupDuplicateActionTypes.DUPLICATES_REVIEW_RETRIEVAL_FAILED]: state => ({
        ...state,
        isLoading: false,
        isUpdating: false,
        loadError: true,
    }),
    [searchGroupDuplicateActionTypes.DUPLICATES_REVIEW_CHANGE_PAGE]: (state, action) => ({
        ...state,
        isUpdating: true,
        currentPage: action.payload.page,
    }),
}, 'possibleDuplicates');
