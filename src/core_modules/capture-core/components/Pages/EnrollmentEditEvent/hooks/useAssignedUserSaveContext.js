// @flow
import { useCallback, useMemo } from 'react';
import { convertServerToClient, convertClientToServer } from '../../../WidgetAssignee';
import type { EnrollmentData } from '../../common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';
import type { UserFormField } from '../../../FormFields/UserField';

export const useAssignee = (event?: ApiEnrollmentEvent) =>
    useMemo(() => convertServerToClient(event?.assignedUser), [event?.assignedUser]);

export const useAssignedUserSaveContext = (
    enrollmentSite?: EnrollmentData,
    event?: ApiEnrollmentEvent,
    eventId: string,
) =>
    useCallback(
        (newAssignee: UserFormField) => ({
            eventId,
            assignedUser: event?.assignedUser,
            events: enrollmentSite?.events
            // $FlowFixMe[missing-annot]
                ? enrollmentSite.events.map(e => (
                    e.event === eventId ? { ...e, assignedUser: convertClientToServer(newAssignee) } : e
                ))
                : [],
        }),
        [enrollmentSite?.events, event?.assignedUser, eventId],
    );
