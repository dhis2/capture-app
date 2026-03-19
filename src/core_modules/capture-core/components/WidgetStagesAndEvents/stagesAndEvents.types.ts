import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import type { Stage, StageCommonProps, Event } from './types/common.types';

type ExtractedProps = {
    stages?: Array<Stage>;
    events: Array<Event> | null;
    onEventClick: (eventId: string) => void;
    onDeleteEvent: (eventId: string) => void;
    onUpdateEventStatus: (eventId: string, status: string) => void;
    onRollbackDeleteEvent: (eventId: ApiEnrollmentEvent) => void;
    className?: string;
};

export type Props = ExtractedProps & StageCommonProps;
