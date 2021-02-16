// @flow
import { ofType } from 'redux-observable';
import { flatMap, map } from 'rxjs/operators';
import { empty } from 'rxjs';
import {
    registrationFormActionTypes,
    saveNewTrackedEntityInstance,
    saveNewTrackedEntityInstanceWithEnrollment,
} from './RegistrationDataEntry.actions';
import { navigateToTrackedEntityDashboard } from '../../../../utils/navigateToTrackedEntityDashboard';
import { getTrackerProgramThrowIfNotFound, scopeTypes } from '../../../../metaData';
import { convertDateObjectToDateFormatString } from '../../../../utils/converters/date';


const deriveAttributesFromFormValues = (formValues = {}) =>
    Object.keys(formValues)
        .map(key => ({ attribute: key, value: formValues[key] }));

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
            const events = [...stages.values()]
                .filter(autoGenerateEvent => autoGenerateEvent)
                .map(
                    ({ generatedByEnrollmentDate, openAfterEnrollment, reportDateToUse, id }) => {
                        const dateToUseInActiveStatus = reportDateToUse === 'enrollmentDate' ? enrollmentDate : (incidentDate || enrollmentDate);
                        const dateToUseInScheduleStatus = generatedByEnrollmentDate ? enrollmentDate : (incidentDate || enrollmentDate);

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
                                dueDate: dateToUseInScheduleStatus,
                            };
                        debugger;
                        return {
                            ...eventInfo,
                            programStage: id,
                            program: programId,
                            orgUnit: orgUnitId,
                        };
                    },
                );
            debugger;
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
