// @flow
import { useMemo, useCallback } from 'react';
import { convertAssignedUserToClient } from '../../../../converters';

export const useAssignee = (event: ApiEnrollmentEvent) =>
    useMemo(() => convertAssignedUserToClient(event?.assignedUser), [event?.assignedUser]);

export const useAssignedUserSaveContext = (event: ApiEnrollmentEvent) => useCallback(() => ({ event }), [event]);
