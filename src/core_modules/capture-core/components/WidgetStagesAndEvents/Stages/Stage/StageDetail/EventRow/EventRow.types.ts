import type { ReactElement } from 'react';
import type { ApiEnrollmentEvent } from '../../../../../../../capture-core-utils/types/api-types';

export type EventRowProps = {
    id: string;
    pendingApiResponse: boolean;
    eventDetails: ApiEnrollmentEvent;
    cells: Array<ReactElement>;
    onEventClick: (id: string, options?: Record<string, unknown>) => void;
    onDeleteEvent: (id: string) => void;
    onUpdateEventStatus: (id: string, status: string) => void;
    onRollbackDeleteEvent: (event: ApiEnrollmentEvent) => void;
    stageWriteAccess: boolean;
    teiId: string;
    programId: string;
    enrollmentId: string;
};
