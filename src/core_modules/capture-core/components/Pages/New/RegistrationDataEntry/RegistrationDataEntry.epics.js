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


const deriveEvents = ({ stages, enrollmentDate, incidentDate, programId, orgUnitId }) => {
    // in case we have a program that does not have an incident date, such as Malaria case diagnosis,
    // we want the incident to default to enrollmentDate
    const sanitisedIncidentDate = incidentDate || enrollmentDate;
    return [...stages.values()]
        .filter(({ autoGenerateEvent }) => autoGenerateEvent)
        .map(({
            id: programStage,
            reportDateToUse: reportDateToUseInActiveStatus,
            generatedByEnrollmentDate: generateScheduleDateByEnrollmentDate,
            openAfterEnrollment,
            minDaysFromStart,
        }) => {
            const dateToUseInActiveStatus = reportDateToUseInActiveStatus === 'enrollmentDate' ? enrollmentDate : sanitisedIncidentDate;
            const dateToUseInScheduleStatus = generateScheduleDateByEnrollmentDate ? enrollmentDate : sanitisedIncidentDate;

            const eventInfo =
              openAfterEnrollment
                  ?
                  {
                      status: 'ACTIVE',
                      eventDate: convertFn(dateToUseInActiveStatus, dataElementTypes.DATE),
                      dueDate: convertFn(dateToUseInActiveStatus, dataElementTypes.DATE),
                  }
                  :
                  {
                      status: 'SCHEDULE',
                      // for schedule type of events we want to add the standard interval days to the date
                      dueDate: moment(convertFn(dateToUseInScheduleStatus, dataElementTypes.DATE))
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
                    attributes: deriveAttributesFromFormValues(formServerValues),
                    geometry: deriveGeometryFromFormValues(formServerValues),
                    enrollments: [],
                    orgUnit: orgUnitId,
                    trackedEntityType: trackedEntityTypeId,
                });
        }),
    );

export const completeSavingNewTrackedEntityInstanceEpic: Epic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE_COMPLETED),
        flatMap(({ payload: { response: { importSummaries: [{ reference }] } } }) => {
            const {
                currentSelections: { orgUnitId },
            } = store.value;

            return of(navigateToEnrollmentOverview({
                teiId: reference,
                orgUnitId,
            }));
        }),
    );

export const startSavingNewTrackedEntityInstanceWithEnrollmentEpic: Epic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_START),
        map((action) => {
            const { currentSelections: { orgUnitId, programId }, formsValues, dataEntriesFieldsValue } = store.value;
            const { incidentDate, enrollmentDate, geometry } = dataEntriesFieldsValue['newPageDataEntryId-newEnrollment'] || { };
            const { trackedEntityType, stages } = getTrackerProgramThrowIfNotFound(programId);
            const values = formsValues['newPageDataEntryId-newEnrollment'] || {};
            const events = deriveEvents({ stages, enrollmentDate, incidentDate, programId, orgUnitId });
            const formFoundation = action.payload?.formFoundation;
            const formServerValues = formFoundation?.convertValues(values, convertFn);

            return saveNewTrackedEntityInstanceWithEnrollment(
                {
                    attributes: deriveAttributesFromFormValues(formServerValues),
                    geometry: deriveGeometryFromFormValues(formServerValues),
                    enrollments: [
                        {
                            geometry: standardGeoJson(geometry),
                            incidentDate: convertFn(incidentDate, dataElementTypes.DATE),
                            enrollmentDate: convertFn(enrollmentDate, dataElementTypes.DATE),
                            program: programId,
                            orgUnit: orgUnitId,
                            status: 'ACTIVE',
                            events,
                        },
                    ],
                    orgUnit: orgUnitId,
                    trackedEntityType: trackedEntityType.id,
                });
        }),
    );

export const completeSavingNewTrackedEntityInstanceWithEnrollmentEpic: Epic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_COMPLETED),
        flatMap(({ payload: { response: { importSummaries: [{ reference }] } } }) => {
            const {
                currentSelections: { orgUnitId, programId },
            } = store.value;

            return of(navigateToEnrollmentOverview({
                teiId: reference,
                orgUnitId,
                programId,
            }));
        }),
    );
