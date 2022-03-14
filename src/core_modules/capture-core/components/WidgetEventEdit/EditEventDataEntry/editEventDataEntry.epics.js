// @flow
import { ofType } from 'redux-observable';
import { map, filter } from 'rxjs/operators';
import { batchActions } from 'redux-batched-actions';
import moment from 'moment';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from 'capture-core-utils/date';
import { convertValue as convertToServerValue } from '../../../converters/clientToServer';
import { getProgramAndStageFromEvent } from '../../../metaData';
import { openEventForEditInDataEntry } from '../DataEntry/editEventDataEntry.actions';
import { getDataEntryKey } from '../../DataEntry/common/getDataEntryKey';
import { convertDataEntryToClientValues } from '../../DataEntry/common/convertDataEntryToClientValues';
import { convertMainEventClientToServer } from '../../../events/mainConverters';
import {
    commitEnrollmentEvent,
    updateEnrollmentEvents,
    rollbackEnrollmentEvent,
    enrollmentSiteActionTypes,
} from '../../Pages/common/EnrollmentOverviewDomain';
import { TrackerProgram } from '../../../metaData/Program';

import {
    actionTypes,
    batchActionTypes,
    startSaveEditEventDataEntry,
    prerequisitesErrorLoadingEditEventDataEntry,
} from './editEventDataEntry.actions';
import {
    actionTypes as widgetEventEditActionTypes,
} from '../WidgetEventEdit.actions';


import {
    actionTypes as eventDetailsActionTypes,
    showEditEventDataEntry,
} from '../../Pages/ViewEvent/EventDetailsSection/eventDetails.actions';

import {
    updateEventContainer,
} from '../../Pages/ViewEvent/ViewEventComponent/viewEvent.actions';


export const loadEditEventDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(eventDetailsActionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY, widgetEventEditActionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY),
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
            const { enrollment, attributeValues } = state.enrollmentDomain;

            return batchActions([
                showEditEventDataEntry(),
                ...openEventForEditInDataEntry({
                    loadedValues,
                    orgUnit,
                    foundation,
                    program,
                    enrollment,
                    attributeValues,
                }),
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

            if (mainDataServerValues.status === 'COMPLETED' && !prevEventMainData.completedAt) {
                mainDataServerValues.completedAt = getFormattedStringFromMomentUsingEuropeanGlyphs(moment());
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
                events: [{
                    ...mainDataServerValues,
                    dataValues: formFoundation
                        .getElements()
                        .map(({ id }) => ({
                            dataElement: id,
                            value: formServerValues[id] || null,
                        })),
                }],
            };

            const metadataContainer = getProgramAndStageFromEvent(eventContainer.event);
            if (metadataContainer.error) {
                return prerequisitesErrorLoadingEditEventDataEntry(metadataContainer.error);
            }
            const program = metadataContainer.program;

            if (program instanceof TrackerProgram) {
                return batchActions([
                    updateEventContainer(eventContainer, orgUnit),
                    updateEnrollmentEvents(eventId, serverData.events[0]),
                    startSaveEditEventDataEntry(eventId, serverData, state.currentSelections, enrollmentSiteActionTypes.COMMIT_ENROLLMENT_EVENT, enrollmentSiteActionTypes.ROLLBACK_ENROLLMENT_EVENT),
                ], batchActionTypes.START_SAVE_EDIT_EVENT_DATA_ENTRY_BATCH);
            }
            return batchActions([
                updateEventContainer(eventContainer, orgUnit),
                startSaveEditEventDataEntry(eventId, serverData, state.currentSelections),
            ], batchActionTypes.START_SAVE_EDIT_EVENT_DATA_ENTRY_BATCH);
        }));

export const saveEditedEventSucceededEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(actionTypes.EDIT_EVENT_DATA_ENTRY_SAVED),
        filter(({ meta }) => meta.triggerAction === enrollmentSiteActionTypes.COMMIT_ENROLLMENT_EVENT),
        map(({ meta }) => commitEnrollmentEvent(meta.eventId)));

export const saveEditedEventFailedEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(actionTypes.SAVE_EDIT_EVENT_DATA_ENTRY_FAILED),
        filter((action) => {
            // Check if current view event is failed event
            const state = store.value;
            const viewEventPage = state.viewEventPage || {};
            return viewEventPage.eventId && viewEventPage.eventId === action.meta.eventId;
        }),
        map((action) => {
            // Revert event container if previous exists
            const state = store.value;
            const meta = action.meta;
            const viewEventPage = state.viewEventPage;
            const eventContainer = viewEventPage.loadedValues.eventContainer;
            const orgUnit = state.organisationUnits[eventContainer.event.orgUnitId];
            let actions = [updateEventContainer(eventContainer, orgUnit)];

            if (meta.triggerAction === enrollmentSiteActionTypes.ROLLBACK_ENROLLMENT_EVENT) {
                actions = [...actions, rollbackEnrollmentEvent(eventContainer.event.eventId)];
            }
            return batchActions(actions);
        }));
