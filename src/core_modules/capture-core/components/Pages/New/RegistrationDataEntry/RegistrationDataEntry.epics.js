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


const deriveAttributesFromFormValues = (formValues = {}) =>
    Object.keys(formValues)
        .map(key => ({ attribute: key, value: formValues[key] }));

export const startSavingNewTrackedEntityInstanceEpic: Epic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE_START),
        map(() => {
            const { orgUnitId, trackedEntityTypeId } = store.value.currentSelections;

            return saveNewTrackedEntityInstance(
                {
                    attributes: deriveAttributesFromFormValues(store.value.formsValues['newPageDataEntryId-newTei']),
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
            const { orgUnitId, programId } = store.value.currentSelections;
            const enrollmentFormValues = store.value.dataEntriesFieldsValue['newPageDataEntryId-newEnrollment'] || {};
            const trackerProgram = getTrackerProgramThrowIfNotFound(programId);
            return saveNewTrackedEntityInstanceWithEnrollment(
                {
                    attributes: deriveAttributesFromFormValues(store.value.formsValues['newPageDataEntryId-newEnrollment']),
                    enrollments: [
                        {
                            ...enrollmentFormValues,
                            program: programId,
                            orgUnit: orgUnitId,
                            status: 'ACTIVE',
                        },
                    ],
                    orgUnit: orgUnitId,
                    trackedEntityType: trackerProgram.trackedEntityType.id,
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
