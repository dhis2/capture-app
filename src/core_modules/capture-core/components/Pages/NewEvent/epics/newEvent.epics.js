// @flow
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import {
    actionTypes as editEventSelectorActionTypes,
} from '../../EditEvent/EditEventSelector/EditEventSelector.actions';
import {
    actionTypes as viewEventSelectorActionTypes,
} from '../../ViewEvent/ViewEventSelector/ViewEventSelector.actions';
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
    action$.pipe(
        ofType(
            editEventSelectorActionTypes.OPEN_NEW_EVENT,
            viewEventSelectorActionTypes.OPEN_NEW_EVENT,
            mainPageSelectorActionTypes.OPEN_NEW_EVENT,
        ),
        map(() => {
            const state = store.value;
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return push(`/newEvent/${args}`);
        }));
