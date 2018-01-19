// @flow
/* eslint-disable import/prefer-default-export */
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';
import { valueConvertersForType } from 'capture-core/converters/formToClient';
import programCollection from 'capture-core/metaData/programCollection/programCollection';

import { actionTypes, completeForm } from './eventCaptureForm.actions';

export const completeFormEpic = (action$, store: ReduxStore) =>
    action$.ofType(actionTypes.START_COMPLETE_FORM)
        .map((action) => {
            const state = store.getState();
            const clientValues = getClientValues(state);

            return completeForm(clientValues);
        });


function getClientValues(state) {
    const eventId = state.dataEntry.eventId;
    const event = state.events[eventId];
    const formValues = state.formsValues[eventId];

    const program = programCollection.get(event.programId);
    if (!program) {
        // log it
        return null;
    }

    const stage = program.getStage(event.programStageId);
    if (!stage) {
        // log it
        return null;
    }

    const convertedValues = stage.convertValues(formValues, valueConvertersForType);

    return convertedValues;
}
