// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as editEventPageUrlActionTypes } from '../../components/Pages/EditEvent/editEvent.actions';

export const mainPageDesc = createReducerDescription(
  {
    [editEventPageUrlActionTypes.EDIT_EVENT_FROM_URL]: (state) => {
      const newState = {
        ...state,
        selectionsError: null,
      };
      return newState;
    },
  },
  'mainPage',
);
