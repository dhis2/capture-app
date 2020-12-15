// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { empty } from 'rxjs';
import {
    registrationFormActionTypes,
    saveNewTrackedEntityType,
    saveNewTrackedEntityTypeWithEnrollment,
} from './RegistrationDataEntry.actions';
import { navigateToTrackedEntityDashboard } from '../../../../utils/navigateToTrackedEntityDashboard';
import { getScopeFromScopeId, scopeTypes } from '../../../../metaData';


const deriveAttributesFromFormValues = (formValues = {}) =>
    Object.keys(formValues)
        .map(key => ({ attribute: key, value: formValues[key] }));

export const startSavingNewTrackedEntityTypeEpic: Epic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_TYPE_SAVE_START),
        map(() => {
            const { orgUnitId, trackedEntityTypeId } = store.value.currentSelections;

            return saveNewTrackedEntityType(
                {
                    attributes: deriveAttributesFromFormValues(store.value.formsValues['newPageDataEntryId-newTei']),
                    enrollments: [],
                    orgUnit: orgUnitId,
                    trackedEntityType: trackedEntityTypeId,
                });
        }),
    );

export const completeSavingNewTrackedEntityTypeEpic: Epic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_TYPE_SAVE_COMPLETED),
        map(({ payload: { response: { importSummaries: [{ reference }] } } }) => {
            const { orgUnitId, trackedEntityTypeId } = store.value.currentSelections;

            navigateToTrackedEntityDashboard(
                reference,
                orgUnitId,
                `${scopeTypes.TRACKED_ENTITY_TYPE.toLowerCase()}=${trackedEntityTypeId}`,
            );
            return empty();
        }),
    );

export const startSavingNewTrackedEntityTypeWithEnrollmentEpic: Epic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_TYPE_WITH_ENROLLMENT_SAVE_START),
        map(() => {
            const { orgUnitId, programId } = store.value.currentSelections;
            const enrollmentFormValues = store.value.dataEntriesFieldsValue['newPageDataEntryId-newEnrollment'] || {};
            const scope = getScopeFromScopeId(programId);
            return saveNewTrackedEntityTypeWithEnrollment(
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
                    trackedEntityType: scope && scope.trackedEntityType && scope.trackedEntityType.id,
                });
        }),
    );

export const completeSavingNewTrackedEntityTypeWithEnrollmentEpic: Epic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(registrationFormActionTypes.NEW_TRACKED_ENTITY_TYPE_WITH_ENROLLMENT_SAVE_COMPLETED),
        map(({ payload: { response: { importSummaries: [{ reference }] } } }) => {
            const { orgUnitId, programId } = store.value.currentSelections;

            navigateToTrackedEntityDashboard(
                reference,
                orgUnitId,
                `program=${programId}`,
            );
            return empty();
        }),
    );
