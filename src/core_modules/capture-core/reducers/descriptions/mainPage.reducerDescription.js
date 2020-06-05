// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import {
    dataEntryUrlActionTypes as newEventPageUrlActionTypes,
} from '../../components/Pages/NewEvent';
import { actionTypes as editEventPageUrlActionTypes } from '../../components/Pages/EditEvent/editEvent.actions';
import { actionTypes as viewEventPageUrlActionTypes } from '../../components/Pages/ViewEvent/viewEvent.actions';

export const mainPageDesc = createReducerDescription({
    [newEventPageUrlActionTypes.VALID_SELECTIONS_FROM_URL]: (state) => {
        const newState = {
            ...state,
            selectionsError: null,
        };
        return newState;
    },
    [editEventPageUrlActionTypes.EDIT_EVENT_FROM_URL]: (state) => {
        const newState = {
            ...state,
            selectionsError: null,
        };
        return newState;
    },
    [viewEventPageUrlActionTypes.VIEW_EVENT_FROM_URL]: (state) => {
        const newState = {
            ...state,
            selectionsError: null,
        };
        return newState;
    },
}, 'mainPage');
