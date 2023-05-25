// @flow
import { ofType } from 'redux-observable';
import { pipe } from 'capture-core-utils';
import { flatMap, map } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import moment from 'moment';
import {
    registrationFormActionTypes,
    saveNewTrackedEntityInstance,
    saveNewTrackedEntityInstanceWithEnrollment,
} from './RegistrationDataEntry.actions';
import { getTrackerProgramThrowIfNotFound, dataElementTypes } from '../../../../metaData';
import {
    navigateToEnrollmentOverview,
} from '../../../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';
import { convertFormToClient, convertClientToServer } from '../../../../converters';
import { FEATURETYPE } from '../../../../constants';
import { buildUrlQueryString, shouldUseNewDashboard } from '../../../../utils/routing';
import { getCurrentEventValuesFromStage } from '../../../DataEntries/Enrollment/actions/enrollment.actionBatchs';
import { convertCategoryOptionsToServer } from '../../../../converters/clientToServer';

const convertFn = pipe(convertFormToClient, convertClientToServer);

const geometryType = formValuesKey => Object.values(FEATURETYPE).find(geometryKey => geometryKey === formValuesKey);

const standardGeoJson = (geometry) => {
    if (!geometry) {
        return undefined;
    }
    if (Array.isArray(geometry)) {
        return {
            type: 'Polygon',
            coordinates: geometry,
        };
    } else if (geometry.longitude && geometry.latitude) {
        return {
            type: 'Point',
            coordinates: [geometry.longitude, geometry.latitude],
        };
    }
    return undefined;
};

const getStageWithOpenAfterEnrollment = stages =>
    [...stages.values()].find(({ openAfterEnrollment }) => openAfterEnrollment);

const deriveAttributesFromFormValues = (formValues = {}) =>
    Object.keys(formValues)
        .filter(key => !geometryType(key))
        .map(key => ({ attribute: key, value: formValues[key] }));

const deriveGeometryFromFormValues = (formValues = {}) =>
    Object.keys(formValues)
        .filter(key => geometryType(key))
        .reduce((acc, currentKey) => (standardGeoJson(formValues[currentKey])), undefined);


