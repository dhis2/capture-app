import type { Stage, StageCommonProps } from '../types/common.types';
import type { ApiEnrollmentEvent } from '../../../../capture-core-utils/types/api-types';

export type PlainProps = {
    stages: Array<Stage>;
    events: Array<ApiEnrollmentEvent>;
    onEventClick: (eventId: string) => void;
    onDeleteEvent: (eventId: string) => void;
    onUpdateEventStatus: (eventId: string, status: string) => void;
    onRollbackDeleteEvent: (eventId: ApiEnrollmentEvent) => void;
} & StageCommonProps;

export type InputProps = {
    stages?: Array<Stage>;
    events?: Array<ApiEnrollmentEvent> | null;
    onEventClick: (eventId: string) => void;
    onDeleteEvent: (eventId: string) => void;
    onUpdateEventStatus: (eventId: string, status: string) => void;
    onRollbackDeleteEvent: (eventId: ApiEnrollmentEvent) => void;
} & StageCommonProps;
