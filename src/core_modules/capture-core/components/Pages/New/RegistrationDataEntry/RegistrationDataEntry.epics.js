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
import {
    navigateToEnrollmentOverview,
} from '../../../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';
import { buildUrlQueryString } from '../../../../utils/routing';
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
) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_START),
        map((action) => {
            const { enrollmentPayload, uid, redirect } = action.payload;

            return saveNewTrackedEntityInstanceWithEnrollment({
                candidateForRegistration: {
                    trackedEntities: [
                        enrollmentPayload,
                    ],
                },
                redirect,
                uid,
            });
        }),
    );

export const completeSavingNewTrackedEntityInstanceWithEnrollmentEpic = (
    action$: InputObservable,
    store: ReduxStore,
    { navigate }: ApiUtils,
) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_COMPLETED),
        flatMap((action) => {
            const {
                payload: {
                    bundleReport: { typeReportMap },
                },
                meta: { uid, redirect },
            } = action;
            const {
                currentSelections: { orgUnitId, programId },
                newPage,
            } = store.value;
            const { uid: stateUid } = newPage || {};
            const teiId = typeReportMap.TRACKED_ENTITY.objectReports[0].uid;
            const enrollmentId = typeReportMap.ENROLLMENT.objectReports[0].uid;

            if (stateUid !== uid) {
                return EMPTY;
            }

            if (redirect.programStageId) {
                navigate(
                    `/enrollmentEventNew?${buildUrlQueryString({
                        programId,
                        orgUnitId,
                        teiId,
                        enrollmentId,
                        stageId: redirect.programStageId,
                    })}`,
                );
                return EMPTY;
            }

            if (redirect.eventId) {
                navigate(
                    `/enrollmentEventEdit?${buildUrlQueryString({
                        eventId: redirect.eventId,
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
