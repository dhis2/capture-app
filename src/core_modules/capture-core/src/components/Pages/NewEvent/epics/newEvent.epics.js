// @flow
import { replace } from 'react-router-redux';
import { actionTypes as editEventSelectorActionTypes } from '../../EditEvent/EditEventSelector/EditEventSelector.actions';
import { actionTypes as mainPageSelectorActionTypes } from '../../MainPage/MainPageSelector/MainPageSelector.actions';

const getArguments = (programId: string, orgUnitId: string) => {
    const argArray = [];
    if (programId) {
        argArray.push(`programId=${programId}`);
    }
    if (orgUnitId) {
        argArray.push(`orgUnitId=${orgUnitId}`);
    }

    return argArray.join('&');
};

export const openNewEventPageLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(editEventSelectorActionTypes.OPEN_NEW_EVENT, mainPageSelectorActionTypes.OPEN_NEW_EVENT)
        .map(() => {
            const state = store.getState();
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return replace(`/newEvent/${args}`);
        });
