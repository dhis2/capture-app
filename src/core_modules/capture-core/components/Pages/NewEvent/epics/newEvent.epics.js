// @flow
import { push } from 'connected-react-router';
import { lockedSelectorActionTypes } from '../../../LockedSelector/LockedSelector.actions';
import { urlArguments } from '../../../../utils/url';

export const openNewEventPageLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(lockedSelectorActionTypes.NEW_EVENT_OPEN)
        .map(() => {
            const state = store.getState();
            const { programId, orgUnitId } = state.currentSelections;
            return push(`/newEvent/${urlArguments(programId, orgUnitId)}`);
        });
