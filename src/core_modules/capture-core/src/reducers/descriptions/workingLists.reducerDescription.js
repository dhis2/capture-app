// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as mainSelectionsActionTypes } from '../../components/Pages/MainPage/mainSelections.actions';

export const workingListsDesc = createReducerDescription({
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS]: (state, action) => {
        const newState = { ...state };
        newState.main = {
            isLoading: true,
        };

        return newState;
    },
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };

        const eventContainers = action.payload.eventContainers;
        newState.main = {
            order: eventContainers ?
                eventContainers
                    .map(container => container.event.eventId) : [],
            type: 'event',
        };

        return newState;
    },
}, 'workingLists');

export const workingListsUIDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };

        // newState.main = action.payload.pagingData;
       
        newState.main = {
            rowsPerPage: 1,
            rowsCount: 3,
            pageNumber: 1,
        };

        return newState;
    },
}, 'workingListsUI');

