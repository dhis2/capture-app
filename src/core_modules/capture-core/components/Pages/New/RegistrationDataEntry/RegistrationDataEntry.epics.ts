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

export const startSavingNewTrackedEntityInstanceEpic = (action$: any) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE_START),
        map((action: any) => {
            const { teiPayload } = action.payload;
            return saveNewTrackedEntityInstance(
                {
                    trackedEntities: [teiPayload],
                });
        }),
    );

export const completeSavingNewTrackedEntityInstanceEpic = (action$: any, store: any) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE_COMPLETED),
        flatMap(({ payload: { bundleReport: { typeReportMap } } }: any) => {
            const {
                currentSelections: { orgUnitId },
            } = store.value;

            return of(navigateToEnrollmentOverview({
                teiId: typeReportMap.TRACKED_ENTITY.objectReports[0].uid,
                orgUnitId,
            }));
        }),
    );

export const startSavingNewTrackedEntityInstanceWithEnrollmentEpic = (
    action$: any,
) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_START),
        map((action: any) => {
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
    action$: any,
    store: any,
    { navigate }: any,
) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_COMPLETED),
        flatMap((action: any) => {
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
    action$: any,
) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_FAILED),
        map(() => cleanUpUid()),
    );