const deriveEvents = ({
    stages,
    enrolledAt,
    occurredAt,
    programId,
    orgUnitId,
    redirectToEnrollmentEventNew,
    redirectToStageId,
    stageDetails,
    attributeCategoryOptions,
}) => {
    // in case we have a program that does not have an incident date (occurredAt), such as Malaria case diagnosis,
    // we want the incident to default to enrollmentDate (enrolledAt)
    const sanitizedOccurredAt = occurredAt || enrolledAt;
    const events = [];
    if (stageDetails) {
        const { dataValues: stageDataValues, complete, stageOccurredAt, stageGeometry, stageId } = stageDetails;
        const dataValues = Object.keys(stageDataValues).reduce((acc, dataElement) => {
            acc.push({ dataElement, value: stageDataValues[dataElement] });
            return acc;
        }, []);

        events.push(
            {
                dataValues,
                status: complete ? 'COMPLETED' : 'ACTIVE',
                geometry: stageGeometry,
                occurredAt: convertFn(stageOccurredAt, dataElementTypes.DATE),
                scheduledAt: convertFn(enrolledAt, dataElementTypes.DATE),
                programStage: stageId,
                program: programId,
                orgUnit: orgUnitId,
            },
        );
    }

    const otherEvents = [...stages.values()]
        .filter(({ id }) => (redirectToEnrollmentEventNew && id !== redirectToStageId) || !redirectToEnrollmentEventNew)
        .filter(({ autoGenerateEvent }) => autoGenerateEvent)
        .filter(({ id }) => !stageDetails || stageDetails.stageId !== id)
        .map(({
            id: programStage,
            reportDateToUse: reportDateToUseInActiveStatus,
            generatedByEnrollmentDate: generateScheduleDateByEnrollmentDate,
            openAfterEnrollment,
            minDaysFromStart,
        }) => {
            const dateToUseInActiveStatus =
            reportDateToUseInActiveStatus === 'enrolledAt' ? enrolledAt : sanitizedOccurredAt;
            const dateToUseInScheduleStatus = generateScheduleDateByEnrollmentDate ? enrolledAt : sanitizedOccurredAt;
            const eventAttributeCategoryOptions = {};
            if (attributeCategoryOptions) {
                eventAttributeCategoryOptions.attributeCategoryOptions = convertCategoryOptionsToServer(attributeCategoryOptions);
            }
            const eventInfo =
              openAfterEnrollment
                  ?
                  {
                      status: 'ACTIVE',
                      occurredAt: convertFn(dateToUseInActiveStatus, dataElementTypes.DATE),
                      scheduledAt: convertFn(dateToUseInActiveStatus, dataElementTypes.DATE),
                  }
                  :
                  {
                      status: 'SCHEDULE',
                      // for schedule type of events we want to add the standard interval days to the date
                      scheduledAt: moment(convertFn(dateToUseInScheduleStatus, dataElementTypes.DATE))
                          .add(minDaysFromStart, 'days')
                          .format('YYYY-MM-DD'),
                  };

            return {
                ...eventInfo,
                ...eventAttributeCategoryOptions,
                programStage,
                program: programId,
                orgUnit: orgUnitId,
            };
        });
    return [...events, ...otherEvents];
};

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
            const fieldsValue = dataEntriesFieldsValue[formId] || {};
            const { occurredAt, enrolledAt, geometry, stageComplete, stageOccurredAt, stageGeometry } = fieldsValue;
            const attributeCategoryOptionsId = 'attributeCategoryOptions';
            const attributeCategoryOptions = Object.keys(fieldsValue)
                .filter(key => key.startsWith(attributeCategoryOptionsId))
                .reduce((acc, key) => {
                    const categoryId = key.split('-')[1];
                    acc[categoryId] = fieldsValue[key];
                    return acc;
                }, {});
            const { trackedEntityType, stages } = getTrackerProgramThrowIfNotFound(programId);
            const values = formsValues[formId] || {};
            const stageWithOpenAfterEnrollment = getStageWithOpenAfterEnrollment(stages);
            const redirectToEnrollmentEventNew =
            shouldUseNewDashboard(userDataStore, dataStore, temp, programId) && stageWithOpenAfterEnrollment !== undefined;

            const { formFoundation, teiId: trackedEntity, firstStage, uid } = action.payload;
            const { attributeValues, currentEventValues } = getCurrentEventValuesFromStage(values, firstStage);
            const formServerValues = formFoundation?.convertValues(attributeValues, convertFn);

            const stageDetails = firstStage && {
                stageId: firstStage.id,
                dataValues: currentEventValues,
                complete: stageComplete === 'true',
                stageOccurredAt,
                stageGeometry: standardGeoJson(stageGeometry),
            };


            const events = deriveEvents({
                stages,
                enrolledAt,
                occurredAt,
                programId,
                orgUnitId,
                redirectToEnrollmentEventNew,
                redirectToStageId: stageWithOpenAfterEnrollment?.id,
                stageDetails,
                attributeCategoryOptions,
            });

            return saveNewTrackedEntityInstanceWithEnrollment({
                candidateForRegistration: {
                    trackedEntities: [
                        {
                            geometry: deriveGeometryFromFormValues(attributeValues),
                            enrollments: [
                                {
                                    geometry: standardGeoJson(geometry),
                                    occurredAt: convertFn(occurredAt, dataElementTypes.DATE),
                                    enrolledAt: convertFn(enrolledAt, dataElementTypes.DATE),
                                    program: programId,
                                    orgUnit: orgUnitId,
                                    attributes: deriveAttributesFromFormValues(formServerValues),
                                    status: 'ACTIVE',
                                    events,
                                },
                            ],
                            orgUnit: orgUnitId,
                            trackedEntityType: trackedEntityType.id,
                            ...(trackedEntity && { trackedEntity }),
                        },
                    ],
                },
                redirectToEnrollmentEventNew,
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
            const { payload: { bundleReport: { typeReportMap } }, meta } = action;
            const {
                currentSelections: { orgUnitId, programId },
                newPage,
            } = store.value;
            const { uid: stateUid } = newPage || {};
            const teiId = typeReportMap.TRACKED_ENTITY.objectReports[0].uid;
            const enrollmentId = typeReportMap.ENROLLMENT.objectReports[0].uid;

            if (stateUid !== meta.uid) {
                return EMPTY;
            }

            if (meta?.redirectToEnrollmentEventNew) {
                history.push(
                    `/enrollmentEventNew?${buildUrlQueryString({
                        programId,
                        orgUnitId,
                        teiId,
                        enrollmentId,
                        stageId: meta?.stageId,
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
