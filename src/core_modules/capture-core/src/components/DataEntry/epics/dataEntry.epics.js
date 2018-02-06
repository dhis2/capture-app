// @flow
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';
import { ensureState } from 'redux-optimistic-ui';

import { convertStateFormValuesToClient } from '../../../converters/helpers/formToClient';
import { convertClientValuesToServer } from '../../../converters/helpers/clientToServer';
import { actionTypes, completeEvent, completeEventError, saveEvent, saveEventError, loadDataEntryEvent } from '../actions/dataEntry.actions';

export const loadDataEntryEpic = (action$, store: ReduxStore) => 
    action$.ofType(actionTypes.START_LOAD_DATA_ENTRY_EVENT)
        .map((action) => {
            return loadDataEntryEvent(action.payload.eventId, store.getState(), action.payload.eventPropsToInclude, action.payload.dataEntryId);
        });

export const completeEventEpic = (action$, store: ReduxStore) =>
    action$.ofType(actionTypes.START_COMPLETE_EVENT)
        .map((action) => {
            const { eventId, id } = action.payload;
            const state = store.getState();
            const clientValuesContainer = convertStateFormValuesToClient(eventId, state);

            if (clientValuesContainer.error) {
                return completeEventError(clientValuesContainer.error, id);
            }
            const clientValues = clientValuesContainer.values;

            // $FlowSuppress
            const serverValues = convertClientValuesToServer(clientValues, clientValuesContainer.stage);
            return completeEvent(clientValues, serverValues, eventId, ensureState(state.events)[eventId], id);
        });

export const saveEventEpic = (action$, store: ReduxStore) =>
    action$.ofType(actionTypes.START_SAVE_EVENT)
        .map((action) => {
            const { eventId, id } = action.payload;
            const state = store.getState();
            const clientValuesContainer = convertStateFormValuesToClient(eventId, state);

            if (clientValuesContainer.error) {
                return saveEventError(clientValuesContainer.error, id);
            }
            const clientValues = clientValuesContainer.values;

            // $FlowSuppress
            const serverValues = convertClientValuesToServer(clientValues, clientValuesContainer.stage);

            return saveEvent(clientValues, serverValues, eventId, ensureState(state.events)[eventId], id);
        });
