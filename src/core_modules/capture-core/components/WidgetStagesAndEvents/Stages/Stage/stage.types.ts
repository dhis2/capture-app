import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import type { Stage, StageCommonProps } from '../../types/common.types';

type ExtractedProps = {
    programId: string;
    stage: Stage;
    events: Array<ApiEnrollmentEvent>;
    onEventClick: (eventId: string) => void;
    onDeleteEvent: (eventId: string) => void;
    onOptimisticStatusUpdate: (event: ApiEnrollmentEvent, newStatus: string) => void;
    onStatusUpdateSuccess: (eventId: string) => void;
    onStatusUpdateError: (eventId: string) => void;
    onRollbackDeleteEvent: (eventId: ApiEnrollmentEvent) => void;
};

export type Props = ExtractedProps & StageCommonProps;
