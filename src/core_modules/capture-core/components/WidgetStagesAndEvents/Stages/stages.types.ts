import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import type { Stage, StageCommonProps } from '../types/common.types';

export type PlainProps = {
    stages: Array<Stage>;
    events: Array<ApiEnrollmentEvent>;
    stageWriteAccessById?: Record<string, boolean>;
    stageReadAccessById?: Record<string, boolean>;
    programLoaded?: boolean;
    hideReadOnlyBadge?: boolean;
    onEventClick: (eventId: string) => void;
    onDeleteEvent: (eventId: string) => void;
    onUpdateEventStatus: (eventId: string, status: string) => void;
    onRollbackDeleteEvent: (eventId: ApiEnrollmentEvent) => void;
} & StageCommonProps;

export type InputProps = {
    stages?: Array<Stage>;
    events?: Array<ApiEnrollmentEvent> | null;
    stageWriteAccessById?: Record<string, boolean>;
    stageReadAccessById?: Record<string, boolean>;
    programLoaded?: boolean;
    hideReadOnlyBadge?: boolean;
    onEventClick: (eventId: string) => void;
    onDeleteEvent: (eventId: string) => void;
    onUpdateEventStatus: (eventId: string, status: string) => void;
    onRollbackDeleteEvent: (eventId: ApiEnrollmentEvent) => void;
} & StageCommonProps;
