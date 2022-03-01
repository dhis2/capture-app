import { actionCreator } from '../../../../actions/actions.utils';
import { effectMethods } from '../../../../trackerOffline';

export const registrationFormActionTypes = {
    NEW_TRACKED_ENTITY_INSTANCE_SAVE_START: 'StartSavingNewTrackedEntityInstance',
    NEW_TRACKED_ENTITY_INSTANCE_SAVE: 'SaveNewTrackedEntityInstance',
    NEW_TRACKED_ENTITY_INSTANCE_SAVE_COMPLETED: 'CompleteSavingNewTrackedEntityInstance',
    NEW_TRACKED_ENTITY_INSTANCE_SAVE_FAILED: 'FailSavingNewTrackedEntityInstance',

    NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_START: 'StartSavingNewTrackedEntityInstanceWithEnrollment',
    NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE: 'SaveNewTrackedEntityInstanceWithEnrollment',
    NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_COMPLETED: 'CompleteSavingNewTrackedEntityInstanceWithEnrollment',
    NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_FAILED: 'FailSavingNewTrackedEntityInstanceWithEnrollment',
};

// without enrollment
export const startSavingNewTrackedEntityInstance = formFoundation =>
    actionCreator(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE_START)({ formFoundation });

export const saveNewTrackedEntityInstance = candidateForRegistration =>
    actionCreator(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE)(
        { ...candidateForRegistration },
        {
            offline: {
                effect: {
                    url: 'tracker?async=false',
                    method: effectMethods.POST,
                    data: candidateForRegistration,
                },
                commit: {
                    type: registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE_COMPLETED,
                },
                rollback: {
                    type: registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE_FAILED,
                },

            },
        },
    );

// with enrollment
export const startSavingNewTrackedEntityInstanceWithEnrollment = (formFoundation, teiId) =>
    actionCreator(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_START)({ formFoundation, teiId });

export const saveNewTrackedEntityInstanceWithEnrollment = candidateForRegistration =>
    actionCreator(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE)({ ...candidateForRegistration },
        {
            offline: {
                effect: {
                    url: 'tracker?async=false',
                    method: effectMethods.POST,
                    data: candidateForRegistration,
                },
                commit: {
                    type: registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_COMPLETED,
                },
                rollback: {
                    type: registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_FAILED,
                },
            },
        });
