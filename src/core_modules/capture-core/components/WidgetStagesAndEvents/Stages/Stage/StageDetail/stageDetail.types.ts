import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import type { StageDataElement, StageCommonProps } from '../../../types/common.types';

type ExtractedProps = {
    events: Array<ApiEnrollmentEvent>;
    dataElements: Array<StageDataElement>;
    eventName: string;
    hideDueDate?: boolean;
    repeatable?: boolean;
    enableUserAssignment?: boolean;
    stageId: string;
    onCreateNew: (stageId: string) => void;
    onDeleteEvent: (eventId: string) => void;
    onOptimisticStatusUpdate: (event: ApiEnrollmentEvent, newStatus: string) => void;
    onStatusUpdateSuccess: (eventId: string) => void;
    onStatusUpdateError: (eventId: string) => void;
    onRollbackDeleteEvent: (event: ApiEnrollmentEvent) => void;
    hiddenProgramStage?: boolean;
};

export type Props = ExtractedProps & StageCommonProps;
