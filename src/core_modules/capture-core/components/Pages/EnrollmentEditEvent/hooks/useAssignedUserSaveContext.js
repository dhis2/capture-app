// @flow
import { useMemo, useCallback } from 'react';
import { dataElementTypes } from '../../../../metaData';
import { convertServerToClient } from '../../../../converters';
import type { UserFormField } from '../../../FormFields/UserField';

export const useAssignee = (event: ApiEnrollmentEvent): UserFormField | null =>
    // $FlowFixMe dataElementTypes flow error
    useMemo(() => convertServerToClient(event?.assignedUser, dataElementTypes.ASSIGNEE), [event?.assignedUser]);

export const useAssignedUserSaveContext = (event: ApiEnrollmentEvent) => useCallback(() => ({ event }), [event]);
