// @flow
import { replace } from 'react-router-redux';
import { actionTypes as selectorActionTypes } from '../../MainPage/tempSelector.actions';

export const openNewEventPageLocationChangeEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(selectorActionTypes.OPEN_NEW_EVENT_PAGE)
        .map(action =>
            replace(`/newEvent/programId=${action.payload.programId}&orgUnitId=${action.payload.orgUnitId}`));
