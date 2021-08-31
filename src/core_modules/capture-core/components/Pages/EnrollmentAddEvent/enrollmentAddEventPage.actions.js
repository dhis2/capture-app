// @flow
import { push } from 'connected-react-router';

export const addEnrollmentEventPageActionTypes = {
    EVENT_SAVE_SUCCESS: 'NewEnrollmentEventPage.saveEventSuccess',
    EVENT_SAVE_ERROR: 'NewEnrollmentEventPage.saveEventError',
};

export const navigateToEnrollmentPage = (programId: string, orgUnitId: string, teiId: string, enrollmentId?: string) =>
    push(`/enrollment?programId=${programId}&orgUnitId=${orgUnitId}&teiId=${teiId}${
        enrollmentId ? `&enrollmentId=${enrollmentId}` : ''}`);

