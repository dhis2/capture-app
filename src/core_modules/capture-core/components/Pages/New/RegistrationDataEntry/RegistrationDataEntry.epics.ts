import { ofType } from 'redux-observable';
import { flatMap, map } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { dataEntryKeys } from 'capture-core/constants';
import type { ReduxStore, EpicAction, ApiUtils } from 'capture-core-utils/types/global';
import {
    registrationFormActionTypes,
    saveNewTrackedEntityInstance,
    saveNewTrackedEntityInstanceWithEnrollment,
    failAOCResolveForNewTrackedEntityInstanceWithEnrollment,
} from './RegistrationDataEntry.actions';
import {
    navigateToEnrollmentOverview,
} from '../../../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';
import { buildUrlQueryString } from '../../../../utils/routing';
import { cleanUpUid } from '../NewPage.actions';
import { getTrackerProgramThrowIfNotFound } from '../../../../metaData';

export const startSavingNewTrackedEntityInstanceEpic = (action$: EpicAction<any>) =>
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

export const completeSavingNewTrackedEntityInstanceEpic = (action$: EpicAction<any>, store: ReduxStore) =>
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
    action$: EpicAction<any>,
) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_START),
        map((action: any) => {
            const { enrollmentPayload, uid, redirect } = action.payload;
            const [enrollment] = enrollmentPayload.enrollments;
            const { enrollmentCategoryOptionUids: optionUids = [], ...enrollmentRest } = enrollment;

            let resolvedEnrollment = enrollmentRest;
            if (optionUids.length > 0) {
                const { enrollmentCategoryCombination } = getTrackerProgramThrowIfNotFound(enrollment.program);
                const attributeOptionCombo = enrollmentCategoryCombination?.resolveAttributeOptionCombo(optionUids);
                if (!attributeOptionCombo) {
                    log.error(
                        errorCreator(
                            'Could not resolve the selected enrollment category options to an attribute option combo',
                        )({ optionUids, enrollmentCategoryCombinationId: enrollmentCategoryCombination?.id }),
                    );
                    return failAOCResolveForNewTrackedEntityInstanceWithEnrollment(enrollment.program);
                }
                resolvedEnrollment = { ...enrollmentRest, attributeOptionCombo };
            }

            return saveNewTrackedEntityInstanceWithEnrollment({
                candidateForRegistration: {
                    trackedEntities: [{ ...enrollmentPayload, enrollments: [resolvedEnrollment] }],
                },
                redirect,
                uid,
                programId: enrollment.program,
            });
        }),
    );

export const completeSavingNewTrackedEntityInstanceWithEnrollmentEpic = (
    action$: EpicAction<any>,
    store: ReduxStore,
    { navigate }: ApiUtils,
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
    action$: EpicAction<any>,
) =>
    action$.pipe(
        ofType(
            registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_FAILED,
            registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_AOC_RESOLVE_FAILED,
        ),
        map(() => cleanUpUid()),
    );
