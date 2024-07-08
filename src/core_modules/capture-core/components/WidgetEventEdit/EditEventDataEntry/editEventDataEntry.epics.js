// @flow
import { ofType } from 'redux-observable';
import { map, filter, flatMap } from 'rxjs/operators';
import { batchActions } from 'redux-batched-actions';
import { dataEntryKeys, dataEntryIds } from 'capture-core/constants';
import moment from 'moment';
import { EMPTY } from 'rxjs';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from 'capture-core-utils/date';
import { convertCategoryOptionsToServer, convertValue as convertToServerValue } from '../../../converters/clientToServer';
import { getProgramAndStageFromEvent, scopeTypes, getScopeInfo } from '../../../metaData';
import { openEventForEditInDataEntry } from '../DataEntry/editEventDataEntry.actions';
import { getDataEntryKey } from '../../DataEntry/common/getDataEntryKey';
import { convertDataEntryToClientValues } from '../../DataEntry/common/convertDataEntryToClientValues';
import { convertMainEventClientToServer } from '../../../events/mainConverters';
import {
    commitEnrollmentEvent,
    updateEnrollmentEvent,
    rollbackEnrollmentEvent,
    rollbackEnrollmentAndEvents,
    commitEnrollmentAndEvents,
    enrollmentSiteActionTypes,
} from '../../Pages/common/EnrollmentOverviewDomain';
import { TrackerProgram } from '../../../metaData/Program';
import {
    actionTypes,
    batchActionTypes,
    startSaveEditEventDataEntry,
    prerequisitesErrorLoadingEditEventDataEntry,
    startDeleteEventDataEntry,
} from './editEventDataEntry.actions';
import {
    actionTypes as widgetEventEditActionTypes,
} from '../WidgetEventEdit.actions';
import {
    actionTypes as eventDetailsActionTypes,
    showEditEventDataEntry,
} from '../../Pages/ViewEvent/EventDetailsSection/eventDetails.actions';
import { buildUrlQueryString } from '../../../utils/routing/buildUrlQueryString';
import { newEventWidgetActionTypes } from '../../WidgetEnrollmentEventNew/Validated/validated.actions';
import { enrollmentEditEventActionTypes } from '../../Pages/EnrollmentEditEvent';

const getDataEntryId = (event): string => (
    getScopeInfo(event?.programId)?.scopeType === scopeTypes.TRACKER_PROGRAM
        ? dataEntryIds.ENROLLMENT_EVENT
        : dataEntryIds.SINGLE_EVENT
);

export const loadEditEventDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(eventDetailsActionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY, widgetEventEditActionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY),
        map((action) => {
            const state = store.value;
            const loadedValues = state.viewEventPage.loadedValues;
            const eventContainer = loadedValues.eventContainer;
            const metadataContainer = getProgramAndStageFromEvent(eventContainer.event);
            if (metadataContainer.error) {
                return prerequisitesErrorLoadingEditEventDataEntry(metadataContainer.error);
            }

            const program = metadataContainer.program;
            const foundation = metadataContainer.stage.stageForm;
            const { orgUnit, programCategory } = action.payload;
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
                    dataEntryId: getDataEntryId(eventContainer.event),
                    dataEntryKey: dataEntryKeys.EDIT,
                    programCategory,
                }),
            ]);
        }));

export const saveEditedEventEpic = (action$: InputObservable, store: ReduxStore, { serverVersion: { minor } }: ApiUtils) =>
    action$.pipe(
        ofType(actionTypes.REQUEST_SAVE_EDIT_EVENT_DATA_ENTRY),
        map((action) => {
            const {
                dataEntryId,
                itemId,
                formFoundation,
            } = action.payload;
            const state = store.value;
            const dataEntryKey = getDataEntryKey(dataEntryId, itemId);
            const eventId = state.dataEntries[dataEntryId].eventId;

            const formValues = state.formsValues[dataEntryKey];
            const dataEntryValues = state.dataEntriesFieldsValue[dataEntryKey];
            const dataEntryValuesMeta = state.dataEntriesFieldsMeta[dataEntryKey];
            const prevEventMainData = state.viewEventPage.loadedValues.eventContainer.event;
            const { formClientValues, dataEntryClientValues } = convertDataEntryToClientValues(
                formFoundation,
                formValues,
                dataEntryValues,
                dataEntryValuesMeta,
            );

            const mainDataClientValues = { ...prevEventMainData, ...dataEntryClientValues, notes: [] };
            const formServerValues = formFoundation.convertValues(formClientValues, convertToServerValue);
            const mainDataServerValues: Object = convertMainEventClientToServer(mainDataClientValues, minor);

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

            const serverData = {
                events: [{
                    ...mainDataServerValues,
                    attributeOptionCombo: undefined,
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
                    updateEnrollmentEvent(eventId, serverData.events[0]),
                    startSaveEditEventDataEntry(eventId, serverData, enrollmentSiteActionTypes.COMMIT_ENROLLMENT_EVENT, enrollmentSiteActionTypes.ROLLBACK_ENROLLMENT_EVENT),
                ], batchActionTypes.START_SAVE_EDIT_EVENT_DATA_ENTRY_BATCH);
            }
            return batchActions([
                startSaveEditEventDataEntry(eventId, serverData),
            ], batchActionTypes.START_SAVE_EDIT_EVENT_DATA_ENTRY_BATCH);
        }));

