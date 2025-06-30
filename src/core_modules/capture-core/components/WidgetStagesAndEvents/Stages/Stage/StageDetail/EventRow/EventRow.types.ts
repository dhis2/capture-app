import type { ReactElement } from 'react';

export type EventRowProps = {
    id: string;
    pendingApiResponse: boolean;
    eventDetails: any;
    cells: Array<ReactElement>;
    onEventClick: (id: string, options?: Record<string, unknown>) => void;
    onDeleteEvent: (id: string) => void;
    onUpdateEventStatus: (id: string, status: string) => void;
    onRollbackDeleteEvent: (event: any) => void;
    stageWriteAccess: boolean;
    teiId: string;
    programId: string;
    enrollmentId: string;
};
