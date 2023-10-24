// @flow
import { actionCreator } from '../../../../actions/actions.utils';
import { effectMethods } from '../../../../trackerOffline';
import type {
    EnrollmentPayload,
} from '../../../DataEntries/EnrollmentRegistrationEntry/EnrollmentRegistrationEntry.types';
import type {
    TeiPayload,
} from '../../common/TEIRelationshipsWidget/RegisterTei/DataEntry/TrackedEntityInstance/dataEntryTrackedEntityInstance.types';

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
export const startSavingNewTrackedEntityInstance = (teiPayload: TeiPayload) =>
    actionCreator(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE_START)({ teiPayload });

export const saveNewTrackedEntityInstance = (candidateForRegistration: any) =>
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
export const startSavingNewTrackedEntityInstanceWithEnrollment = (enrollmentPayload: EnrollmentPayload, uid: string) =>
    actionCreator(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_START)({
        enrollmentPayload,
        uid,
    });

export const saveNewTrackedEntityInstanceWithEnrollment = ({
    candidateForRegistration,
    redirectTo,
    uid,
    stageId,
    eventIndex,
}: {
    candidateForRegistration: any,
    redirectTo: string,
    uid: string,
    stageId?: string,
    eventIndex: number,
}) =>
    actionCreator(registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE)(
        { ...candidateForRegistration },
        {
            offline: {
                effect: {
                    url: 'tracker?async=false',
                    method: effectMethods.POST,
                    data: candidateForRegistration,
                },
                commit: {
                    type: registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_COMPLETED,
                    meta: { redirectTo, stageId, uid, eventIndex },
                },
                rollback: {
                    type: registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_FAILED,
                },
            },
        },
    );
