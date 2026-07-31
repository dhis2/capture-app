import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import type { Stage, StageCommonProps } from '../../types/common.types';

type ExtractedProps = {
    programId: string;
    stage: Stage;
    events: Array<ApiEnrollmentEvent>;
    onEventClick: (eventId: string) => void;
    onDeleteEvent: (eventId: string) => void;
    onStatusMutate: (event: ApiEnrollmentEvent, newStatus: string) => void;
    onStatusUpdated: (eventId: string) => void;
    onStatusError: (eventId: string) => void;
    onRollbackDeleteEvent: (eventId: ApiEnrollmentEvent) => void;
};

export type Props = ExtractedProps & StageCommonProps;
