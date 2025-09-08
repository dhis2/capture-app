import { useMemo, useCallback } from 'react';
import { dataElementTypes } from '../../../../metaData';
import { convertServerToClient } from '../../../../converters';
import type { UserFormField } from '../../../FormFields/UserField';

export const useAssignee = (event: Record<string, unknown>): UserFormField | null =>
    useMemo(() => convertServerToClient(event?.assignedUser, dataElementTypes.ASSIGNEE), [event?.assignedUser]);

export const useAssignedUserSaveContext = (event: Record<string, unknown>) => useCallback(() => ({ event }), [event]);
