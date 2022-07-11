// @flow
import { ofType } from 'redux-observable';
import { pipe } from 'capture-core-utils';
import { flatMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
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

const convertFn = pipe(convertFormToClient, convertClientToServer);

const geometryType = (key) => {
    const types = ['Point', 'None', 'Polygon'];
    return types.find(type => key.toLowerCase().includes(type.toLowerCase()));
};

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


const deriveAttributesFromFormValues = (formValues = {}) =>
    Object.keys(formValues)
        .filter(key => !geometryType(key))
        .map(key => ({ attribute: key, value: formValues[key] }));

const deriveGeometryFromFormValues = (formValues = {}) =>
    Object.keys(formValues)
        .filter(key => geometryType(key))
        .reduce((acc, currentKey) => (standardGeoJson(formValues[currentKey])), undefined);


const deriveEvents = ({ stages, enrolledAt, occurredAt, programId, orgUnitId }) => {
    // in case we have a program that does not have an incident date (occurredAt), such as Malaria case diagnosis,
    // we want the incident to default to enrollmentDate (enrolledAt)
    const sanitizedOccurredAt = occurredAt || enrolledAt;
    return [...stages.values()]
        .filter(({ autoGenerateEvent }) => autoGenerateEvent)
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
                programStage,
                program: programId,
                orgUnit: orgUnitId,
            };
        });
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
                        geometry: deriveGeometryFromFormValues(formServerValues),
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

export const startSavingNewTrackedEntityInstanceWithEnrollmentEpic: Epic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_START),
        map((action) => {
            const { currentSelections: { orgUnitId, programId }, formsValues, dataEntriesFieldsValue } = store.value;
            const { occurredAt, enrolledAt, geometry } = dataEntriesFieldsValue['newPageDataEntryId-newEnrollment'] || { };
            const { trackedEntityType, stages } = getTrackerProgramThrowIfNotFound(programId);
            const values = formsValues['newPageDataEntryId-newEnrollment'] || {};
            const events = deriveEvents({ stages, enrolledAt, occurredAt, programId, orgUnitId });
            const { formFoundation, teiId: trackedEntity } = action.payload;
            const formServerValues = formFoundation?.convertValues(values, convertFn);

            return saveNewTrackedEntityInstanceWithEnrollment(
                {
                    trackedEntities: [{
                        geometry: deriveGeometryFromFormValues(formServerValues),
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
                    }],
                });
        }),
    );

export const completeSavingNewTrackedEntityInstanceWithEnrollmentEpic: Epic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_COMPLETED),
        flatMap(({ payload: { bundleReport: { typeReportMap } } }) => {
            const {
                currentSelections: { orgUnitId, programId },
            } = store.value;

            return of(navigateToEnrollmentOverview({
                teiId: typeReportMap.TRACKED_ENTITY.objectReports[0].uid,
                orgUnitId,
                programId,
            }));
        }),
    );
