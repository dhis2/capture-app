import { createReducerDescription } from '../../trackerRedux';
import { searchGroupDuplicateActionTypes } from '../../components/Pages/NewRelationship/RegisterTei';

const initialReducerValue = {
    isLoading: false,
    isUpdating: false,
    loadError: true,
    teis: [],
    currentPage: 0,
};

export const possibleDuplicatesDesc = createReducerDescription({
    [searchGroupDuplicateActionTypes.DUPLICATES_REVIEW]: state => ({
        ...state,
        isLoading: true,
        teis: [],
    }),
    [searchGroupDuplicateActionTypes.DUPLICATES_REVIEW_RETRIEVAL_SUCCESS]: (state, action) => ({
        ...state,
        isLoading: false,
        isUpdating: false,
        teis: action.payload.teis,
        loadError: false,
        currentPage: action.payload.currentPage,
    }),
    [searchGroupDuplicateActionTypes.DUPLICATES_REVIEW_SKIPPED]: state => ({
        ...state,
        isLoading: false,
        isUpdating: false,
        loadError: false,
    }),
    [searchGroupDuplicateActionTypes.DUPLICATES_REVIEW_RETRIEVAL_FAILED]: state => ({
        ...state,
        isLoading: false,
        isUpdating: false,
        loadError: true,
        teis: [],
    }),
    [searchGroupDuplicateActionTypes.DUPLICATES_REVIEW_CHANGE_PAGE]: (state, action) => ({
        ...state,
        isUpdating: true,
        currentPage: action.payload.page,
    }),
    [searchGroupDuplicateActionTypes.DUPLICATES_RESET]: state => ({ ...state, ...initialReducerValue }),
}, 'possibleDuplicates', initialReducerValue);