export const saveEditedEventSucceededEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(actionTypes.EDIT_EVENT_DATA_ENTRY_SAVED),
        filter((action) => {
            const {
                meta: { triggerAction },
            } = action;
            return (
                triggerAction === enrollmentSiteActionTypes.COMMIT_ENROLLMENT_EVENT ||
                triggerAction === enrollmentEditEventActionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_SUCCESS
            );
        }),
        map((action) => {
            const meta = action.meta;
            if (meta.triggerAction === enrollmentEditEventActionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_SUCCESS) {
                return commitEnrollmentAndEvents();
            }
            return commitEnrollmentEvent(meta.eventId);
        }));

export const saveEditedEventFailedEpic = (action$: InputObservable, store: ReduxStore, { serverVersion: { minor } }: ApiUtils) =>
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
            if (eventContainer.event && eventContainer.event.attributeCategoryOptions) {
                eventContainer.event.attributeCategoryOptions =
                    convertCategoryOptionsToServer(eventContainer.event.attributeCategoryOptions, minor);
            }
            let actions = [];

            if (meta.triggerAction === enrollmentSiteActionTypes.ROLLBACK_ENROLLMENT_EVENT) {
                actions = [rollbackEnrollmentEvent(eventContainer.event.eventId)];
            } else if (meta.triggerAction === enrollmentEditEventActionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_ERROR) {
                actions = [rollbackEnrollmentAndEvents()];
            }
            return batchActions(actions, batchActionTypes.SAVE_EDIT_EVENT_DATA_ENTRY_FAILED);
        }));

export const requestDeleteEventDataEntryEpic = (action$: InputObservable, store: ReduxStore, dependencies: any) =>
    action$.pipe(
        ofType(actionTypes.REQUEST_DELETE_EVENT_DATA_ENTRY),
        map((action) => {
            const { eventId, enrollmentId } = action.payload;
            const params = { enrollmentId };
            const serverData = { events: [{ event: eventId }] };
            dependencies.history.push(`/enrollment?${buildUrlQueryString(params)}`);
            return startDeleteEventDataEntry(serverData, eventId, params);
        }));

export const startCreateNewAfterCompletingEpic = (
    action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(
            actionTypes.START_CREATE_NEW_AFTER_COMPLETING,
            newEventWidgetActionTypes.START_CREATE_NEW_AFTER_COMPLETING,
        ),
        flatMap((action) => {
            const { isCreateNew, enrollmentId, orgUnitId, programId, teiId, availableProgramStages } = action.payload;
            const params = { enrollmentId, orgUnitId, programId, teiId };

            if (isCreateNew) {
                const finalParams = availableProgramStages.length === 1 ?
                    { ...params, stageId: availableProgramStages[0].id } : params;

                setTimeout(() => {
                    history.push(`/enrollmentEventNew?${buildUrlQueryString(finalParams)}`);
                }, 0);

                return EMPTY;
            }
            history.push(`/enrollment?${buildUrlQueryString(params)}`);
            return EMPTY;
        }));

export const saveEventAndCompleteEnrollmentEpic = (action$: InputObservable, store: ReduxStore, { serverVersion: { minor } }: ApiUtils) =>
    action$.pipe(
        ofType(actionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_REQUEST),
        map((action) => {
            const {
                itemId,
                dataEntryId,
                formFoundation,
                onSaveAndCompleteEnrollmentExternal,
                onSaveAndCompleteEnrollmentSuccessActionType,
                onSaveAndCompleteEnrollmentErrorActionType,
                enrollment,
            } = action.payload;

            const state = store.value;
            const dataEntryKey = getDataEntryKey(dataEntryId, itemId);
            const eventId = state.dataEntries[dataEntryId].eventId;
            const formValues = state.formsValues[dataEntryKey];
            const dataEntryValues = state.dataEntriesFieldsValue[dataEntryKey];
            const dataEntryValuesMeta = state.dataEntriesFieldsMeta[dataEntryKey];
            const prevEventMainData = state.viewEventPage.loadedValues.eventContainer.event;
            const { formClientValues, dataEntryClientValues } = convertDataEntryToClientValues(
                formFoundation,
                formValues,
                dataEntryValues,
                dataEntryValuesMeta,
            );

            const mainDataClientValues = { ...prevEventMainData, ...dataEntryClientValues, notes: [] };
            const formServerValues = formFoundation.convertValues(formClientValues, convertToServerValue);
            const mainDataServerValues: Object = convertMainEventClientToServer(mainDataClientValues, minor);

            if (!prevEventMainData.completedAt) {
                mainDataServerValues.completedAt = getFormattedStringFromMomentUsingEuropeanGlyphs(moment());
            }

            const editEvent = {
                ...mainDataServerValues,
                attributeOptionCombo: undefined,
                dataValues: formFoundation
                    .getElements()
                    .map(({ id }) => ({
                        dataElement: id,
                        value: formServerValues[id] || null,
                    })),
            };

            const enrollmentWithAllEvents = enrollment.events
                ? { ...enrollment, events: [editEvent, ...enrollment.events] }
                : { ...enrollment, events: [editEvent] };

            const serverData = { enrollments: [enrollmentWithAllEvents] };

            onSaveAndCompleteEnrollmentExternal && onSaveAndCompleteEnrollmentExternal(enrollmentWithAllEvents);
            return batchActions([
                startSaveEditEventDataEntry(
                    eventId,
                    serverData,
                    onSaveAndCompleteEnrollmentSuccessActionType,
                    onSaveAndCompleteEnrollmentErrorActionType,
                ),
            ]);
        }),
    );
