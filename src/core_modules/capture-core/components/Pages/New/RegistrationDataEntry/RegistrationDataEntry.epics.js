// @flow
import { ofType } from 'redux-observable';
import { flatMap, map } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import { dataEntryKeys } from 'capture-core/constants';
import {
    registrationFormActionTypes,
    saveNewTrackedEntityInstance,
    saveNewTrackedEntityInstanceWithEnrollment,
} from './RegistrationDataEntry.actions';
import { getTrackerProgramThrowIfNotFound } from '../../../../metaData';
import {
    navigateToEnrollmentOverview,
} from '../../../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';
import { buildUrlQueryString, shouldUseNewDashboard } from '../../../../utils/routing';
import {
    getStageWithOpenAfterEnrollment,
    PAGES,
} from './helpers';
import { cleanUpUid } from '../NewPage.actions';

export const startSavingNewTrackedEntityInstanceEpic: Epic = (action$: InputObservable) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE_START),
        map((action) => {
            const { teiPayload } = action.payload;
            return saveNewTrackedEntityInstance(
                {
                    trackedEntities: [teiPayload],
                });
        }),
    );

export const completeSavingNewTrackedEntityInstanceEpic: Epic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE_COMPLETED),
        flatMap(({ payload: { bundleReport: { typeReportMap } } }) => {
            const {
                currentSelections: { orgUnitId },
            } = store.value;

            return of(navigateToEnrollmentOverview({
                teiId: typeReportMap.TRACKED_ENTITY.objectReports[0].uid,
                orgUnitId,
            }));
        }),
    );

export const startSavingNewTrackedEntityInstanceWithEnrollmentEpic: Epic = (
    action$: InputObservable,
    store: ReduxStore,
) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_START),
        map((action) => {
            const { currentSelections: { programId } } = store.value;
            const { dataStore, userDataStore } = store.value.useNewDashboard;
            const { enrollmentPayload, uid } = action.payload;
            const { stages, useFirstStageDuringRegistration } = getTrackerProgramThrowIfNotFound(programId);

            const shouldRedirect = shouldUseNewDashboard({ userDataStore, dataStore, programId });
            const { stageWithOpenAfterEnrollment, redirectTo } = getStageWithOpenAfterEnrollment(
                stages,
                useFirstStageDuringRegistration,
                shouldRedirect,
            );

            const eventIndex = enrollmentPayload.enrollments[0]?.events.findIndex(
                eventsToBeCreated => eventsToBeCreated.programStage === stageWithOpenAfterEnrollment?.id,
            );

            return saveNewTrackedEntityInstanceWithEnrollment({
                candidateForRegistration: {
                    trackedEntities: [
                        enrollmentPayload,
                    ],
                },
                redirectTo,
                eventIndex,
                stageId: stageWithOpenAfterEnrollment?.id,
                uid,
            });
        }),
    );

export const completeSavingNewTrackedEntityInstanceWithEnrollmentEpic = (
    action$: InputObservable,
    store: ReduxStore,
    { history }: ApiUtils,
) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_COMPLETED),
        flatMap((action) => {
            const {
                payload: {
                    bundleReport: { typeReportMap },
                },
                meta: { uid, redirectTo, stageId, eventIndex },
            } = action;
            const {
                currentSelections: { orgUnitId, programId },
                newPage,
            } = store.value;
            const { uid: stateUid } = newPage || {};
            const teiId = typeReportMap.TRACKED_ENTITY.objectReports[0].uid;
            const enrollmentId = typeReportMap.ENROLLMENT.objectReports[0].uid;
            const eventId = typeReportMap.EVENT.objectReports?.[eventIndex]?.uid;

            if (stateUid !== uid) {
                return EMPTY;
            }

            if (redirectTo === PAGES.enrollmentEventNew) {
                history.push(
                    `/${redirectTo}?${buildUrlQueryString({
                        programId,
                        orgUnitId,
                        teiId,
                        enrollmentId,
                        stageId,
                    })}`,
                );
                return EMPTY;
            }

            if (redirectTo === PAGES.enrollmentEventEdit) {
                history.push(
                    `/${redirectTo}?${buildUrlQueryString({
                        eventId,
                        orgUnitId,
                        initMode: dataEntryKeys.EDIT,
                    })}`,
                );
                return EMPTY;
            }

            return of(navigateToEnrollmentOverview({
                teiId,
                orgUnitId,
                programId,
            }));
        }),
    );

export const failedSavingNewTrackedEntityInstanceWithEnrollmentEpic = (
    action$: InputObservable,
) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_FAILED),
        map(() => cleanUpUid()),
    );
