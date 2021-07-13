// @flow
import { ofType } from 'redux-observable';
import { map, filter } from 'rxjs/operators';
import { batchActions } from 'redux-batched-actions';
import { moment } from 'capture-core-utils/moment';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from 'capture-core-utils/date';
import { convertValue as convertToServerValue } from '../../../../../converters/clientToServer';
import { getProgramAndStageFromEvent } from '../../../../../metaData';
import { openEventForEditInDataEntry } from '../../../EditEvent/DataEntry/editEventDataEntry.actions';
import { getDataEntryKey } from '../../../../DataEntry/common/getDataEntryKey';
import { convertDataEntryToClientValues } from '../../../../DataEntry/common/convertDataEntryToClientValues';
import { convertMainEventClientToServer } from '../../../../../events/mainConverters';

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
} from '../../ViewEventComponent/viewEvent.actions';


export const loadEditEventDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(eventDetailsActionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY),
        map(() => {
            const state = store.value;
            const loadedValues = state.viewEventPage.loadedValues;
            const eventContainer = loadedValues.eventContainer;
            const orgUnit = state.organisationUnits[eventContainer.event.orgUnitId];
            const metadataContainer = getProgramAndStageFromEvent(eventContainer.event);
            if (metadataContainer.error) {
                return prerequisitesErrorLoadingEditEventDataEntry(metadataContainer.error);
            }

            const program = metadataContainer.program;
            const foundation = metadataContainer.stage.stageForm;

            return batchActions([
                showEditEventDataEntry(),
                ...openEventForEditInDataEntry(loadedValues, orgUnit, foundation, program),
            ]);
        }));

export const saveEditedEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(actionTypes.REQUEST_SAVE_EDIT_EVENT_DATA_ENTRY),
        map((action) => {
            const state = store.value;
            const payload = action.payload;
            const dataEntryKey = getDataEntryKey(payload.dataEntryId, payload.itemId);
            const eventId = state.dataEntries[payload.dataEntryId].eventId;

            const formValues = state.formsValues[dataEntryKey];
            const dataEntryValues = state.dataEntriesFieldsValue[dataEntryKey];
            const dataEntryValuesMeta = state.dataEntriesFieldsMeta[dataEntryKey];
            const prevEventMainData = state.viewEventPage.loadedValues.eventContainer.event;
            const formFoundation = payload.formFoundation;
            const { formClientValues, dataEntryClientValues } = convertDataEntryToClientValues(
                formFoundation,
                formValues,
                dataEntryValues,
                dataEntryValuesMeta,
            );

            const mainDataClientValues = { ...prevEventMainData, ...dataEntryClientValues, notes: [] };
            const formServerValues = formFoundation.convertValues(formClientValues, convertToServerValue);
            const mainDataServerValues: Object = convertMainEventClientToServer(mainDataClientValues);

            if (mainDataServerValues.status === 'COMPLETED' && !prevEventMainData.completedDate) {
                mainDataServerValues.completedDate = getFormattedStringFromMomentUsingEuropeanGlyphs(moment());
            }

            const { eventContainer: prevEventContainer } = state.viewEventPage.loadedValues;
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
        }));

export const saveEditedEventFailedEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(actionTypes.SAVE_EDIT_EVENT_DATA_ENTRY_FAILED),
        filter((action) => {
            // Check if current view event is failed event
            const state = store.value;
            const viewEventPage = state.viewEventPage || {};
            return viewEventPage.eventId && viewEventPage.eventId === action.meta.eventId;
        }),
        map(() => {
            // Revert event container if previous exists
            const state = store.value;
            const viewEventPage = state.viewEventPage;
            const eventContainer = viewEventPage.loadedValues.eventContainer;
            const orgUnit = state.organisationUnits[eventContainer.event.orgUnitId];
            return updateEventContainer(eventContainer, orgUnit);
        }));
