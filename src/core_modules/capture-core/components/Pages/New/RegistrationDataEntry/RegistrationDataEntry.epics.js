// @flow
import { ofType } from 'redux-observable';
import { flatMap, map } from 'rxjs/operators';
import { empty } from 'rxjs';
import moment from 'moment';
import {
    registrationFormActionTypes,
    saveNewTrackedEntityInstance,
    saveNewTrackedEntityInstanceWithEnrollment,
} from './RegistrationDataEntry.actions';
import { navigateToTrackedEntityDashboard } from '../../../../utils/navigateToTrackedEntityDashboard';
import { getTrackerProgramThrowIfNotFound, scopeTypes } from '../../../../metaData';


const deriveAttributesFromFormValues = (formValues = {}) =>
    Object.keys(formValues)
        .map(key => ({ attribute: key, value: formValues[key] }));

const deriveEvents = ({ stages, enrollmentDate, incidentDate, programId, orgUnitId }) => {
    // in case we have a program that does not have an incident date, such as Malaria case diagnosis,
    // we want the incident to bedefault to enrollmentDate
    const incident = (incidentDate || enrollmentDate);

    return [...stages.values()]
        .filter(autoGenerateEvent => autoGenerateEvent)
        .map(({ id: programStage, generatedByEnrollmentDate, openAfterEnrollment, reportDateToUse, standardInterval }) => {
            const dateToUseInActiveStatus = reportDateToUse === 'enrollmentDate' ? enrollmentDate : incident;
            const dateToUseInScheduleStatus = generatedByEnrollmentDate ? enrollmentDate : incident;

            const eventInfo = openAfterEnrollment
                ?
                {
                    status: 'ACTIVE',
                    eventDate: dateToUseInActiveStatus,
                    dueDate: dateToUseInActiveStatus,
                }
                :
                {
                    status: 'SCHEDULE',
                    // for schedule type of events we want to add the standard interval days to the date
                    dueDate: moment(dateToUseInScheduleStatus).add(standardInterval, 'days').format('YYYY-MM-DD'),
                };

            return {
                ...eventInfo,
                programStage,
                program: programId,
                orgUnit: orgUnitId,
            };
        },
        );
};

export const startSavingNewTrackedEntityInstanceEpic: Epic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE_START),
        map(() => {
            const { currentSelections: { orgUnitId, trackedEntityTypeId }, formsValues } = store.value;
            const values = formsValues['newPageDataEntryId-newTei'];
            return saveNewTrackedEntityInstance(
                {
                    attributes: deriveAttributesFromFormValues(values),
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
            const { orgUnitId, trackedEntityTypeId } = store.value.currentSelections;
            navigateToTrackedEntityDashboard(
                reference,
                orgUnitId,
                `${scopeTypes.TRACKED_ENTITY_TYPE.toLowerCase()}=${trackedEntityTypeId}`,
            );
            return empty();
        }),
    );

export const startSavingNewTrackedEntityInstanceWithEnrollmentEpic: Epic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_START),
        map(() => {
            const { currentSelections: { orgUnitId, programId }, formsValues, dataEntriesFieldsValue } = store.value;
            const { incidentDate, enrollmentDate } = dataEntriesFieldsValue['newPageDataEntryId-newEnrollment'] || { };
            const { trackedEntityType, stages } = getTrackerProgramThrowIfNotFound(programId);
            const values = formsValues['newPageDataEntryId-newEnrollment'];
            const events = deriveEvents({ stages, enrollmentDate, incidentDate, programId, orgUnitId });

            return saveNewTrackedEntityInstanceWithEnrollment(
                {
                    attributes: deriveAttributesFromFormValues(values),
                    enrollments: [
                        {
                            incidentDate,
                            enrollmentDate,
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
            const { orgUnitId, programId } = store.value.currentSelections;

            navigateToTrackedEntityDashboard(
                reference,
                orgUnitId,
                `program=${programId}`,
            );
            return empty();
        }),
    );
