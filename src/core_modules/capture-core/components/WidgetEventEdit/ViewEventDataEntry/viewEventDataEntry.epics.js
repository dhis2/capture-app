// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { map, filter, switchMap, take } from 'rxjs/operators';
import {
    filterByInnerAction,
    mapToInnerAction,
} from 'capture-core-utils/epics';
import { statusTypes } from 'capture-core/events/statusTypes';
import { dataEntryKeys, dataEntryIds } from 'capture-core/constants';
import {
    batchActionTypes as editEventDataEntryBatchActionTypes,
} from '../EditEventDataEntry/editEventDataEntry.actions';

import {
    loadViewEventDataEntry,
    prerequisitesErrorLoadingViewEventDataEntry,
} from './viewEventDataEntry.actions';

import {
    actionTypes as viewEventPageActionTypes,
} from '../../Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { enrollmentSiteActionTypes } from '../../../components/Pages/common/EnrollmentOverviewDomain';
import { getProgramAndStageFromEvent, scopeTypes, getScopeInfo } from '../../../metaData';
import { TrackerProgram } from '../../../metaData/Program';
import { convertEventAttributeOptions } from '../../../events/convertEventAttributeOptions';


const getDataEntryKey = (eventStatus?: string): string => (
    (eventStatus === statusTypes.SCHEDULE || eventStatus === statusTypes.OVERDUE)
        ? dataEntryKeys.EDIT
        : dataEntryKeys.VIEW
);

const getDataEntryId = (event): string => (
    getScopeInfo(event?.programId)?.scopeType === scopeTypes.TRACKER_PROGRAM
        ? dataEntryIds.ENROLLMENT_EVENT
        : dataEntryIds.SINGLE_EVENT
);

export const loadViewEventDataEntryEpic = (action$: InputObservable, store: ReduxStore, { serverVersion: { minor } }: ApiUtils) =>
    action$.pipe(
        ofType(
            viewEventPageActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE,
            viewEventPageActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE,
            viewEventPageActionTypes.START_OPEN_EVENT_FOR_VIEW,
            editEventDataEntryBatchActionTypes.START_SAVE_EDIT_EVENT_DATA_ENTRY_BATCH,
        ),
        filter(action =>
            filterByInnerAction(
                action,
                editEventDataEntryBatchActionTypes.START_SAVE_EDIT_EVENT_DATA_ENTRY_BATCH,
            ),
        ),
        map(action =>
            mapToInnerAction(
                action,
                editEventDataEntryBatchActionTypes.START_SAVE_EDIT_EVENT_DATA_ENTRY_BATCH,
            ),
        ),
        filter((action) => {
            // Check if current view event is container event. Also check if in view mode.
            const eventId = action.payload.eventContainer.id;
            const state = store.value;
            const viewEventPage = state.viewEventPage || {};
            return viewEventPage.eventId === eventId && !viewEventPage.showEditEvent;
        }),
        switchMap((action) => {
            const state = store.value;
            const eventContainer = action.payload.eventContainer;
            const orgUnit = action.payload.orgUnit;
            const metadataContainer = getProgramAndStageFromEvent(eventContainer.event);
            if (metadataContainer.error) {
                return of(prerequisitesErrorLoadingViewEventDataEntry(metadataContainer.error));
            }
            const foundation = metadataContainer.stage.stageForm;
            const program = metadataContainer.program;
            const { enrollment, attributeValues } = state.enrollmentDomain;

            const args = {
                eventContainer,
                orgUnit,
                foundation,
                program,
                enrollment,
                attributeValues,
                dataEntryId: getDataEntryId(eventContainer.event),
                dataEntryKey: getDataEntryKey(eventContainer.event?.status),
                onCategoriesQuery: null,
                serverMinorVersion: minor,
            };
            eventContainer.event = convertEventAttributeOptions(eventContainer.event, minor);

            if (!enrollment && program instanceof TrackerProgram) {
                // Wait for enrollment data
                return action$.pipe(
                    ofType(enrollmentSiteActionTypes.COMMON_ENROLLMENT_SITE_DATA_SET),
                    take(1),
                    switchMap(({ payload }) => {
                        args.enrollment = payload.enrollment;
                        args.attributeValues = payload.attributeValues;
                        return from(loadViewEventDataEntry(args))
                            .pipe(
                                map(item => batchActions(item)),
                            );
                    }),
                );
            }

            return from(loadViewEventDataEntry(args))
                .pipe(
                    map(item => batchActions(item)),
                );
        }));
