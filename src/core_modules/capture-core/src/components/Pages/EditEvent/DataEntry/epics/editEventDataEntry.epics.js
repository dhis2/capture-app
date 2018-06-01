// @flow
import { batchActions } from 'redux-batched-actions';
import { actionTypes as editEventActionTypes } from '../../editEvent.actions';
import {
    openEventForEditInDataEntry,
    prerequisitesErrorOpeningEventForEditInDataEntry,
} from '../editEventDataEntry.actions';
import getProgramAndStageFromEvent from '../../../../../metaData/helpers/EventProgram/getProgramAndStageFromEvent';

export const openEditEventInDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(editEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE, editEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE)
        .map((action) => {
            const eventContainer = action.payload.eventContainer;
            const orgUnit = action.payload.orgUnit;

            const metadataContainer = getProgramAndStageFromEvent(eventContainer.event);
            if (metadataContainer.error) {
                return prerequisitesErrorOpeningEventForEditInDataEntry(metadataContainer.error);
            }
            const foundation = metadataContainer.stage;
            const program = metadataContainer.program;

            // $FlowSuppress
            return batchActions(openEventForEditInDataEntry(eventContainer, orgUnit, foundation, program));
        });
