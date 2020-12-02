import { actionCreator } from '../../../../actions/actions.utils';
import { effectMethods } from '../../../../trackerOffline';

export const registrationFormActionTypes = {
    NEW_TRACKED_ENTITY_TYPE_SAVE_START: 'StartSavingNewTrackedEntityType',
    NEW_TRACKED_ENTITY_TYPE_SAVE: 'SaveNewTrackedEntityType',
    NEW_TRACKED_ENTITY_TYPE_SAVE_COMPLETED: 'CompleteSavingNewTrackedEntityType',
};

export const startSavingNewTrackedEntityType = () =>
    actionCreator(registrationFormActionTypes.NEW_TRACKED_ENTITY_TYPE_SAVE_START)();

export const saveNewTrackedEntityType = candidateForRegistration =>
    actionCreator(registrationFormActionTypes.NEW_TRACKED_ENTITY_TYPE_SAVE)({ ...candidateForRegistration },
        {
            offline: {
                effect: {
                    url: 'trackedEntityInstances',
                    method: effectMethods.POST,
                    data: candidateForRegistration,
                },
                commit: {
                    type: registrationFormActionTypes.NEW_TRACKED_ENTITY_TYPE_SAVE_COMPLETED,
                },
            },
        });
