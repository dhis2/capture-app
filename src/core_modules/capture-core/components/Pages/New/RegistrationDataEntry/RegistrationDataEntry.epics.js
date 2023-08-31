// @flow
import { ofType } from 'redux-observable';
import { pipe } from 'capture-core-utils';
import { flatMap, map } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import {
    registrationFormActionTypes,
    saveNewTrackedEntityInstance,
    saveNewTrackedEntityInstanceWithEnrollment,
} from './RegistrationDataEntry.actions';
import { getTrackerProgramThrowIfNotFound, dataElementTypes, Section } from '../../../../metaData';
import {
    navigateToEnrollmentOverview,
} from '../../../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';
import { convertFormToClient, convertClientToServer } from '../../../../converters';
import { FEATURETYPE } from '../../../../constants';
import { buildUrlQueryString, shouldUseNewDashboard } from '../../../../utils/routing';
import {
    deriveAutoGenerateEvents,
    deriveFirstStageDuringRegistrationEvent,
    getStageWithOpenAfterEnrollment,
    standardGeoJson,
    PAGES,
} from './helpers';

const convertFn = pipe(convertFormToClient, convertClientToServer);

const geometryType = formValuesKey => Object.values(FEATURETYPE).find(geometryKey => geometryKey === formValuesKey);

const deriveAttributesFromFormValues = (formValues = {}) =>
    Object.keys(formValues)
        .filter(key => !geometryType(key))
        .map(key => ({ attribute: key, value: formValues[key] }));

const deriveGeometryFromFormValues = (formValues = {}) =>
    Object.keys(formValues)
        .filter(key => geometryType(key))
        .reduce((acc, currentKey) => (standardGeoJson(formValues[currentKey])), undefined);

export const startSavingNewTrackedEntityInstanceEpic: Epic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE_START),
        map((action) => {
            const { currentSelections: { orgUnitId, trackedEntityTypeId }, formsValues } = store.value;
            const values = formsValues['newPageDataEntryId-newTei'];
            const formFoundation = action.payload?.formFoundation;
            const formServerValues = formFoundation?.convertValues(values, convertFn);
            return saveNewTrackedEntityInstance(
                {
                    trackedEntities: [{
                        attributes: deriveAttributesFromFormValues(formServerValues),
                        geometry: deriveGeometryFromFormValues(values),
                        enrollments: [],
                        orgUnit: orgUnitId,
                        trackedEntityType: trackedEntityTypeId,
                    }],
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
            const formId = 'newPageDataEntryId-newEnrollment';
            const { currentSelections: { orgUnitId, programId }, formsValues, dataEntriesFieldsValue } = store.value;
            const { dataStore, userDataStore, temp } = store.value.useNewDashboard;
            const { formFoundation, teiId: trackedEntity, firstStage: firstStageMetadata, uid } = action.payload;
            const fieldsValue = dataEntriesFieldsValue[formId] || {};
            const { occurredAt, enrolledAt, geometry } = fieldsValue;
            const attributeCategoryOptionsId = 'attributeCategoryOptions';
            const attributeCategoryOptions = Object.keys(fieldsValue)
                .filter(key => key.startsWith(attributeCategoryOptionsId))
                .reduce((acc, key) => {
                    const categoryId = key.split('-')[1];
                    acc[categoryId] = fieldsValue[key];
                    return acc;
                }, {});
            const { trackedEntityType, stages } = getTrackerProgramThrowIfNotFound(programId);
            const currentFormData = formsValues[formId] || {};
            const shouldRedirect = shouldUseNewDashboard(userDataStore, dataStore, temp, programId);
            const { stageWithOpenAfterEnrollment, redirectTo } = getStageWithOpenAfterEnrollment(
                stages,
                firstStageMetadata,
                shouldRedirect,
            );
            const convertedValues = formFoundation.convertAndGroupBySection(currentFormData, convertFn);
            const formServerValues = convertedValues[Section.groups.ENROLLMENT];
            const currentEventValues = convertedValues[Section.groups.EVENT];

            const firstStageDuringRegistrationEvent = deriveFirstStageDuringRegistrationEvent({
                firstStageMetadata,
                programId,
                orgUnitId,
                currentEventValues,
                fieldsValue,
                attributeCategoryOptions,
            });
            const autoGenerateEvents = deriveAutoGenerateEvents({
                stages,
                enrolledAt,
                occurredAt,
                programId,
                orgUnitId,
                firstStageMetadata,
                attributeCategoryOptions,
            });

            const allEventsToBeCreated = firstStageDuringRegistrationEvent
                ? [firstStageDuringRegistrationEvent, ...autoGenerateEvents]
                : autoGenerateEvents;
            const eventIndex = allEventsToBeCreated.findIndex(
                eventsToBeCreated => eventsToBeCreated.programStage === stageWithOpenAfterEnrollment?.id,
            );

            return saveNewTrackedEntityInstanceWithEnrollment({
                candidateForRegistration: {
                    trackedEntities: [
                        {
                            geometry: deriveGeometryFromFormValues(currentFormData),
                            enrollments: [
                                {
                                    geometry: standardGeoJson(geometry),
                                    occurredAt: convertFn(occurredAt, dataElementTypes.DATE),
                                    enrolledAt: convertFn(enrolledAt, dataElementTypes.DATE),
                                    program: programId,
                                    orgUnit: orgUnitId,
                                    attributes: deriveAttributesFromFormValues(formServerValues),
                                    status: 'ACTIVE',
                                    events: allEventsToBeCreated,
                                },
                            ],
                            orgUnit: orgUnitId,
                            trackedEntityType: trackedEntityType.id,
                            ...(trackedEntity && { trackedEntity }),
                        },
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
