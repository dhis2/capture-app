// @flow
import { actionTypes as editEventPageUrlActionTypes } from '../../components/Pages/ViewEvent/ViewEventComponent/editEvent.actions';
import { createReducerDescription } from '../../trackerRedux/trackerReducer';

export const mainPageDesc = createReducerDescription({
    [editEventPageUrlActionTypes.EDIT_EVENT_FROM_URL]: (state) => {
        const newState = {
            ...state,
            selectionsError: null,
        };
        return newState;
    },
}, 'mainPage');
