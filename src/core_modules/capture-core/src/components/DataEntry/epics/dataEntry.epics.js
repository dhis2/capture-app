// @flow
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';
import { ensureState } from 'redux-optimistic-ui';

import { convertStateFormValuesToClient } from '../../../converters/helpers/formToClient';
import { convertClientValuesToServer } from '../../../converters/helpers/clientToServer';
import { actionTypes, completeEvent, completeEventError, saveEvent, saveEventError, loadDataEntryEvent, openDataEntryEventAlreadyLoaded } from '../actions/dataEntry.actions';
import getDataEntryKey from '../common/getDataEntryKey';

export const loadDataEntryEpic = (action$, store: ReduxStore) => 
    action$.ofType(actionTypes.START_LOAD_DATA_ENTRY_EVENT)
        .map((action) => {
            const state = store.getState();
            const payload = action.payload;
            const key = getDataEntryKey(payload.dataEntryId, payload.eventId);
            const isAlreadyLoaded = !!(state.dataEntriesUI[key] && state.dataEntriesUI[key].loaded);

            if (isAlreadyLoaded) {
                return openDataEntryEventAlreadyLoaded(payload.eventId, payload.dataEntryId);
            }

            return loadDataEntryEvent(payload.eventId, store.getState(), payload.eventPropsToInclude, payload.dataEntryId);
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
