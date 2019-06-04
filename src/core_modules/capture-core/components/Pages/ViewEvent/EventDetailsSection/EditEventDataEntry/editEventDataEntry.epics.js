// @flow
import { ActionsObservable } from 'redux-observable';
import { batchActions } from 'redux-batched-actions';
import { convertValue as convertToServerValue } from '../../../../../converters/clientToServer';
import { getProgramAndStageFromEvent } from '../../../../../metaData';
import { openEventForEditInDataEntry } from '../../../EditEvent/DataEntry/editEventDataEntry.actions';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import convertDataEntryToClientValues from '../../../../DataEntry/common/convertDataEntryToClientValues';
import { convertMainEventClientToServerWithKeysMap } from '../../../../../events/mainEventConverter';
import moment from 'capture-core-utils/moment/momentResolver';

import {
    actionTypes,
    batchActionTypes,
    startSaveEditEventDataEntry,
    prerequisitesErrorLoadingEditEventDataEntry,
} from './editEventDataEntry.actions';

import {
    actionTypes as eventDetailsActionTypes,
    showEditEventDataEntry,
} from '../eventDetails.actions';

import {
    updateEventContainer,
} from '../../viewEvent.actions';


export const loadEditEventDataEntryEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$.ofType(eventDetailsActionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY)
        .map(() => {
            const state = store.getState();
            const eventContainer = state.viewEventPage.eventContainer;
            const orgUnit = state.organisationUnits[eventContainer.event.orgUnitId];
            const metadataContainer = getProgramAndStageFromEvent(eventContainer.event);
            if (metadataContainer.error) {
                return prerequisitesErrorLoadingEditEventDataEntry(metadataContainer.error);
            }

            const program = metadataContainer.program;
            // $FlowFixMe
            const foundation = metadataContainer.stage.stageForm;

            return batchActions([
                showEditEventDataEntry(),
                // $FlowFixMe
                ...openEventForEditInDataEntry(eventContainer, orgUnit, foundation, program),
            ]);
        });

export const saveEditedEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(actionTypes.REQUEST_SAVE_EDIT_EVENT_DATA_ENTRY)
        .map((action) => {
            const state = store.getState();
            const payload = action.payload;
            const dataEntryKey = getDataEntryKey(payload.dataEntryId, payload.itemId);
            const eventId = state.dataEntries[payload.dataEntryId].eventId;

            const formValues = state.formsValues[dataEntryKey];
            const dataEntryValues = state.dataEntriesFieldsValue[dataEntryKey];
            const dataEntryValuesMeta = state.dataEntriesFieldsMeta[dataEntryKey];
            const prevEventMainData = state.events[eventId];
            const formFoundation = payload.formFoundation;
            const { formClientValues, dataEntryClientValues } = convertDataEntryToClientValues(
                formFoundation,
                formValues,
                dataEntryValues,
                dataEntryValuesMeta,
                prevEventMainData,
            );
            const mainDataClientValues = { ...prevEventMainData, ...dataEntryClientValues, notes: [] };
            const formServerValues = formFoundation.convertValues(formClientValues, convertToServerValue);
            const mainDataServerValues: Object = convertMainEventClientToServerWithKeysMap(mainDataClientValues);

            if (mainDataServerValues.status === 'COMPLETED' && !prevEventMainData.completedDate) {
                mainDataServerValues.completedDate = moment().format('YYYY-MM-DD');
            }

            const prevEventContainer = state.viewEventPage.eventContainer;
            const eventContainer = {
                ...prevEventContainer,
                event: {
                    ...prevEventContainer.event,
                    ...dataEntryClientValues,
                },
                values: {
                    ...formClientValues,
                },
            };

            const orgUnit = state.organisationUnits[eventContainer.event.orgUnitId];

            const serverData = {
                ...mainDataServerValues,
                dataValues: Object
                    .keys(formServerValues)
                    .map(key => ({
                        dataElement: key,
                        value: formServerValues[key],
                    })),
            };

            return batchActions([
                updateEventContainer(eventContainer, orgUnit),
                startSaveEditEventDataEntry(eventId, serverData, state.currentSelections),
            ], batchActionTypes.START_SAVE_EDIT_EVENT_DATA_ENTRY_BATCH);
        });

export const saveEditedEventFailedEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(actionTypes.SAVE_EDIT_EVENT_DATA_ENTRY_FAILED)
        .filter((action) => {
            // Check if current view event is failed event
            const state = store.getState();
            const viewEventPage = state.viewEventPage || {};
            return viewEventPage.eventId && viewEventPage.eventId === action.meta.eventId;
        })
        .map(() => {
            // Revert event container if previous exists
            const state = store.getState();
            const viewEventPage = state.viewEventPage;
            const eventContainer = viewEventPage.prevEventContainer || viewEventPage.eventContainer;
            const orgUnit = state.organisationUnits[eventContainer.event.orgUnitId];
            return updateEventContainer(eventContainer, orgUnit);
        });
